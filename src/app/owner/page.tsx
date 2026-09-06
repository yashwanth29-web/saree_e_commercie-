'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import BrandLogo from '@/components/ui/UshaLogo';
import {
  Package,
  PlusCircle,
  Layers,
  BarChart3,
  Search,
  Upload,
  Camera,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  ShoppingBag,
  Sparkles,
  Lock,
  LogOut,
  Trash2,
  Plus,
  Minus,
  Check,
  Phone,
  MessageSquare,
  Clock,
  Truck,
  ArrowRight,
  ArrowLeft,
  X,
  Store,
  DollarSign
} from 'lucide-react';

// Status styling for orders matching the user app palette
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; dot: string }> = {
  CONFIRMED: { label: 'Confirmed', color: 'text-amber-800', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500' },
  PROCESSING: { label: 'At Looms', color: 'text-[#0B281B]', bg: 'bg-[#EAF5F1]', border: 'border-[#C4E2D3]', dot: 'bg-[#0B281B]' },
  PACKED: { label: 'Packed', color: 'text-sky-800', bg: 'bg-sky-50', border: 'border-sky-200', dot: 'bg-sky-500' },
  SHIPPED: { label: 'Dispatched', color: 'text-indigo-800', bg: 'bg-indigo-50', border: 'border-indigo-200', dot: 'bg-indigo-500' },
  DELIVERED: { label: 'Delivered', color: 'text-emerald-800', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  CANCELLED: { label: 'Cancelled', color: 'text-rose-800', bg: 'bg-rose-50', border: 'border-rose-200', dot: 'bg-rose-500' },
};

// Preset sample photos for fast 1-tap testing
const SAMPLE_PHOTOS = [
  { label: 'Royal Green Kalamkari', url: '/products/kalamkari-peacock-lotus.jpg' },
  { label: 'Sky Blue Pattu', url: '/products/mangalagiri-pattu-sky-blue.jpg' },
  { label: 'Maroon Cotton', url: '/products/mangalagiri-cotton-yellow-bandhani.jpg' },
  { label: 'Maroon Ikkat Dress', url: '/products/mangalagiri-cotton-maroon-ikkat.jpg' },
  { label: 'Peacock Teal Pattu', url: '/products/mangalagiri-pattu-peacock-teal.jpg' },
  { label: 'Wine Maroon Pattu', url: '/products/mangalagiri-pattu-wine-maroon.jpg' },
];

const FABRIC_OPTIONS = [
  'Handloom Silk-Cotton (Pattu)',
  'Pure 100s Mangalagiri Cotton',
  'Pure Silk with Zari',
  'Authentic Kalamkari Cotton',
  '3-Piece Dress Material',
];

const COLOR_OPTIONS = [
  { name: 'Emerald Green', hex: '#165B33' },
  { name: 'Wine Maroon', hex: '#6A1A24' },
  { name: 'Royal Sky Blue', hex: '#2B6CB0' },
  { name: 'Mustard Yellow', hex: '#D69E2E' },
  { name: 'Crimson Red', hex: '#C53030' },
  { name: 'Rani Pink', hex: '#D53F8C' },
  { name: 'Temple Gold', hex: '#B79555' },
  { name: 'Classic Black', hex: '#1A202C' },
];

export default function OwnerPortal() {
  // Authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'orders' | 'add-stock' | 'inventory' | 'overview'>('orders');

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [trackingInputs, setTrackingInputs] = useState<Record<string, { courier: string; awb: string }>>({});
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Products / Inventory State
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCatFilter, setInventoryCatFilter] = useState('ALL');
  const [adjustingStockId, setAdjustingStockId] = useState<string | null>(null);

  // Simple Add Stock Form State
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formSalePrice, setFormSalePrice] = useState('');
  const [formCategorySlug, setFormCategorySlug] = useState('pattu');
  const [formStock, setFormStock] = useState<number | string>(1);
  const [formFabric, setFormFabric] = useState(FABRIC_OPTIONS[0]);
  const [formColor, setFormColor] = useState(COLOR_OPTIONS[0].name);
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  // Check auth session
  useEffect(() => {
    const saved = sessionStorage.getItem('dl_owner_auth');
    if (saved === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch orders
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.success && data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch products & categories
  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      fetchProducts();
    }
  }, [isAuthenticated]);

  // Handle Login
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

  // Handle Logout
  const handleLogout = () => {
    sessionStorage.removeItem('dl_owner_auth');
    setIsAuthenticated(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle Image File Upload (From camera or file picker)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setFormImageUrl(data.url);
        showToast('Photo uploaded successfully!');
      } else {
        showToast('Could not upload photo. Using default image.');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      showToast('Photo upload error. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  // 1-Tap Auto-Description Generator
  const handleAutoDescription = () => {
    const nameStr = formName.trim() || 'Mangalagiri Handloom Saree';
    const desc = `Authentic ${nameStr} hand-woven on traditional pit looms by skilled master weavers in Mangalagiri. Woven with authentic ${formFabric}, featuring classic Nizam zari borders and rich pallu craft. Soft, breathable, and gracefully draped for weddings, poojas, and cultural festivities.`;
    setFormDescription(desc);
    showToast('Description auto-filled!');
  };

  // Submit Simple Stock Upload
  const handlePublishProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formImageUrl) {
      showToast('Please snap or pick a saree photo first');
      return;
    }
    if (!formName.trim()) {
      showToast('Please enter saree name');
      return;
    }
    if (!formPrice || isNaN(Number(formPrice))) {
      showToast('Please enter a valid price');
      return;
    }

    const finalStock = typeof formStock === 'string' ? (parseInt(formStock) || 0) : formStock;
    const defaultFabric =
      formCategorySlug === 'cotton'
        ? 'Pure 100s Mangalagiri Cotton'
        : formCategorySlug === 'kalamkari'
        ? 'Authentic Kalamkari Cotton'
        : formCategorySlug === 'dress-materials'
        ? '3-Piece Dress Material'
        : 'Handloom Silk-Cotton (Pattu)';

    setSavingProduct(true);
    try {
      const payload = {
        name: formName.trim(),
        price: parseFloat(formPrice),
        salePrice: formSalePrice ? parseFloat(formSalePrice) : null,
        categorySlug: formCategorySlug,
        stock: Math.max(0, finalStock),
        fabric: defaultFabric,
        color: 'Traditional Handloom',
        description: `Authentic ${formName.trim()} hand-woven on traditional pit looms by skilled master weavers in Mangalagiri. Featuring authentic zari borders and traditional handloom finish.`,
        imageUrl: formImageUrl,
        newArrival: true,
        bestseller: false,
        featured: false,
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setPublishSuccess(data.product);
        showToast(`🎉 "${formName}" published to store!`);
        fetchProducts(); // Refresh list
        // Reset form to clean state
        setFormName('');
        setFormPrice('');
        setFormSalePrice('');
        setFormImageUrl('');
        setFormStock(1);
      } else {
        showToast(data.error || 'Failed to publish product');
      }
    } catch (err) {
      console.error('Error publishing product:', err);
      showToast('Network error while publishing saree');
    } finally {
      setSavingProduct(false);
    }
  };

  // Quick Stock Adjustment (+ or -)
  const handleStockAdjustment = async (product: any, delta: number) => {
    const newStock = Math.max(0, (product.stock || 0) + delta);
    setAdjustingStockId(product.id);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id, stock: newStock }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev =>
          prev.map(p => (p.id === product.id ? { ...p, stock: newStock } : p))
        );
        showToast(`Stock updated: ${product.name.slice(0, 20)}... → ${newStock}`);
      }
    } catch (err) {
      console.error('Failed to update stock:', err);
    } finally {
      setAdjustingStockId(null);
    }
  };

  // Toggle Active Status
  const handleToggleActive = async (product: any) => {
    const nextActive = !product.active;
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id, active: nextActive }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev =>
          prev.map(p => (p.id === product.id ? { ...p, active: nextActive } : p))
        );
        showToast(`Status: ${nextActive ? 'Active in store' : 'Hidden from store'}`);
      }
    } catch (err) {
      console.error('Failed to toggle active:', err);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from store?`)) return;

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        showToast('Saree removed from store');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Order Status Change
  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
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
          prev.map(o =>
            o.id === orderId
              ? {
                  ...o,
                  orderStatus: newStatus,
                  ...(tracking.courier && { courierName: tracking.courier }),
                  ...(tracking.awb && { trackingNumber: tracking.awb }),
                }
              : o
          )
        );
        showToast(`Order updated to ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
      }
    } catch (err) {
      console.error('Update status failed:', err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // WhatsApp Message Generator
  const generateWhatsAppMessage = (order: any) => {
    const statusText = STATUS_CONFIG[order.orderStatus]?.label || order.orderStatus;
    const msg = `Namaste ${order.customerName}! 🙏\n\nThis is from *DL Handlooms Mangalagiri*.\nYour order *#${order.orderNumber}* is currently: *${statusText}*.\n\nTotal: ₹${order.total?.toLocaleString('en-IN')}\nTrack your package anytime at: https://saree-e-commercie.vercel.app/track-order?orderNumber=${order.orderNumber}\n\nThank you for supporting authentic handloom weavers! 🌿`;
    return encodeURIComponent(msg);
  };

  // Stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => ['CONFIRMED', 'PROCESSING', 'PACKED'].includes(o.orderStatus)).length;
  const deliveredOrdersCount = orders.filter(o => o.orderStatus === 'DELIVERED').length;

  const totalProductsCount = products.length;
  const inStockProductsCount = products.filter(p => p.stock > 0).length;
  const outOfStockProductsCount = products.filter(p => p.stock === 0).length;

  // Filtered Orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.customerPhone?.includes(orderSearch);
    const matchesStatus = orderStatusFilter === 'ALL' || order.orderStatus === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Products
  const filteredProducts = products.filter(prod => {
    const matchesSearch =
      prod.name?.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      prod.sku?.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      prod.color?.toLowerCase().includes(inventorySearch.toLowerCase());
    const matchesCategory =
      inventoryCatFilter === 'ALL' ||
      prod.category?.slug === inventoryCatFilter ||
      prod.categoryId === inventoryCatFilter;
    return matchesSearch && matchesCategory;
  });

  // Calculate discount percentage for live preview
  const previewDiscount =
    formPrice && formSalePrice && Number(formSalePrice) > Number(formPrice)
      ? Math.round(((Number(formSalePrice) - Number(formPrice)) / Number(formSalePrice)) * 100)
      : null;

  // -------------------------------------------------------------
  // PASSCODE LOCK SCREEN (Styled matching User App UI)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#FAFAF8] flex flex-col justify-between text-[#1C2621]">
        {/* Simple Brand Header */}
        <header className="bg-[#0B281B] text-white py-4 px-6 border-b border-white/10 shadow-sm">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <BrandLogo variant="light" size="sm" />
            <Link
              href="/"
              className="text-xs font-sans text-white/80 hover:text-white flex items-center gap-1 transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </Link>
          </div>
        </header>

        {/* Lock Modal */}
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white border border-[#0B281B]/15 rounded-xl p-6 sm:p-8 shadow-xl text-center">
            {/* Lock Icon in Forest Green Circle */}
            <div className="w-16 h-16 bg-[#0B281B] text-[#C4E2D3] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#C4E2D3]/30 shadow-inner">
              <Lock className="w-8 h-8 stroke-[2]" />
            </div>

            <span className="text-[10px] font-sans font-bold tracking-[0.25em] uppercase text-[#B79555] block mb-1">
              Store Owner Portal
            </span>
            <h1 className="text-2xl font-serif font-extrabold text-[#0B281B] mb-2">
              Dhana Lakshmi Handlooms
            </h1>
            <p className="text-xs text-[#1C2621]/70 mb-6 max-w-xs mx-auto">
              Enter your owner PIN to manage orders, upload new sarees, and adjust live loom stock.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Enter PIN (admin123)"
                  value={passcode}
                  onChange={e => {
                    setPasscode(e.target.value);
                    setPasscodeError(false);
                  }}
                  className="w-full bg-[#FAFAF8] border border-[#0B281B]/20 focus:border-[#0B281B] text-[#0B281B] px-4 py-3 rounded-lg text-center text-lg tracking-widest font-mono outline-none transition-all placeholder:text-[#1C2621]/30 placeholder:tracking-normal placeholder:font-sans placeholder:text-sm"
                  autoFocus
                />
                {passcodeError && (
                  <p className="text-xs text-rose-600 mt-2 flex items-center justify-center gap-1 font-sans">
                    <AlertCircle className="w-3.5 h-3.5" /> Incorrect PIN. Try: <strong>admin123</strong>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#0B281B] hover:bg-[#163C2A] text-white py-3.5 rounded-lg font-semibold text-xs tracking-wider uppercase transition-all shadow-md active:scale-[0.99] border border-white/10 min-h-[44px]"
              >
                Unlock Owner Portal
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-[#0B281B]/10 flex items-center justify-between text-[11px] text-[#1C2621]/60">
              <span>Mangalagiri Looms</span>
              <span className="font-mono bg-[#EAF5F1] text-[#0B281B] px-2 py-0.5 rounded-full font-bold">
                PIN: admin123
              </span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <footer className="py-4 text-center text-xs text-[#1C2621]/50 border-t border-[#0B281B]/10 bg-white">
          Dhana Lakshmi Handlooms &bull; Owner Portal
        </footer>
      </main>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED OWNER DASHBOARD
  // -------------------------------------------------------------
  return (
    <main className="min-h-screen bg-[#FAFAF8] flex flex-col text-[#1C2621] pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 bg-[#0B281B] text-white border border-[#C4E2D3]/40 px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom duration-200">
          <CheckCircle className="w-4 h-4 text-[#C4E2D3] flex-shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Header - Forest Green (Exact matching User App Navbar) */}
      <header className="sticky top-0 z-40 bg-[#0B281B] text-white border-b border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          
          {/* Brand Logo & Owner Badge */}
          <div className="flex items-center gap-3">
            <BrandLogo variant="light" size="sm" href="/owner" />
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold tracking-wider uppercase bg-[#C4E2D3]/20 text-[#C4E2D3] border border-[#C4E2D3]/30">
              Store Owner Hub
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Quick Link to Customer Store */}
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-colors border border-white/10"
              title="View Public Store"
            >
              <Store className="w-3.5 h-3.5" />
              <span className="hidden md:inline">View Store</span>
            </Link>

            {/* Refresh Data */}
            <button
              onClick={() => {
                fetchOrders();
                fetchProducts();
                showToast('Data refreshed');
              }}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
              title="Refresh Records"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${ordersLoading || productsLoading ? 'animate-spin' : ''}`} />
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 transition-colors"
              title="Lock & Exit"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Segmented Tab Navigation Bar - Styled to match App Nav */}
        <div className="bg-[#061910] border-t border-white/10 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2">
            
            {/* Tab: Orders */}
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-sans font-semibold flex items-center gap-2 transition-all whitespace-nowrap min-h-[38px] ${
                activeTab === 'orders'
                  ? 'bg-[#C4E2D3] text-[#0B281B] shadow-sm font-bold'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Orders</span>
              {pendingOrdersCount > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === 'orders'
                      ? 'bg-[#0B281B] text-white'
                      : 'bg-[#B79555] text-white'
                  }`}
                >
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            {/* Tab: Add Stock (Ultra Simple Upload) */}
            <button
              onClick={() => {
                setActiveTab('add-stock');
                setPublishSuccess(null);
              }}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-sans font-semibold flex items-center gap-2 transition-all whitespace-nowrap min-h-[38px] ${
                activeTab === 'add-stock'
                  ? 'bg-[#B79555] text-white shadow-sm font-bold'
                  : 'bg-[#B79555]/20 text-[#E2C37B] hover:bg-[#B79555]/30'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add Stock</span>
              <Sparkles className="w-3 h-3 text-[#E2C37B]" />
            </button>

            {/* Tab: Stock & Inventory */}
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-sans font-semibold flex items-center gap-2 transition-all whitespace-nowrap min-h-[38px] ${
                activeTab === 'inventory'
                  ? 'bg-[#C4E2D3] text-[#0B281B] shadow-sm font-bold'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Stock Manager</span>
              <span className="text-[10px] opacity-70">({totalProductsCount})</span>
            </button>

            {/* Tab: Overview */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-sans font-semibold flex items-center gap-2 transition-all whitespace-nowrap min-h-[38px] ${
                activeTab === 'overview'
                  ? 'bg-[#C4E2D3] text-[#0B281B] shadow-sm font-bold'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </button>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-5 sm:py-6 flex-grow">

        {/* ========================================================================= */}
        {/* TAB 1: ADD STOCK (SUPER SIMPLE UPLOAD PROCESS)                            */}
        {/* ========================================================================= */}
        {activeTab === 'add-stock' && (
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#0B281B] to-[#163C2A] text-white rounded-xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#C4E2D3] block mb-1">
                  Simple Handloom Listing
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-white">
                  Add New Saree to Stock
                </h2>
                <p className="text-xs text-white/80 mt-1 max-w-md">
                  Upload a photo, enter price and saree name, and publish in seconds. It will appear live on the store immediately!
                </p>
              </div>

              <button
                onClick={() => setActiveTab('inventory')}
                className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-[#C4E2D3] border border-[#C4E2D3]/30 flex items-center gap-1.5 transition-colors"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>View All Stock</span>
              </button>
            </div>

            {/* Success Celebration Alert */}
            {publishSuccess && (
              <div className="bg-[#D8EEDF] border border-[#B3DDC0] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#13683A] text-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-[#0B281B]">
                      Saree Successfully Added to Store!
                    </h3>
                    <p className="text-xs text-[#13683A]">
                      &quot;{publishSuccess.name}&quot; is now live for customers to view and purchase.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/product/${publishSuccess.slug || publishSuccess.id}`}
                    target="_blank"
                    className="px-3 py-2 rounded-lg bg-[#0B281B] text-white text-xs font-semibold hover:bg-[#163C2A] transition-colors flex items-center gap-1"
                  >
                    <span>View in Store</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                  <button
                    onClick={() => setPublishSuccess(null)}
                    className="px-3 py-2 rounded-lg bg-white border border-[#0B281B]/20 text-xs font-semibold text-[#0B281B] hover:bg-[#F3F4F3]"
                  >
                    Add Another Saree
                  </button>
                </div>
              </div>
            )}

            {/* Grid: Form on Left / Live Card Preview on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Form Card (7 cols) */}
              <form onSubmit={handlePublishProduct} className="lg:col-span-7 bg-white border border-[#0B281B]/15 rounded-xl p-5 sm:p-6 shadow-sm space-y-5">
                
                {/* 1. PHOTO UPLOAD SECTION */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-sans font-bold uppercase tracking-wider text-[#0B281B]">
                      1. Saree Photo *
                    </label>
                    {uploadingImage && (
                      <span className="text-xs text-[#0B281B] font-semibold flex items-center gap-1 animate-pulse">
                        <RefreshCw className="w-3 h-3 animate-spin" /> Uploading photo...
                      </span>
                    )}
                  </div>

                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  {formImageUrl ? (
                    /* Photo Attached State */
                    <div className="flex items-center gap-4 p-3.5 border border-[#0B281B]/20 rounded-xl bg-[#FAFAF8]">
                      <div className="relative w-20 h-24 rounded-lg overflow-hidden border border-[#0B281B]/15 bg-white flex-shrink-0 shadow-xs">
                        <ImageWithFallback
                          src={formImageUrl}
                          alt="Saree Preview"
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="space-y-2 flex-grow">
                        <p className="text-xs font-bold text-[#0B281B] flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>Photo ready for store listing</span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImage}
                            className="px-3 py-1.5 rounded-lg bg-[#0B281B] text-white text-xs font-semibold hover:bg-[#163C2A] flex items-center gap-1.5 transition-colors"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>Change Photo</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormImageUrl('')}
                            className="px-3 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-50 flex items-center gap-1.5 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Clean Empty Dropzone */
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#0B281B]/25 hover:border-[#0B281B] bg-[#FAFAF8] hover:bg-[#EAF5F1]/40 rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#EAF5F1] text-[#0B281B] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Camera className="w-6 h-6 text-[#0B281B]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#0B281B]">
                          Snap or Pick Saree Photo *
                        </p>
                        <p className="text-[11px] text-[#1C2621]/60 mt-0.5">
                          Supports camera photos, JPG, PNG from mobile or computer
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mt-1" onClick={e => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImage}
                          className="px-3.5 py-1.5 rounded-lg bg-[#0B281B] text-white text-xs font-semibold hover:bg-[#163C2A] flex items-center gap-1.5 transition-colors"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Snap / Pick Photo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const url = prompt('Enter image URL:');
                            if (url?.trim()) setFormImageUrl(url.trim());
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white border border-[#0B281B]/20 text-xs font-medium text-[#1C2621] hover:bg-[#EAF5F1] transition-colors"
                        >
                          Paste URL
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 1-Tap Quick Sample Presets (Optional testing) */}
                  <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] uppercase font-bold text-[#1C2621]/45">Quick sample:</span>
                    {SAMPLE_PHOTOS.map(sample => (
                      <button
                        key={sample.url}
                        type="button"
                        onClick={() => setFormImageUrl(sample.url)}
                        className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${
                          formImageUrl === sample.url
                            ? 'bg-[#0B281B] text-white border-[#0B281B] font-bold shadow-xs'
                            : 'bg-white text-[#1C2621]/70 border-[#0B281B]/15 hover:bg-[#EAF5F1]'
                        }`}
                      >
                        {sample.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="gold-divider my-2" />

                {/* 2. SAREE TITLE / NAME */}
                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#0B281B] mb-1.5">
                    2. Saree Title / Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Emerald & Wine Nizam Pattu Saree"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#0B281B]/20 bg-[#FAFAF8] text-sm font-sans focus:border-[#0B281B] focus:bg-white outline-none transition-all"
                    required
                  />
                </div>

                {/* 3. PRICE & MRP */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#0B281B] mb-1.5">
                      3. Offer Price (₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#0B281B]">₹</span>
                      <input
                        type="number"
                        placeholder="2850"
                        value={formPrice}
                        onChange={e => setFormPrice(e.target.value)}
                        className="w-full pl-7 pr-3 py-2.5 rounded-lg border border-[#0B281B]/20 bg-[#FAFAF8] text-sm font-sans font-bold focus:border-[#0B281B] focus:bg-white outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#1C2621]/60 mb-1.5">
                      Original MRP (₹) (Optional)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[#1C2621]/50">₹</span>
                      <input
                        type="number"
                        placeholder="3800"
                        value={formSalePrice}
                        onChange={e => setFormSalePrice(e.target.value)}
                        className="w-full pl-7 pr-3 py-2.5 rounded-lg border border-[#0B281B]/15 bg-[#FAFAF8] text-sm font-sans focus:border-[#0B281B] focus:bg-white outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. CATEGORY (1-Tap Selection) */}
                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#0B281B] mb-1.5">
                    4. Category (Tap to select)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { slug: 'pattu', label: 'Mangalagiri Pattu' },
                      { slug: 'cotton', label: 'Cotton Sarees' },
                      { slug: 'kalamkari', label: 'Kalamkari' },
                      { slug: 'dress-materials', label: 'Dress Materials' },
                    ].map(cat => {
                      const isSelected = formCategorySlug === cat.slug;
                      return (
                        <button
                          key={cat.slug}
                          type="button"
                          onClick={() => setFormCategorySlug(cat.slug)}
                          className={`px-3 py-2.5 rounded-lg text-xs font-semibold transition-all border text-center ${
                            isSelected
                              ? 'bg-[#0B281B] text-white border-[#0B281B] shadow-xs'
                              : 'bg-[#FAFAF8] text-[#1C2621]/80 border-[#0B281B]/15 hover:bg-[#EAF5F1]'
                          }`}
                        >
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. DIRECT STOCK QUANTITY */}
                <div className="bg-[#EAF5F1] p-3.5 rounded-xl border border-[#C4E2D3]">
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#0B281B] mb-1">
                    5. Direct Stock Quantity (Pieces Ready at Looms) *
                  </label>
                  <p className="text-[11px] text-[#0B281B]/70 mb-2.5">
                    Type exact number of available sarees directly or tap a quick number:
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    <div className="relative flex-grow">
                      <input
                        type="number"
                        min="0"
                        placeholder="Enter stock count (e.g. 5)"
                        value={formStock}
                        onChange={e => {
                          const val = e.target.value;
                          setFormStock(val === '' ? '' : Math.max(0, parseInt(val) || 0));
                        }}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#0B281B]/25 bg-white text-base font-sans font-bold text-[#0B281B] focus:border-[#0B281B] outline-none shadow-xs"
                        required
                      />
                    </div>

                    {/* Quick 1-Tap Numbers */}
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 5, 10, 20].map(qty => (
                        <button
                          key={qty}
                          type="button"
                          onClick={() => setFormStock(qty)}
                          className={`flex-1 sm:flex-none px-3 py-2 rounded-lg border text-xs font-bold transition-all ${
                            Number(formStock) === qty
                              ? 'bg-[#0B281B] text-white border-[#0B281B] shadow-xs'
                              : 'bg-white text-[#0B281B] border-[#0B281B]/20 hover:bg-[#FAFAF8]'
                          }`}
                        >
                          {qty}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="w-full py-4 rounded-xl bg-[#0B281B] hover:bg-[#163C2A] text-white font-sans font-bold text-sm tracking-wider uppercase transition-all shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 min-h-[48px] border border-white/20 mt-2"
                >
                  {savingProduct ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#C4E2D3]" />
                      <span>Publishing Saree to Store...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#C4E2D3]" />
                      <span>Publish Saree to Store Now</span>
                      <ArrowRight className="w-4 h-4 text-[#C4E2D3]" />
                    </>
                  )}
                </button>
              </form>

              {/* LIVE CUSTOMER CARD PREVIEW (5 cols) */}
              <div className="lg:col-span-5 space-y-4 sticky top-24">
                <div className="bg-white border border-[#0B281B]/15 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#0B281B]/10">
                    <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#0B281B] flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#B79555]" />
                      <span>Live Customer Store Preview</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                      Real-Time
                    </span>
                  </div>

                  {/* Saree Card (Exact styling from UshaNewArrivals / ShopCatalog) */}
                  <div className="bg-[#FAFAF8] rounded-xl overflow-hidden border border-[#0B281B]/10 shadow-sm flex flex-col">
                    {/* Image Area */}
                    <div className="relative aspect-[3/4] w-full bg-[#F5F5F3] overflow-hidden">
                      {formImageUrl ? (
                        <ImageWithFallback
                          src={formImageUrl}
                          alt={formName || 'Saree Preview'}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#0B281B]/40">
                          <div className="w-12 h-12 rounded-full bg-[#0B281B]/5 flex items-center justify-center mb-2">
                            <Camera className="w-6 h-6 text-[#0B281B]/40" />
                          </div>
                          <p className="text-xs font-semibold text-[#0B281B]/70">Photo Preview</p>
                          <p className="text-[10px] text-[#1C2621]/40 mt-0.5">Snap or upload photo on the left</p>
                        </div>
                      )}

                      {/* New Arrival Badge */}
                      <div className="absolute top-2.5 left-2.5">
                        <span className="bg-[#0B281B] text-[#C4E2D3] text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-xs shadow-xs">
                          New Arrival
                        </span>
                      </div>

                      {/* Discount Badge */}
                      {previewDiscount && previewDiscount > 0 && (
                        <span className="absolute top-2.5 right-2.5 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-xs shadow-xs">
                          {previewDiscount}% OFF
                        </span>
                      )}

                      {/* Stock Pill */}
                      <div className="absolute bottom-2 left-2">
                        {Number(formStock) > 0 ? (
                          <span className="bg-white/90 backdrop-blur-xs text-[#0B281B] text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
                            Ready on Looms ({formStock})
                          </span>
                        ) : (
                          <span className="bg-rose-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
                            Sold Out
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-3.5 space-y-1.5">
                      <p className="text-[10px] font-mono uppercase text-[#B79555] tracking-wider font-bold">
                        DL HANDLOOMS &bull; {formCategorySlug.toUpperCase()}
                      </p>

                      <h3 className="font-serif font-bold text-sm text-[#0B281B] line-clamp-2 leading-snug">
                        {formName || 'Saree Title Will Appear Here'}
                      </h3>

                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="font-serif font-extrabold text-base text-[#0B281B]">
                          ₹{formPrice ? Number(formPrice).toLocaleString('en-IN') : '—'}
                        </span>
                        {formSalePrice && (
                          <span className="text-xs text-[#1C2621]/40 line-through">
                            ₹{Number(formSalePrice).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <div className="pt-2">
                        <div className="w-full py-2 bg-[#0B281B] text-white text-center rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5">
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#1C2621]/60 text-center mt-3">
                    👆 Exactly how customers will see your saree on their mobile screens.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: INVENTORY & STOCK MANAGER                                          */}
        {/* ========================================================================= */}
        {activeTab === 'inventory' && (
          <div className="space-y-5">
            
            {/* Top Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-[#0B281B]/15 shadow-xs">
                <p className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#1C2621]/60">Total Sarees</p>
                <p className="text-2xl font-serif font-bold text-[#0B281B] mt-0.5">{totalProductsCount}</p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#0B281B]/15 shadow-xs">
                <p className="text-[11px] font-sans font-bold uppercase tracking-wider text-emerald-700">In Stock</p>
                <p className="text-2xl font-serif font-bold text-emerald-800 mt-0.5">{inStockProductsCount}</p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#0B281B]/15 shadow-xs">
                <p className="text-[11px] font-sans font-bold uppercase tracking-wider text-rose-700">Out of Stock</p>
                <p className="text-2xl font-serif font-bold text-rose-800 mt-0.5">{outOfStockProductsCount}</p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#0B281B]/15 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#B79555]">Fast Action</p>
                  <button
                    onClick={() => setActiveTab('add-stock')}
                    className="mt-1 text-xs font-bold text-[#0B281B] hover:underline flex items-center gap-1"
                  >
                    + Add New Saree
                  </button>
                </div>
                <Sparkles className="w-6 h-6 text-[#B79555]" />
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white border border-[#0B281B]/15 rounded-xl p-3 sm:p-4 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                
                {/* Search Input */}
                <div className="relative w-full sm:max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#1C2621]/40" />
                  <input
                    type="text"
                    placeholder="Search by saree name, SKU, or color..."
                    value={inventorySearch}
                    onChange={e => setInventorySearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#FAFAF8] border border-[#0B281B]/15 rounded-lg text-xs sm:text-sm focus:border-[#0B281B] outline-none transition-colors"
                  />
                </div>

                <button
                  onClick={() => setActiveTab('add-stock')}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#0B281B] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#163C2A] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <PlusCircle className="w-4 h-4 text-[#C4E2D3]" />
                  <span>Upload Saree</span>
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
                {['ALL', 'pattu', 'cotton', 'kalamkari', 'dress-materials'].map(catSlug => {
                  const isSelected = inventoryCatFilter === catSlug;
                  const labelMap: Record<string, string> = {
                    ALL: 'All Sarees',
                    pattu: 'Mangalagiri Pattu',
                    cotton: 'Cotton Sarees',
                    kalamkari: 'Kalamkari',
                    'dress-materials': 'Dress Materials',
                  };
                  return (
                    <button
                      key={catSlug}
                      onClick={() => setInventoryCatFilter(catSlug)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                        isSelected
                          ? 'bg-[#0B281B] text-white shadow-xs'
                          : 'bg-[#FAFAF8] text-[#1C2621]/70 hover:bg-[#EAF5F1] border border-[#0B281B]/10'
                      }`}
                    >
                      {labelMap[catSlug] || catSlug}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inventory List / Grid */}
            {productsLoading ? (
              <div className="bg-white border border-[#0B281B]/15 rounded-xl p-12 text-center shadow-xs">
                <RefreshCw className="w-7 h-7 animate-spin text-[#0B281B] mx-auto mb-3" />
                <p className="font-serif text-base font-bold text-[#0B281B]">Loading Saree Inventory...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white border border-[#0B281B]/15 rounded-xl p-12 text-center shadow-xs space-y-3">
                <Layers className="w-10 h-10 text-[#0B281B]/30 mx-auto" />
                <p className="font-serif text-lg font-bold text-[#0B281B]">No Sarees Found</p>
                <p className="text-xs text-[#1C2621]/60">Try changing your search or add your first saree!</p>
                <button
                  onClick={() => setActiveTab('add-stock')}
                  className="px-4 py-2 rounded-lg bg-[#0B281B] text-white text-xs font-bold"
                >
                  + Add Saree Now
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProducts.map(prod => {
                  const imgUrl = prod.images?.[0]?.url || '/sarees/cat-pattu.jpg';
                  const isLow = prod.stock > 0 && prod.stock <= 2;
                  const isOut = prod.stock === 0;

                  return (
                    <div
                      key={prod.id}
                      className="bg-white border border-[#0B281B]/15 rounded-xl p-3.5 sm:p-4 shadow-xs hover:border-[#0B281B]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      {/* Product Info with Thumbnail */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden border border-[#0B281B]/10 bg-[#FAFAF8] flex-shrink-0">
                          <ImageWithFallback
                            src={imgUrl}
                            alt={prod.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-grow">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono uppercase bg-[#EAF5F1] text-[#0B281B] px-2 py-0.5 rounded-full font-bold">
                              {prod.sku || 'DL-PAT'}
                            </span>
                            <span className="text-[10px] font-sans text-[#B79555] font-bold uppercase">
                              {prod.category?.name || 'Mangalagiri Handloom'}
                            </span>
                          </div>

                          <h4 className="font-serif font-bold text-sm sm:text-base text-[#0B281B] truncate mt-1">
                            {prod.name}
                          </h4>

                          <div className="flex items-center gap-3 text-xs mt-1">
                            <span className="font-bold text-[#0B281B]">
                              ₹{prod.price?.toLocaleString('en-IN')}
                            </span>
                            {prod.color && (
                              <span className="text-[#1C2621]/60 text-[11px]">
                                Color: {prod.color}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stock Adjustment Controls (+ / -) */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#0B281B]/10">
                        {/* Quick 1-Tap Stock Counter */}
                        <div className="flex items-center gap-2 bg-[#FAFAF8] p-1.5 rounded-lg border border-[#0B281B]/15">
                          <span className="text-[11px] font-bold text-[#1C2621]/70 px-1 hidden sm:inline">
                            Stock:
                          </span>
                          <button
                            onClick={() => handleStockAdjustment(prod, -1)}
                            disabled={adjustingStockId === prod.id}
                            className="w-7 h-7 rounded-md bg-white border border-[#0B281B]/20 text-[#0B281B] hover:bg-[#EAF5F1] flex items-center justify-center font-bold text-xs"
                            title="Decrease stock by 1"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <span
                            className={`px-2 text-sm font-serif font-bold min-w-[32px] text-center ${
                              isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-[#0B281B]'
                            }`}
                          >
                            {prod.stock}
                          </span>

                          <button
                            onClick={() => handleStockAdjustment(prod, 1)}
                            disabled={adjustingStockId === prod.id}
                            className="w-7 h-7 rounded-md bg-white border border-[#0B281B]/20 text-[#0B281B] hover:bg-[#EAF5F1] flex items-center justify-center font-bold text-xs"
                            title="Increase stock by 1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Status Toggle (Active / Inactive) */}
                        <button
                          onClick={() => handleToggleActive(prod)}
                          className={`text-[11px] px-2.5 py-1.5 rounded-lg font-bold transition-colors border ${
                            prod.active
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                          }`}
                        >
                          {prod.active ? 'Active' : 'Hidden'}
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Remove Saree"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ORDERS & DISPATCHES (FULFILLMENT FLOW)                              */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-5">
            
            {/* Order KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white border border-[#0B281B]/15 rounded-xl p-4 shadow-xs">
                <p className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#1C2621]/60">Total Orders</p>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-[#0B281B] mt-1">{totalOrdersCount}</p>
                <span className="text-[10px] text-emerald-700 font-sans flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" /> Live Loom Sales
                </span>
              </div>

              <div className="bg-white border border-[#0B281B]/15 rounded-xl p-4 shadow-xs">
                <p className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#1C2621]/60">Revenue</p>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-[#B79555] mt-1">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </p>
                <span className="text-[10px] text-[#1C2621]/50 font-sans mt-1 block">Direct to Master Weavers</span>
              </div>

              <div className="bg-white border border-[#0B281B]/15 rounded-xl p-4 shadow-xs">
                <p className="text-[11px] font-sans font-bold uppercase tracking-wider text-amber-800">Pending</p>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-amber-800 mt-1">{pendingOrdersCount}</p>
                <span className="text-[10px] text-amber-700 font-sans mt-1 block">At Looms / Packing</span>
              </div>

              <div className="bg-white border border-[#0B281B]/15 rounded-xl p-4 shadow-xs">
                <p className="text-[11px] font-sans font-bold uppercase tracking-wider text-emerald-800">Delivered</p>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-emerald-800 mt-1">{deliveredOrdersCount}</p>
                <span className="text-[10px] text-emerald-700 font-sans mt-1 block">Completed Shipments</span>
              </div>
            </div>

            {/* Filter & Search */}
            <div className="bg-white border border-[#0B281B]/15 rounded-xl p-3 sm:p-4 shadow-xs space-y-3">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#1C2621]/40" />
                <input
                  type="text"
                  placeholder="Search order #, customer name, or phone..."
                  value={orderSearch}
                  onChange={e => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAFAF8] border border-[#0B281B]/15 rounded-lg text-xs sm:text-sm focus:border-[#0B281B] outline-none transition-colors"
                />
              </div>

              {/* Status Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
                {['ALL', 'CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED'].map(st => {
                  const cfg = STATUS_CONFIG[st];
                  const isSelected = orderStatusFilter === st;
                  return (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#0B281B] text-white shadow-xs'
                          : 'bg-[#FAFAF8] text-[#1C2621]/70 hover:bg-[#EAF5F1] border border-[#0B281B]/10'
                      }`}
                    >
                      {cfg?.dot && (
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : cfg.dot}`} />
                      )}
                      <span>{st === 'ALL' ? 'All Orders' : cfg?.label || st}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Orders List */}
            {ordersLoading ? (
              <div className="bg-white border border-[#0B281B]/15 rounded-xl p-12 text-center shadow-xs">
                <RefreshCw className="w-7 h-7 animate-spin text-[#0B281B] mx-auto mb-3" />
                <p className="font-serif text-base font-bold text-[#0B281B]">Fetching Customer Orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white border border-[#0B281B]/15 rounded-xl p-12 text-center shadow-xs">
                <Package className="w-10 h-10 text-[#0B281B]/30 mx-auto mb-3" />
                <p className="font-serif text-base font-bold text-[#0B281B]">No Orders Found</p>
                <p className="text-xs text-[#1C2621]/60 mt-1">Try clearing your search or status filter.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map(order => {
                  const statusCfg = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.CONFIRMED;
                  const isExpanded = !!expandedOrders[order.id];
                  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <div
                      key={order.id}
                      className="bg-white border border-[#0B281B]/15 rounded-xl overflow-hidden shadow-xs hover:border-[#0B281B]/40 transition-all"
                    >
                      {/* Summary Row */}
                      <div
                        onClick={() => setExpandedOrders(prev => ({ ...prev, [order.id]: !prev[order.id] }))}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-[#FAFAF8] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#EAF5F1] text-[#0B281B] flex items-center justify-center font-serif font-bold text-xs flex-shrink-0 border border-[#C4E2D3]">
                            #
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-serif font-bold text-sm sm:text-base text-[#0B281B]">
                                {order.orderNumber}
                              </span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border}`}>
                                {statusCfg.label}
                              </span>
                            </div>
                            <p className="text-xs text-[#1C2621]/70 mt-0.5">
                              {order.customerName} &bull; {orderDate}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#0B281B]/10">
                          <div className="text-left sm:text-right">
                            <p className="font-serif font-extrabold text-sm sm:text-base text-[#0B281B]">
                              ₹{order.total?.toLocaleString('en-IN')}
                            </p>
                            <p className="text-[10px] text-[#1C2621]/60">
                              {order.items?.length || 1} saree(s)
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* 1-Tap WhatsApp Notify */}
                            <a
                              href={`https://wa.me/${order.customerPhone?.replace(/\D/g, '')}?text=${generateWhatsAppMessage(order)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1 shadow-xs"
                              title="Send WhatsApp update to customer"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">WhatsApp</span>
                            </a>

                            <button className="p-1 text-[#1C2621]/50">
                              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Order Details */}
                      {isExpanded && (
                        <div className="p-4 sm:p-5 bg-[#FAFAF8] border-t border-[#0B281B]/10 space-y-4">
                          {/* Customer & Shipping */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-3.5 rounded-lg border border-[#0B281B]/10 space-y-1 text-xs">
                              <p className="font-bold text-[#0B281B] uppercase tracking-wider text-[10px]">Customer Details</p>
                              <p className="font-medium text-[#1C2621]">{order.customerName}</p>
                              <p className="text-[#1C2621]/70">{order.customerPhone}</p>
                              <p className="text-[#1C2621]/70">{order.customerEmail}</p>
                            </div>

                            <div className="bg-white p-3.5 rounded-lg border border-[#0B281B]/10 space-y-1 text-xs">
                              <p className="font-bold text-[#0B281B] uppercase tracking-wider text-[10px]">Delivery Address</p>
                              <p className="text-[#1C2621] leading-relaxed">{order.shippingAddress}</p>
                            </div>
                          </div>

                          {/* Items Ordered */}
                          <div>
                            <p className="font-bold text-[#0B281B] uppercase tracking-wider text-[10px] mb-2">Ordered Sarees</p>
                            <div className="space-y-2">
                              {order.items?.map((item: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="bg-white p-3 rounded-lg border border-[#0B281B]/10 flex items-center justify-between gap-3 text-xs"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="relative w-12 h-14 rounded-md overflow-hidden bg-[#FAFAF8] border border-[#0B281B]/10 flex-shrink-0">
                                      <ImageWithFallback
                                        src={item.product?.images?.[0]?.url || '/sarees/cat-pattu.jpg'}
                                        alt={item.product?.name || 'Saree'}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div>
                                      <p className="font-serif font-bold text-[#0B281B]">{item.product?.name || 'Handloom Saree'}</p>
                                      <p className="text-[#1C2621]/60 text-[11px]">Qty: {item.quantity} &bull; SKU: {item.product?.sku || 'DL'}</p>
                                    </div>
                                  </div>
                                  <span className="font-serif font-bold text-sm text-[#0B281B]">
                                    ₹{item.price?.toLocaleString('en-IN')}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Status Updater & Courier Tracking */}
                          <div className="bg-white p-4 rounded-lg border border-[#0B281B]/10 space-y-3">
                            <p className="font-bold text-[#0B281B] uppercase tracking-wider text-[10px]">
                              Update Status &amp; Dispatch Details
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                              <div>
                                <label className="block text-[10px] uppercase font-bold text-[#1C2621]/60 mb-1">Status</label>
                                <select
                                  value={order.orderStatus}
                                  onChange={e => handleOrderStatusChange(order.id, e.target.value)}
                                  disabled={updatingOrderId === order.id}
                                  className="w-full px-3 py-2 rounded-lg border border-[#0B281B]/20 bg-[#FAFAF8] text-xs font-semibold text-[#0B281B] outline-none"
                                >
                                  <option value="CONFIRMED">Confirmed</option>
                                  <option value="PROCESSING">At Looms (Weaving)</option>
                                  <option value="PACKED">Packed</option>
                                  <option value="SHIPPED">Dispatched (Shipped)</option>
                                  <option value="DELIVERED">Delivered</option>
                                  <option value="CANCELLED">Cancelled</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-[10px] uppercase font-bold text-[#1C2621]/60 mb-1">Courier Partner</label>
                                <input
                                  type="text"
                                  placeholder="e.g. DTDC / Delhivery / Bluedart"
                                  defaultValue={order.courierName || ''}
                                  onChange={e =>
                                    setTrackingInputs(prev => ({
                                      ...prev,
                                      [order.id]: { ...prev[order.id], courier: e.target.value },
                                    }))
                                  }
                                  className="w-full px-3 py-2 rounded-lg border border-[#0B281B]/20 bg-[#FAFAF8] text-xs outline-none"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] uppercase font-bold text-[#1C2621]/60 mb-1">AWB / Tracking #</label>
                                <input
                                  type="text"
                                  placeholder="e.g. D12345678"
                                  defaultValue={order.trackingNumber || ''}
                                  onChange={e =>
                                    setTrackingInputs(prev => ({
                                      ...prev,
                                      [order.id]: { ...prev[order.id], awb: e.target.value },
                                    }))
                                  }
                                  className="w-full px-3 py-2 rounded-lg border border-[#0B281B]/20 bg-[#FAFAF8] text-xs outline-none"
                                />
                              </div>
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
        )}

        {/* ========================================================================= */}
        {/* TAB 4: STORE OVERVIEW & ANALYTICS                                         */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#0B281B]/15 rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#0B281B]">Loom Performance Summary</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#EAF5F1] border border-[#C4E2D3] space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#0B281B]">Total Store Revenue</p>
                  <p className="text-2xl sm:text-3xl font-serif font-extrabold text-[#0B281B]">
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-[#0B281B]/70">From {totalOrdersCount} customer orders</p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#0B281B]/15 space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#B79555]">Active Catalog</p>
                  <p className="text-2xl sm:text-3xl font-serif font-extrabold text-[#1C2621]">
                    {totalProductsCount} Sarees
                  </p>
                  <p className="text-[11px] text-[#1C2621]/60">Across 4 authentic categories</p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Pending Dispatches</p>
                  <p className="text-2xl sm:text-3xl font-serif font-extrabold text-amber-900">
                    {pendingOrdersCount}
                  </p>
                  <p className="text-[11px] text-amber-700">Orders waiting for courier pickup</p>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white border border-[#0B281B]/15 rounded-xl p-5 shadow-sm">
              <h4 className="font-serif font-bold text-base text-[#0B281B] mb-3">Quick Loom Shortcuts</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setActiveTab('add-stock')}
                  className="p-4 rounded-xl bg-[#0B281B] text-white flex items-center justify-between hover:bg-[#163C2A] transition-colors"
                >
                  <div className="text-left">
                    <p className="font-bold text-sm">+ Add New Saree to Stock</p>
                    <p className="text-xs text-white/70">Upload photo and price</p>
                  </div>
                  <Sparkles className="w-5 h-5 text-[#C4E2D3]" />
                </button>

                <button
                  onClick={() => setActiveTab('inventory')}
                  className="p-4 rounded-xl bg-[#EAF5F1] text-[#0B281B] border border-[#C4E2D3] flex items-center justify-between hover:bg-[#D5EDE3] transition-colors"
                >
                  <div className="text-left">
                    <p className="font-bold text-sm">Manage Stock Levels</p>
                    <p className="text-xs text-[#0B281B]/70">1-Tap + / - stock adjustments</p>
                  </div>
                  <Layers className="w-5 h-5 text-[#0B281B]" />
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
