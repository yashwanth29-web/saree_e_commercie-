'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Search,
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
  ShoppingBag,
  ArrowLeft,
  Check,
  MapPin,
  Mail,
  User,
  Share2
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

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; dot: string }> = {
  CONFIRMED: { label: 'Confirmed', color: 'text-amber-800', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500' },
  PROCESSING: { label: 'At Looms', color: 'text-indigo-800', bg: 'bg-indigo-50', border: 'border-indigo-200', dot: 'bg-indigo-500' },
  PACKED: { label: 'Packed', color: 'text-blue-800', bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-500' },
  SHIPPED: { label: 'Dispatched', color: 'text-purple-800', bg: 'bg-purple-50', border: 'border-purple-200', dot: 'bg-purple-500' },
  DELIVERED: { label: 'Delivered', color: 'text-emerald-800', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  CANCELLED: { label: 'Cancelled', color: 'text-rose-800', bg: 'bg-rose-50', border: 'border-rose-200', dot: 'bg-rose-500' },
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
  const [saveNotification, setSaveNotification] = useState<string | null>(null);

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
          prev.map(o => (o.id === orderId ? { ...o, orderStatus: newStatus, ...(tracking.courier && { courierName: tracking.courier }), ...(tracking.awb && { trackingNumber: tracking.awb }) } : o))
        );
        setSaveNotification(`Order updated to ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
        setTimeout(() => setSaveNotification(null), 3000);
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

  // Passcode Lock Modal (Mobile Optimized)
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#1F1815] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-[#2B231F] border border-[#C5A880]/30 rounded-lg p-6 sm:p-8 shadow-2xl text-center">
          <div className="w-14 h-14 bg-[#7A211B] text-[#EFE9DF] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#C5A880]/40">
            <Lock className="w-7 h-7" />
          </div>

          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-[#C5A880] block mb-1">
            DL Handlooms &bull; Owner Portal
          </span>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#F7F3ED] mb-2">
            Store Owner Access
          </h1>
          <p className="text-xs text-[#EFE9DF]/70 mb-6 max-w-xs mx-auto">
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
                className="w-full bg-[#1F1815] border border-[#C5A880]/40 focus:border-[#C5A880] text-[#F7F3ED] px-4 py-3 rounded-md text-center text-base sm:text-lg tracking-widest outline-none transition-all placeholder:text-[#EFE9DF]/30"
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
              className="w-full bg-[#7A211B] hover:bg-[#8D2720] text-[#F7F3ED] py-3.5 rounded-md font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md active:scale-[0.99] border border-[#C5A880]/30 min-h-[44px]"
            >
              Unlock Dashboard
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#C5A880]/20 flex items-center justify-between text-[11px] text-[#EFE9DF]/50">
            <span>Mangalagiri Loom Management</span>
            <Link href="/" className="hover:text-[#C5A880] transition-colors flex items-center gap-1">
              Store &rarr;
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F3ED] flex flex-col text-[#222222] pb-12">
      {/* Toast Notification */}
      {saveNotification && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-[#2B231F] text-[#F7F3ED] border border-[#C5A880]/40 px-4 py-3 rounded-sm shadow-xl flex items-center gap-2 text-xs animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{saveNotification}</span>
        </div>
      )}

      {/* Top Header - Mobile First */}
      <header className="bg-[#2B231F] text-[#F7F3ED] border-b border-[#C5A880]/30 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto max-w-7xl px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Title & Brand */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#7A211B] border border-[#C5A880]/40 rounded-sm flex items-center justify-center text-[#EFE9DF] flex-shrink-0">
                <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h1 className="font-serif font-bold text-sm sm:text-base md:text-lg text-[#F7F3ED] tracking-wide truncate">
                    DL Handlooms Hub
                  </h1>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-xs text-[9px] sm:text-[10px] font-mono uppercase tracking-wider bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/40">
                    Owner
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#EFE9DF]/60 font-sans truncate">
                  Order Tracking &amp; Fulfillment
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <button
                onClick={fetchOrders}
                className="p-2 sm:px-3 sm:py-1.5 rounded-sm bg-[#1F1815] hover:bg-[#382E29] text-xs text-[#EFE9DF] border border-[#C5A880]/30 flex items-center gap-1.5 transition-colors min-h-[36px]"
                title="Refresh Orders"
                aria-label="Refresh Orders"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden md:inline">Refresh</span>
              </button>

              <Link
                href="/track-order"
                target="_blank"
                className="p-2 sm:px-3 sm:py-1.5 rounded-sm bg-[#C5A880]/20 hover:bg-[#C5A880]/30 text-xs text-[#C5A880] border border-[#C5A880]/40 flex items-center gap-1.5 transition-colors min-h-[36px]"
                title="Public Customer Tracking View"
                aria-label="Customer Tracking"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Track View</span>
                <ExternalLink className="w-3 h-3 hidden sm:inline" />
              </Link>

              <Link
                href="/"
                className="px-2.5 sm:px-3 py-1.5 rounded-sm bg-[#7A211B] hover:bg-[#8D2720] text-xs text-[#F7F3ED] font-medium transition-colors min-h-[36px] flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3 sm:hidden" />
                <span className="hidden sm:inline">Store</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-5 sm:py-8 flex-grow">
        {/* KPI Cards Grid - Responsive 2x2 on mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-5 sm:mb-8">
          <div className="bg-white border border-[#222222]/10 rounded-sm p-3.5 sm:p-5 shadow-xs flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-sans text-[#222222]/60 font-medium tracking-wide uppercase truncate">
                Total Orders
              </p>
              <p className="text-xl sm:text-3xl font-serif font-bold text-[#222222] mt-0.5 sm:mt-1">
                {totalCount}
              </p>
              <span className="text-[10px] sm:text-[11px] text-[#1F7A4C] font-sans flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3 h-3 flex-shrink-0" /> <span className="truncate">Active Looms</span>
              </span>
            </div>
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-sm bg-[#7A211B]/10 text-[#7A211B] flex items-center justify-center flex-shrink-0 ml-2">
              <ShoppingBag className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
          </div>

          <div className="bg-white border border-[#222222]/10 rounded-sm p-3.5 sm:p-5 shadow-xs flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-sans text-[#222222]/60 font-medium tracking-wide uppercase truncate">
                Revenue
              </p>
              <p className="text-xl sm:text-3xl font-serif font-bold text-[#7A211B] mt-0.5 sm:mt-1 truncate">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] sm:text-[11px] text-[#222222]/50 font-sans mt-0.5 block truncate">
                Direct to Weavers
              </span>
            </div>
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-sm bg-[#C5A880]/20 text-[#8C6D46] flex items-center justify-center flex-shrink-0 ml-2">
              <DollarSign className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
          </div>

          <div className="bg-white border border-[#222222]/10 rounded-sm p-3.5 sm:p-5 shadow-xs flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-sans text-[#222222]/60 font-medium tracking-wide uppercase truncate">
                In Progress
              </p>
              <p className="text-xl sm:text-3xl font-serif font-bold text-amber-700 mt-0.5 sm:mt-1">
                {pendingCount}
              </p>
              <span className="text-[10px] sm:text-[11px] text-amber-600 font-sans mt-0.5 block truncate">
                Weaving &amp; Packing
              </span>
            </div>
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-sm bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 ml-2">
              <Clock className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
          </div>

          <div className="bg-white border border-[#222222]/10 rounded-sm p-3.5 sm:p-5 shadow-xs flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-sans text-[#222222]/60 font-medium tracking-wide uppercase truncate">
                Delivered
              </p>
              <p className="text-xl sm:text-3xl font-serif font-bold text-emerald-700 mt-0.5 sm:mt-1">
                {deliveredCount}
              </p>
              <span className="text-[10px] sm:text-[11px] text-emerald-600 font-sans mt-0.5 block truncate">
                Completed Orders
              </span>
            </div>
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-sm bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 ml-2">
              <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>

        {/* Filter & Search Bar - Mobile Responsive */}
        <div className="bg-white border border-[#222222]/10 rounded-sm p-3 sm:p-4 mb-5 shadow-xs space-y-3">
          {/* Search Input */}
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#222222]/40" />
            <input
              type="text"
              placeholder="Search Order #, Customer Name, Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-[#F7F3ED] border border-[#222222]/15 rounded-sm text-xs sm:text-sm focus:border-[#7A211B] outline-none transition-colors"
            />
          </div>

          {/* Horizontally Scrollable Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
            {['ALL', 'CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED'].map((st) => {
              const cfg = STATUS_CONFIG[st];
              const isSelected = statusFilter === st;

              return (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-sm text-[11px] font-semibold tracking-wider uppercase transition-all whitespace-nowrap flex items-center gap-1.5 min-h-[32px] ${
                    isSelected
                      ? 'bg-[#7A211B] text-white shadow-xs'
                      : 'bg-[#F7F3ED] text-[#222222]/70 hover:bg-[#EFE9DF] border border-[#222222]/10'
                  }`}
                >
                  {cfg?.dot && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : cfg.dot}`}
                    />
                  )}
                  <span>{st === 'ALL' ? 'All Orders' : cfg?.label || st}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="bg-white border border-[#222222]/10 rounded-sm p-12 sm:p-16 text-center shadow-xs">
            <RefreshCw className="w-7 h-7 animate-spin text-[#7A211B] mx-auto mb-3" />
            <p className="font-serif text-base sm:text-lg font-bold text-[#222222]">Loading Store Orders...</p>
            <p className="text-xs text-[#222222]/60 mt-1">Connecting to live loom records</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white border border-[#222222]/10 rounded-sm p-12 sm:p-16 text-center shadow-xs">
            <Package className="w-9 h-9 text-[#222222]/30 mx-auto mb-3" />
            <p className="font-serif text-base sm:text-lg font-bold text-[#222222]">No orders match your filter</p>
            <p className="text-xs text-[#222222]/60 mt-1">Try clearing your search or filter by &quot;All Orders&quot;.</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredOrders.map((order) => {
              const statusCfg = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.CONFIRMED;
              const isExpanded = !!expandedOrders[order.id];
              const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={order.id}
                  className="bg-white border border-[#222222]/10 rounded-sm shadow-xs overflow-hidden transition-all hover:border-[#222222]/20"
                >
                  {/* Order Summary Card (Mobile-Optimized) */}
                  <div className="p-3.5 sm:p-5">
                    {/* Top Row: Order# + Status Badges */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm sm:text-base text-[#7A211B]">
                          {order.orderNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-xs text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border flex items-center gap-1 ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                          {statusCfg.label}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase font-semibold">
                        {order.paymentStatus}
                      </span>
                    </div>

                    {/* Customer Info & Date */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#222222]/70 gap-1 pb-3 border-b border-[#222222]/5">
                      <div className="flex items-center gap-1.5 truncate">
                        <User className="w-3.5 h-3.5 text-[#222222]/40 flex-shrink-0" />
                        <span className="font-semibold text-[#222222] truncate">{order.customerName}</span>
                        <span className="text-[#222222]/40 hidden sm:inline">&bull;</span>
                        <span className="font-mono text-[#222222]/60 hidden sm:inline">{order.customerPhone}</span>
                      </div>
                      <span className="text-[11px] text-[#222222]/50 font-sans">
                        {orderDate}
                      </span>
                    </div>

                    {/* Bottom Action Bar (Full width touch-targets for mobile) */}
                    <div className="pt-3 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                      {/* Price display */}
                      <div>
                        <span className="text-[10px] font-sans uppercase tracking-wider text-[#222222]/50 block">Amount</span>
                        <span className="font-serif font-bold text-base sm:text-lg text-[#222222]">
                          ₹{order.total.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {/* Direct Call Button (Mobile phone) */}
                        <a
                          href={`tel:${order.customerPhone.replace(/\D/g, '')}`}
                          className="p-2 sm:px-2.5 sm:py-2 rounded-sm bg-[#F7F3ED] hover:bg-[#EFE9DF] text-[#222222] border border-[#222222]/10 flex items-center justify-center transition-colors min-h-[38px] min-w-[38px]"
                          title="Call Customer"
                          aria-label="Call Customer"
                        >
                          <Phone className="w-4 h-4 text-[#7A211B]" />
                        </a>

                        {/* WhatsApp Button */}
                        <a
                          href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=${generateWhatsAppMessage(order)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 sm:px-3 py-2 rounded-sm bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors min-h-[38px]"
                          title="Send update on WhatsApp"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-xs">WhatsApp</span>
                        </a>

                        {/* Expand/Collapse details */}
                        <button
                          onClick={() => toggleExpand(order.id)}
                          className="px-2.5 sm:px-3 py-2 rounded-sm bg-[#F7F3ED] hover:bg-[#EFE9DF] text-xs font-medium text-[#222222] border border-[#222222]/10 flex items-center gap-1 transition-colors min-h-[38px]"
                        >
                          <span>{isExpanded ? 'Hide' : 'Manage'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Management Area (Mobile Responsive) */}
                  {isExpanded && (
                    <div className="p-3.5 sm:p-5 bg-[#FAFAF8] border-t border-[#222222]/10 space-y-4">
                      {/* Customer Contact & Address Box */}
                      <div className="bg-white p-3.5 sm:p-4 rounded-sm border border-[#222222]/10 space-y-2">
                        <div className="flex items-center justify-between pb-2 border-b border-[#222222]/10">
                          <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-[#222222] flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#7A211B]" />
                            Delivery &amp; Customer Details
                          </h3>
                          <a
                            href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-[#25D366] font-semibold hover:underline flex items-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3" /> Chat
                          </a>
                        </div>
                        <div className="text-xs space-y-1 font-sans">
                          <p><span className="text-[#222222]/50">Customer:</span> <span className="font-semibold">{order.customerName}</span></p>
                          <p><span className="text-[#222222]/50">Phone:</span> <a href={`tel:${order.customerPhone}`} className="font-mono font-semibold text-[#7A211B] underline">{order.customerPhone}</a></p>
                          <p><span className="text-[#222222]/50">Email:</span> <span className="break-all">{order.customerEmail}</span></p>
                          <div className="pt-1.5">
                            <p className="text-[10px] font-medium text-[#222222]/50 uppercase tracking-wider mb-0.5">Full Address:</p>
                            <p className="text-xs text-[#222222]/85 leading-relaxed bg-[#F7F3ED] p-2.5 rounded-xs border border-[#222222]/5 break-words">
                              {order.shippingAddress}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Fulfillment Stage Updater */}
                      <div className="bg-white p-3.5 sm:p-4 rounded-sm border border-[#222222]/10 space-y-3">
                        <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-[#222222] flex items-center gap-1.5 pb-2 border-b border-[#222222]/10">
                          <Truck className="w-3.5 h-3.5 text-[#7A211B]" />
                          Update Order Stage
                        </h3>

                        {/* Mobile Step Buttons (Grid) */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                          {STATUS_ORDER.map((stage) => {
                            const isCurrent = order.orderStatus === stage;
                            const stageCfg = STATUS_CONFIG[stage];

                            return (
                              <button
                                key={stage}
                                onClick={() => handleStatusChange(order.id, stage)}
                                disabled={updatingId === order.id}
                                className={`px-2.5 py-2 rounded-sm text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 min-h-[40px] text-center ${
                                  isCurrent
                                    ? 'bg-[#7A211B] text-white shadow-xs ring-1 ring-[#7A211B]'
                                    : 'bg-[#F7F3ED] text-[#222222]/70 hover:bg-[#EFE9DF] border border-[#222222]/10 active:bg-[#E5DFD4]'
                                }`}
                              >
                                {isCurrent && <Check className="w-3 h-3 flex-shrink-0" />}
                                <span className="truncate">{stageCfg?.label || stage}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Courier Details Form */}
                        <div className="pt-2 border-t border-[#222222]/10 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[10px] text-[#222222]/60 font-semibold uppercase tracking-wider mb-1">
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
                              className="w-full px-3 py-2 border border-[#222222]/15 rounded-sm text-xs outline-none focus:border-[#7A211B] bg-white min-h-[38px]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-[#222222]/60 font-semibold uppercase tracking-wider mb-1">
                              AWB / Tracking Number
                            </label>
                            <div className="flex gap-1.5">
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
                                className="w-full px-3 py-2 border border-[#222222]/15 rounded-sm text-xs outline-none focus:border-[#7A211B] font-mono bg-white min-h-[38px]"
                              />
                              <button
                                onClick={() => handleStatusChange(order.id, order.orderStatus)}
                                className="px-3 py-2 bg-[#2B231F] hover:bg-[#3E332D] text-[#F7F3ED] text-xs font-semibold rounded-sm whitespace-nowrap transition-colors min-h-[38px]"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Items Ordered List */}
                      <div className="bg-white p-3.5 sm:p-4 rounded-sm border border-[#222222]/10">
                        <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#222222]/60 pb-2 border-b border-[#222222]/10 mb-2.5">
                          Sarees in Order ({order.items.length})
                        </h4>
                        <div className="divide-y divide-[#222222]/5">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="py-2 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="relative w-10 h-12 sm:w-12 sm:h-14 bg-[#EFE9DF] rounded-xs overflow-hidden border border-[#222222]/10 flex-shrink-0">
                                  <ImageWithFallback
                                    src={item.product?.images?.[0]?.url || '/sarees/cat-pattu.jpg'}
                                    alt={item.product?.name || 'Saree'}
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-serif font-bold text-xs text-[#222222] truncate">
                                    {item.product?.name || 'Mangalagiri Saree'}
                                  </p>
                                  <p className="text-[10px] text-[#7A211B] font-semibold mt-0.5 truncate">
                                    {item.product?.fabric || 'Handloom'} &bull; Qty: {item.quantity}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-xs font-bold text-[#222222]">
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

      {/* Footer */}
      <footer className="bg-white border-t border-[#222222]/10 py-5 px-4 text-center text-xs text-[#222222]/50 font-sans mt-auto">
        <p>DL Handlooms &bull; Mangalagiri Weavers Society</p>
        <p className="mt-1 text-[11px]">Owner Passcode: <code className="bg-[#F7F3ED] px-1.5 py-0.5 rounded-xs font-mono font-bold text-[#7A211B]">admin123</code></p>
      </footer>
    </main>
  );
}
