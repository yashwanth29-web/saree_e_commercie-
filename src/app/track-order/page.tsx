'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import Link from 'next/link';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  MessageCircle,
  Sparkles,
  MapPin,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const TIMELINE_STEPS = [
  { id: 'CONFIRMED', label: 'Order Confirmed', desc: 'Received & sent to Mangalagiri looms' },
  { id: 'PROCESSING', label: 'Handcrafted at Looms', desc: 'Pure zari weaving & artisan processing' },
  { id: 'PACKED', label: 'Quality Checked & Packed', desc: 'Authenticity verified & sealed in protective box' },
  { id: 'SHIPPED', label: 'Dispatched & In Transit', desc: 'Handed over to courier with tracking ID' },
  { id: 'DELIVERED', label: 'Delivered', desc: 'Arrived safely at your doorstep' }
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get('orderNumber') || '';

  const [orderQuery, setOrderQuery] = useState(initialOrderNumber);
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTrack = async (queryToUse?: string) => {
    const query = (queryToUse || orderQuery).trim();
    if (!query) {
      setErrorMessage('Please enter your Order Number (e.g. DL-942811)');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data.success && data.order) {
        setOrderData(data.order);
      } else {
        setErrorMessage(data.error || 'No matching order found. Please check your order number.');
        setOrderData(null);
      }
    } catch (err) {
      setErrorMessage('Network error while checking order status. Please try again.');
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      handleTrack(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const getStepIndex = (status: string) => {
    const idx = TIMELINE_STEPS.findIndex(s => s.id === status);
    return idx === -1 ? 0 : idx;
  };

  const currentStepIdx = orderData ? getStepIndex(orderData.orderStatus) : 0;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-xs font-sans tracking-[0.25em] uppercase text-[#7A211B] font-semibold block mb-2">
          DL Handlooms &bull; Order Tracking
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#222222] font-bold tracking-tight">
          Track Your Handloom Saree
        </h1>
        <div className="w-16 h-[2px] bg-[#C5A880] mx-auto my-3"></div>
        <p className="font-sans text-sm text-[#222222]/70 max-w-md mx-auto">
          Enter your Order Number (e.g. <span className="font-mono font-semibold text-[#7A211B]">DL-942811</span>) to see live weaving, dispatch, and delivery updates.
        </p>
      </div>

      {/* Search Box */}
      <div className="bg-white border border-[#222222]/10 rounded-sm p-4 sm:p-6 shadow-xs mb-10 max-w-2xl mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTrack();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-grow">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#222222]/40" />
            <input
              type="text"
              placeholder="Enter Order Number (e.g. DL-942811)"
              value={orderQuery}
              onChange={(e) => {
                setOrderQuery(e.target.value);
                setErrorMessage('');
              }}
              className="w-full pl-10 pr-4 py-3 bg-[#F7F3ED] border border-[#222222]/15 focus:border-[#7A211B] rounded-sm text-sm font-mono tracking-wider outline-none transition-colors uppercase"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#7A211B] hover:bg-[#8D2720] text-white font-semibold text-xs uppercase tracking-widest rounded-sm transition-all shadow-xs flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {loading ? 'Tracking...' : 'Track Order'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {errorMessage && (
          <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-sm text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Quick Demo Pill Links */}
        <div className="mt-4 pt-3 border-t border-[#222222]/10 flex items-center gap-2 flex-wrap text-xs text-[#222222]/60">
          <span>Try sample orders:</span>
          {['DL-942811', 'DL-942812', 'DL-942813', 'DL-942810'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => {
                setOrderQuery(num);
                handleTrack(num);
              }}
              className="px-2 py-0.5 rounded-xs bg-[#F7F3ED] hover:bg-[#EFE9DF] text-[#7A211B] font-mono font-semibold text-[11px] border border-[#222222]/10 transition-colors"
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Order Status Result */}
      {orderData && (
        <div className="space-y-8 animate-fadeIn">
          {/* Order Header Card */}
          <div className="bg-white border border-[#222222]/10 rounded-sm p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-sans tracking-widest uppercase text-[#7A211B] font-semibold block">
                Order Tracking Details
              </span>
              <h2 className="font-serif font-bold text-2xl text-[#222222] mt-0.5">
                {orderData.orderNumber}
              </h2>
              <p className="text-xs text-[#222222]/60 mt-1">
                Recipient: <span className="font-semibold text-[#222222]">{orderData.customerName}</span> &bull; Placed on {new Date(orderData.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-xs font-bold text-xs uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                Payment: {orderData.paymentStatus}
              </span>
            </div>
          </div>

          {/* Milestone Stepper */}
          <div className="bg-white border border-[#222222]/10 rounded-sm p-6 sm:p-8 shadow-xs">
            <h3 className="font-serif font-bold text-base text-[#222222] mb-6 flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#7A211B]" />
              Fulfillment Journey
            </h3>

            <div className="relative">
              {/* Stepper Steps */}
              <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#222222]/15">
                {TIMELINE_STEPS.map((step, idx) => {
                  const isCompleted = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <div key={step.id} className="relative flex items-start gap-4 pl-1">
                      {/* Milestone Dot */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 font-mono text-xs font-bold transition-all ${
                          isCompleted
                            ? 'bg-[#7A211B] text-white ring-4 ring-[#7A211B]/10'
                            : 'bg-[#F7F3ED] text-[#222222]/40 border border-[#222222]/20'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>

                      {/* Content */}
                      <div className="flex-grow pt-0.5">
                        <div className="flex items-center gap-2">
                          <p
                            className={`font-serif text-sm sm:text-base font-bold ${
                              isCompleted ? 'text-[#222222]' : 'text-[#222222]/50'
                            }`}
                          >
                            {step.label}
                          </p>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-xs text-[10px] font-sans font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                              Current Status
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#222222]/60 mt-0.5 font-sans">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Courier Tracking Details Box */}
            {(orderData.courierName || orderData.trackingNumber) && (
              <div className="mt-8 p-4 bg-[#F7F3ED] border border-[#C5A880]/40 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-[#7A211B] text-[#EFE9DF] flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-sans text-[#222222]/60 uppercase tracking-wider">Courier Partner</p>
                    <p className="font-serif font-bold text-sm text-[#222222]">{orderData.courierName || 'DTDC Express'}</p>
                  </div>
                </div>

                {orderData.trackingNumber && (
                  <div className="sm:text-right">
                    <p className="text-[11px] font-sans text-[#222222]/60 uppercase tracking-wider">Tracking / AWB Number</p>
                    <p className="font-mono font-bold text-sm text-[#7A211B]">{orderData.trackingNumber}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Items Summary in this order */}
          {orderData.items && orderData.items.length > 0 && (
            <div className="bg-white border border-[#222222]/10 rounded-sm p-6 shadow-xs">
              <h3 className="font-serif font-bold text-base text-[#222222] mb-4 pb-3 border-b border-[#222222]/10">
                Ordered Sarees ({orderData.items.length})
              </h3>
              <div className="divide-y divide-[#222222]/10">
                {orderData.items.map((it: any, i: number) => (
                  <div key={i} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-14 bg-[#EFE9DF] rounded-xs overflow-hidden border border-[#222222]/10 flex-shrink-0">
                        <ImageWithFallback
                          src={it.image || '/sarees/cat-pattu.jpg'}
                          alt={it.name || 'Saree'}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-serif font-bold text-sm text-[#222222]">{it.name}</p>
                        <p className="text-xs text-[#7A211B] font-semibold">Qty: {it.quantity}</p>
                      </div>
                    </div>
                    <p className="font-sans font-bold text-sm text-[#222222]">
                      ₹{it.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Support Bar */}
          <div className="bg-white border border-[#222222]/10 rounded-sm p-6 shadow-xs text-center">
            <p className="text-xs text-[#222222]/60 font-sans mb-3">
              Have questions regarding weaving or dispatch? Our loom masters in Mangalagiri are here to assist.
            </p>
            <a
              href={`https://wa.me/919876543210?text=${encodeURIComponent(`Namaste DL Handlooms! I would like an update on order #${orderData.orderNumber}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-sm text-xs font-semibold shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire via WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#F7F3ED]">
      <Navbar />
      <Suspense fallback={
        <div className="flex-grow flex items-center justify-center p-12 text-center">
          <Clock className="w-8 h-8 animate-spin text-[#7A211B] mx-auto mb-2" />
          <p className="font-serif text-[#222222]">Loading Order Tracking...</p>
        </div>
      }>
        <TrackOrderContent />
      </Suspense>
      <Footer />
    </main>
  );
}
