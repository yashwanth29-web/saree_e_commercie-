'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Phone,
  MessageSquare,
  Lock,
  Eye,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  ShoppingBag,
  Send
} from 'lucide-react';

interface OrderItem {
  id?: string;
  quantity: number;
  price: number;
  product?: {
    name: string;
    sku?: string;
    fabric?: string;
    images?: { url: string }[];
  };
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  items: OrderItem[];
  courierName?: string;
  trackingNumber?: string;
}

const STATUS_ORDER = ['CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED'];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  CONFIRMED: { label: 'Confirmed', color: 'text-amber-800', bg: 'bg-amber-50', border: 'border-amber-200' },
  PROCESSING: { label: 'At Looms', color: 'text-indigo-800', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  PACKED: { label: 'Packed & Ready', color: 'text-blue-800', bg: 'bg-blue-50', border: 'border-blue-200' },
  SHIPPED: { label: 'Dispatched', color: 'text-purple-800', bg: 'bg-purple-50', border: 'border-purple-200' },
  DELIVERED: { label: 'Delivered', color: 'text-emerald-800', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  CANCELLED: { label: 'Cancelled', color: 'text-rose-800', bg: 'bg-rose-50', border: 'border-rose-200' },
};

export default function OwnerOrdersDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isDemoData, setIsDemoData] = useState(false);

  // Tracking inputs state per order
  const [trackingInputs, setTrackingInputs] = useState<Record<string, { courier: string; awb: string }>>({});

  // Check saved session
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('dl_owner_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.success && data.orders) {
        setOrders(data.orders);
        setIsDemoData(!!data.isDemo);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'admin123' || passcode.trim() === 'owner123' || passcode.trim() === '1234') {
      sessionStorage.setItem('dl_owner_auth', 'true');
      setIsAuthenticated(true);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedOrders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const tracking = trackingInputs[orderId] || {};
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderStatus: newStatus,
          courierName: tracking.courier,
          trackingNumber: tracking.awb,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev =>
          prev.map(o => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
      }
    } catch (err) {
      console.error('Update status failed:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const generateWhatsAppMessage = (order: Order) => {
    const statusText = STATUS_CONFIG[order.orderStatus]?.label || order.orderStatus;
    const msg = `Namaste ${order.customerName}! 🙏\n\nThis is from *DL Handlooms Mangalagiri*.\nYour order *#${order.orderNumber}* is currently: *${statusText}*.\n\nTotal: ₹${order.total.toLocaleString('en-IN')}\nTrack your package anytime at: https://saree-e-commercie.vercel.app/track-order?orderNumber=${order.orderNumber}\n\nThank you for supporting authentic handloom weavers! 🌿`;
    return encodeURIComponent(msg);
  };

  // KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalCount = orders.length;
  const pendingCount = orders.filter(o => ['CONFIRMED', 'PROCESSING', 'PACKED'].includes(o.orderStatus)).length;
  const deliveredCount = orders.filter(o => o.orderStatus === 'DELIVERED').length;

  // Filtered
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery);

    const matchesStatus =
      statusFilter === 'ALL' || order.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Passcode Lock Modal
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#1F1815] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#2B231F] border border-[#C5A880]/30 rounded-lg p-8 shadow-2xl text-center">
          <div className="w-14 h-14 bg-[#7A211B] text-[#EFE9DF] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#C5A880]/40">
            <Lock className="w-7 h-7" />
          </div>

          <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#C5A880] block mb-1">
            DL Handlooms &bull; Owner Portal
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#F7F3ED] mb-2">
            Store Owner Access
          </h1>
          <p className="text-xs text-[#EFE9DF]/70 mb-6">
            Enter your owner PIN to manage customer orders & track dispatches.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter PIN (Default: admin123)"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setPasscodeError(false);
                }}
                className="w-full bg-[#1F1815] border border-[#C5A880]/40 focus:border-[#C5A880] text-[#F7F3ED] px-4 py-3 rounded-md text-center text-lg tracking-widest outline-none transition-all placeholder:text-[#EFE9DF]/30"
                autoFocus
              />
              {passcodeError && (
                <p className="text-xs text-rose-400 mt-2 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Incorrect PIN. Try: admin123
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#7A211B] hover:bg-[#8D2720] text-[#F7F3ED] py-3 rounded-md font-semibold text-sm tracking-wider uppercase transition-all shadow-md hover:shadow-lg border border-[#C5A880]/30"
            >
              Unlock Dashboard
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#C5A880]/20 flex items-center justify-between text-[11px] text-[#EFE9DF]/50">
            <span>Mangalagiri Loom Management</span>
            <Link href="/" className="hover:text-[#C5A880] transition-colors">
              Return to Store &rarr;
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F3ED] flex flex-col text-[#222222]">
      {/* Top Owner Bar */}
      <header className="bg-[#2B231F] text-[#F7F3ED] border-b border-[#C5A880]/30 px-6 py-4 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#7A211B] border border-[#C5A880]/40 rounded-sm flex items-center justify-center text-[#EFE9DF]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-lg text-[#F7F3ED] tracking-wide">
                  DL Handlooms Owner Hub
                </h1>
                <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase tracking-wider bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/40">
                  Live Dispatch
                </span>
              </div>
              <p className="text-[11px] text-[#EFE9DF]/60 font-sans">
                Order Tracking & Customer Fulfillment Center
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrders}
              className="px-3 py-1.5 rounded-sm bg-[#1F1815] hover:bg-[#382E29] text-xs text-[#EFE9DF] border border-[#C5A880]/30 flex items-center gap-1.5 transition-colors"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <Link
              href="/track-order"
              target="_blank"
              className="px-3 py-1.5 rounded-sm bg-[#C5A880]/20 hover:bg-[#C5A880]/30 text-xs text-[#C5A880] border border-[#C5A880]/40 flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Customer Tracking View</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <Link
              href="/"
              className="px-3 py-1.5 rounded-sm bg-[#7A211B] hover:bg-[#8D2720] text-xs text-[#F7F3ED] font-medium transition-colors"
            >
              Back to Store
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-[#222222]/10 rounded-sm p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-sans text-[#222222]/60 font-medium tracking-wide uppercase">
                Total Orders
              </p>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-[#222222] mt-1">
                {totalCount}
              </p>
              <span className="text-[11px] text-[#1F7A4C] font-sans flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> Active store
              </span>
            </div>
            <div className="w-12 h-12 rounded-sm bg-[#7A211B]/10 text-[#7A211B] flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-[#222222]/10 rounded-sm p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-sans text-[#222222]/60 font-medium tracking-wide uppercase">
                Total Revenue
              </p>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-[#7A211B] mt-1">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </p>
              <span className="text-[11px] text-[#222222]/50 font-sans mt-1 block">
                100% Weavers Paid
              </span>
            </div>
            <div className="w-12 h-12 rounded-sm bg-[#C5A880]/20 text-[#8C6D46] flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-[#222222]/10 rounded-sm p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-sans text-[#222222]/60 font-medium tracking-wide uppercase">
                Pending Dispatch
              </p>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-amber-700 mt-1">
                {pendingCount}
              </p>
              <span className="text-[11px] text-amber-600 font-sans mt-1 block">
                Needs packing & label
              </span>
            </div>
            <div className="w-12 h-12 rounded-sm bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-[#222222]/10 rounded-sm p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-sans text-[#222222]/60 font-medium tracking-wide uppercase">
                Delivered
              </p>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-emerald-700 mt-1">
                {deliveredCount}
              </p>
              <span className="text-[11px] text-emerald-600 font-sans mt-1 block">
                Satisfied customers
              </span>
            </div>
            <div className="w-12 h-12 rounded-sm bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white border border-[#222222]/10 rounded-sm p-4 mb-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#222222]/40" />
            <input
              type="text"
              placeholder="Search by Order #, Name, Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-[#222222]/15 rounded-sm text-xs focus:border-[#7A211B] outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {['ALL', 'CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-sm text-xs font-medium tracking-wider uppercase transition-all whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-[#7A211B] text-white shadow-xs'
                    : 'bg-[#F7F3ED] text-[#222222]/70 hover:bg-[#EFE9DF]'
                }`}
              >
                {st === 'ALL' ? 'All Orders' : STATUS_CONFIG[st]?.label || st}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="bg-white border border-[#222222]/10 rounded-sm p-16 text-center shadow-xs">
            <RefreshCw className="w-8 h-8 animate-spin text-[#7A211B] mx-auto mb-3" />
            <p className="font-serif text-lg font-bold text-[#222222]">Loading Store Orders...</p>
            <p className="text-xs text-[#222222]/60 mt-1">Connecting to live loom records</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white border border-[#222222]/10 rounded-sm p-16 text-center shadow-xs">
            <Package className="w-10 h-10 text-[#222222]/30 mx-auto mb-3" />
            <p className="font-serif text-lg font-bold text-[#222222]">No orders match your filter</p>
            <p className="text-xs text-[#222222]/60 mt-1">Try clearing search or filter by &quot;All Orders&quot;.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusCfg = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.CONFIRMED;
              const isExpanded = !!expandedOrders[order.id];
              const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={order.id}
                  className="bg-white border border-[#222222]/10 rounded-sm shadow-xs overflow-hidden transition-all hover:border-[#222222]/20"
                >
                  {/* Order Summary Row */}
                  <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222222]/5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-sm bg-[#F7F3ED] border border-[#222222]/10 flex items-center justify-center flex-shrink-0 text-[#7A211B] font-mono font-bold text-xs">
                        #{order.orderNumber.slice(-3)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-base text-[#7A211B]">
                            {order.orderNumber}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-xs text-[11px] font-bold uppercase tracking-wider border ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border}`}
                          >
                            {statusCfg.label}
                          </span>
                          <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {order.paymentStatus}
                          </span>
                        </div>
                        <p className="text-xs text-[#222222]/60 mt-1">
                          Placed by <span className="font-semibold text-[#222222]">{order.customerName}</span> &bull; {orderDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap justify-between md:justify-end">
                      <div className="text-right mr-2">
                        <p className="text-[10px] font-sans uppercase tracking-wider text-[#222222]/50">Total Amount</p>
                        <p className="font-serif font-bold text-lg text-[#222222]">
                          ₹{order.total.toLocaleString('en-IN')}
                        </p>
                      </div>

                      {/* WhatsApp Direct Action */}
                      <a
                        href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=${generateWhatsAppMessage(order)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-sm bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                        title="Chat with customer on WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </a>

                      <button
                        onClick={() => toggleExpand(order.id)}
                        className="px-3 py-2 rounded-sm bg-[#F7F3ED] hover:bg-[#EFE9DF] text-xs font-medium text-[#222222] border border-[#222222]/10 flex items-center gap-1 transition-colors"
                      >
                        <span>{isExpanded ? 'Hide Details' : 'Manage & Track'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Order Controls */}
                  {isExpanded && (
                    <div className="p-4 sm:p-6 bg-[#FAFAF8] border-t border-[#222222]/5 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Customer & Shipping Details */}
                        <div className="bg-white p-4 rounded-sm border border-[#222222]/10 space-y-3">
                          <h3 className="font-serif font-bold text-sm text-[#222222] flex items-center gap-1.5 pb-2 border-b border-[#222222]/10">
                            <Phone className="w-4 h-4 text-[#7A211B]" />
                            Customer Contact
                          </h3>
                          <div className="text-xs space-y-1.5 font-sans">
                            <p><span className="text-[#222222]/50">Name:</span> <span className="font-semibold">{order.customerName}</span></p>
                            <p><span className="text-[#222222]/50">Phone:</span> <span className="font-mono font-semibold">{order.customerPhone}</span></p>
                            <p><span className="text-[#222222]/50">Email:</span> <span>{order.customerEmail}</span></p>
                            <div className="pt-2">
                              <p className="text-[11px] font-medium text-[#222222]/50 uppercase tracking-wider mb-0.5">Shipping Address:</p>
                              <p className="text-xs text-[#222222]/80 leading-relaxed bg-[#F7F3ED] p-2 rounded-xs border border-[#222222]/5">
                                {order.shippingAddress}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Status Stepper & Courier Details */}
                        <div className="bg-white p-4 rounded-sm border border-[#222222]/10 space-y-4 md:col-span-2">
                          <h3 className="font-serif font-bold text-sm text-[#222222] flex items-center gap-1.5 pb-2 border-b border-[#222222]/10">
                            <Truck className="w-4 h-4 text-[#7A211B]" />
                            Order Tracking & Fulfillment Control
                          </h3>

                          {/* Quick Stage Buttons */}
                          <div>
                            <p className="text-[11px] text-[#222222]/60 uppercase tracking-wider font-semibold mb-2">
                              Update Fulfillment Stage:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {STATUS_ORDER.map((stage) => {
                                const isCurrent = order.orderStatus === stage;
                                return (
                                  <button
                                    key={stage}
                                    onClick={() => handleStatusChange(order.id, stage)}
                                    disabled={updatingId === order.id}
                                    className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                                      isCurrent
                                        ? 'bg-[#7A211B] text-white shadow-xs'
                                        : 'bg-[#F7F3ED] text-[#222222]/70 hover:bg-[#EFE9DF] border border-[#222222]/10'
                                    }`}
                                  >
                                    {isCurrent && <CheckCircle className="w-3.5 h-3.5" />}
                                    <span>{STATUS_CONFIG[stage]?.label || stage}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Courier Input */}
                          <div className="pt-2 border-t border-[#222222]/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] text-[#222222]/60 font-semibold uppercase tracking-wider mb-1">
                                Courier Partner
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. DTDC, India Post, Blue Dart"
                                defaultValue={order.courierName || 'DTDC Express'}
                                onChange={(e) =>
                                  setTrackingInputs(prev => ({
                                    ...prev,
                                    [order.id]: { ...(prev[order.id] || {}), courier: e.target.value, awb: prev[order.id]?.awb || order.trackingNumber || '' }
                                  }))
                                }
                                className="w-full px-3 py-1.5 border border-[#222222]/15 rounded-sm text-xs outline-none focus:border-[#7A211B]"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-[#222222]/60 font-semibold uppercase tracking-wider mb-1">
                                AWB / Tracking Number
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="e.g. DTDC-992812"
                                  defaultValue={order.trackingNumber || `AWB-${order.orderNumber.replace('DL-', '')}`}
                                  onChange={(e) =>
                                    setTrackingInputs(prev => ({
                                      ...prev,
                                      [order.id]: { ...(prev[order.id] || {}), awb: e.target.value, courier: prev[order.id]?.courier || order.courierName || '' }
                                    }))
                                  }
                                  className="w-full px-3 py-1.5 border border-[#222222]/15 rounded-sm text-xs outline-none focus:border-[#7A211B] font-mono"
                                />
                                <button
                                  onClick={() => handleStatusChange(order.id, order.orderStatus)}
                                  className="px-3 py-1.5 bg-[#2B231F] hover:bg-[#3E332D] text-[#F7F3ED] text-xs font-semibold rounded-sm whitespace-nowrap transition-colors"
                                >
                                  Save AWB
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Items Ordered Table */}
                      <div className="bg-white p-4 rounded-sm border border-[#222222]/10">
                        <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#222222]/60 pb-2 border-b border-[#222222]/10 mb-3">
                          Handloom Sarees Packed in this Order ({order.items.length})
                        </h4>
                        <div className="divide-y divide-[#222222]/5">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="py-2.5 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-14 bg-[#EFE9DF] rounded-xs overflow-hidden border border-[#222222]/10 flex-shrink-0">
                                  <ImageWithFallback
                                    src={item.product?.images?.[0]?.url || '/sarees/cat-pattu.jpg'}
                                    alt={item.product?.name || 'Saree'}
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-serif font-bold text-xs text-[#222222]">
                                    {item.product?.name || 'Mangalagiri Saree'}
                                  </p>
                                  <p className="text-[10px] text-[#7A211B] font-semibold mt-0.5">
                                    {item.product?.fabric || 'Pure Handloom'} &bull; SKU: {item.product?.sku || 'DL-PAT'}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs font-bold text-[#222222]">
                                  ₹{item.price.toLocaleString('en-IN')} &times; {item.quantity}
                                </p>
                                <p className="text-[10px] text-[#222222]/50">
                                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer info */}
      <footer className="bg-white border-t border-[#222222]/10 py-6 px-4 text-center text-xs text-[#222222]/50 font-sans">
        <p>DL Handlooms &bull; Authentic Mangalagiri Handloom Weavers Society Management</p>
        <p className="mt-1 text-[11px]">Owner Passcode: <code className="bg-[#F7F3ED] px-1.5 py-0.5 rounded-xs font-mono">admin123</code></p>
      </footer>
    </main>
  );
}
