"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { useCartStore } from "@/store/cartStore";
import { 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  MessageCircle, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore();

  // Form State
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Andhra Pradesh",
    pinCode: "",
    paymentMethod: "TEST_PAYMENT", // 'TEST_PAYMENT' | 'COD' | 'WHATSAPP'
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen flex flex-col bg-[#F7F3ED]">
        <Navbar />
        <div className="flex-grow flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#7A211B]/30 border-t-[#7A211B] rounded-full animate-spin" />
        </div>
        <Footer />
      </main>
    );
  }

  // If cart is empty, redirect back to cart
  if (items.length === 0) {
    return (
      <main className="min-h-screen flex flex-col bg-[#F7F3ED]">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center py-20 px-4 text-center">
          <h1 className="text-2xl font-serif font-bold text-[#222222] mb-3">
            Your cart is empty
          </h1>
          <p className="text-sm font-sans text-[#222222]/70 mb-6">
            Please add sarees to your cart before proceeding to checkout.
          </p>
          <Link
            href="/shop"
            className="bg-[#7A211B] text-[#F7F3ED] px-6 py-3 rounded-sm text-xs font-sans tracking-widest uppercase font-semibold"
          >
            Explore Sarees
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    
    if (!form.email.trim()) {
      errs.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Please enter a valid email address";
    }

    if (!form.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ""))) {
      errs.phone = "Enter a valid 10-digit mobile number";
    }

    if (!form.address.trim()) errs.address = "Delivery address is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.state.trim()) errs.state = "State is required";

    if (!form.pinCode.trim()) {
      errs.pinCode = "PIN code is required";
    } else if (!/^\d{6}$/.test(form.pinCode.trim())) {
      errs.pinCode = "Enter a valid 6-digit PIN code";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) {
      // Scroll to first error
      window.scrollTo({ top: 150, behavior: "smooth" });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.fullName.trim(),
          customerEmail: form.email.trim(),
          customerPhone: form.phone.trim(),
          shippingAddress: {
            address: form.address.trim(),
            city: form.city.trim(),
            state: form.state.trim(),
            pinCode: form.pinCode.trim(),
            country: "India",
          },
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          paymentMethod: form.paymentMethod,
          subtotal: totalPrice,
          shipping: 0,
          discount: 0,
          total: totalPrice,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to place order");
      }

      // Order created successfully in Prisma!
      const orderNumber = result.order.orderNumber;
      
      // Clear cart
      clearCart();

      // Navigate to order confirmation
      router.push(`/order-confirmation?orderNumber=${encodeURIComponent(orderNumber)}`);
    } catch (err: any) {
      setServerError(err.message || "Something went wrong while placing your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#F7F3ED]">
      <Navbar />

      <div className="flex-grow pt-8 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          
          {/* Breadcrumb / Back */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 text-xs font-sans tracking-widest uppercase text-[#222222]/70 hover:text-[#7A211B] font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Cart</span>
            </Link>
            
            <div className="flex items-center gap-1.5 text-xs font-sans text-[#1F7A4C] font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>256-bit Secure Checkout</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#222222] tracking-tight mb-8">
            Checkout &bull; Shipping &amp; Payment
          </h1>

          {serverError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-sm text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handlePlaceOrder} noValidate>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              
              {/* Left Column: Form Details (~65%) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 1. Customer Information */}
                <div className="bg-white border border-[#222222]/10 rounded-sm p-6 shadow-xs">
                  <h2 className="font-serif text-lg font-bold text-[#222222] pb-3 border-b border-[#222222]/10 mb-4">
                    1. Contact Information
                  </h2>

                  <div className="space-y-4 font-sans">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#222222]/80 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        placeholder="e.g. Lakshmi Devi"
                        className={`w-full px-3.5 py-3 bg-[#F7F3ED]/30 border rounded-sm text-base sm:text-sm text-[#222222] focus:outline-none focus:border-[#7A211B] transition-colors ${
                          errors.fullName ? "border-red-500" : "border-[#222222]/20"
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-red-600 text-xs mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#222222]/80 mb-1">
                          Phone Number (10 digits) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-xs text-[#222222]/60 font-medium">+91</span>
                          <input
                            type="tel"
                            maxLength={10}
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            placeholder="9876543210"
                            className={`w-full pl-12 pr-3.5 py-3 bg-[#F7F3ED]/30 border rounded-sm text-base sm:text-sm text-[#222222] focus:outline-none focus:border-[#7A211B] transition-colors ${
                              errors.phone ? "border-red-500" : "border-[#222222]/20"
                            }`}
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#222222]/80 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="lakshmi@example.com"
                          className={`w-full px-3.5 py-3 bg-[#F7F3ED]/30 border rounded-sm text-base sm:text-sm text-[#222222] focus:outline-none focus:border-[#7A211B] transition-colors ${
                            errors.email ? "border-red-500" : "border-[#222222]/20"
                          }`}
                        />
                        {errors.email && (
                          <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Shipping Address */}
                <div className="bg-white border border-[#222222]/10 rounded-sm p-4 sm:p-6 shadow-xs">
                  <h2 className="font-serif text-base sm:text-lg font-bold text-[#222222] pb-3 border-b border-[#222222]/10 mb-4">
                    2. Shipping Address
                  </h2>

                  <div className="space-y-4 font-sans">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#222222]/80 mb-1">
                        Street Address / Door No / Apartment *
                      </label>
                      <textarea
                        rows={3}
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        placeholder="House No, Street, Landmark"
                        className={`w-full px-3.5 py-3 bg-[#F7F3ED]/30 border rounded-sm text-base sm:text-sm text-[#222222] focus:outline-none focus:border-[#7A211B] transition-colors resize-none ${
                          errors.address ? "border-red-500" : "border-[#222222]/20"
                        }`}
                      />
                      {errors.address && (
                        <p className="text-red-600 text-xs mt-1">{errors.address}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#222222]/80 mb-1">
                          City / Town *
                        </label>
                        <input
                          type="text"
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                          placeholder="e.g. Mangalagiri"
                          className={`w-full px-3.5 py-3 bg-[#F7F3ED]/30 border rounded-sm text-base sm:text-sm text-[#222222] focus:outline-none focus:border-[#7A211B] transition-colors ${
                            errors.city ? "border-red-500" : "border-[#222222]/20"
                          }`}
                        />
                        {errors.city && (
                          <p className="text-red-600 text-xs mt-1">{errors.city}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#222222]/80 mb-1">
                          State *
                        </label>
                        <input
                          type="text"
                          value={form.state}
                          onChange={(e) => setForm({ ...form, state: e.target.value })}
                          placeholder="e.g. Andhra Pradesh"
                          className={`w-full px-3.5 py-3 bg-[#F7F3ED]/30 border rounded-sm text-base sm:text-sm text-[#222222] focus:outline-none focus:border-[#7A211B] transition-colors ${
                            errors.state ? "border-red-500" : "border-[#222222]/20"
                          }`}
                        />
                        {errors.state && (
                          <p className="text-red-600 text-xs mt-1">{errors.state}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#222222]/80 mb-1">
                          PIN Code (6 digits) *
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={form.pinCode}
                          onChange={(e) => setForm({ ...form, pinCode: e.target.value })}
                          placeholder="522503"
                          className={`w-full px-3.5 py-3 bg-[#F7F3ED]/30 border rounded-sm text-base sm:text-sm text-[#222222] focus:outline-none focus:border-[#7A211B] transition-colors ${
                            errors.pinCode ? "border-red-500" : "border-[#222222]/20"
                          }`}
                        />
                        {errors.pinCode && (
                          <p className="text-red-600 text-xs mt-1">{errors.pinCode}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Payment Method */}
                <div className="bg-white border border-[#222222]/10 rounded-sm p-6 shadow-xs">
                  <h2 className="font-serif text-lg font-bold text-[#222222] pb-3 border-b border-[#222222]/10 mb-4">
                    3. Payment Method
                  </h2>

                  <div className="space-y-3 font-sans">
                    
                    {/* Option 1: Test Payment Sandbox */}
                    <label
                      className={`flex items-start gap-3.5 p-4 border rounded-sm cursor-pointer transition-all ${
                        form.paymentMethod === "TEST_PAYMENT"
                          ? "border-[#7A211B] bg-[#7A211B]/5"
                          : "border-[#222222]/15 hover:border-[#222222]/30"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="TEST_PAYMENT"
                        checked={form.paymentMethod === "TEST_PAYMENT"}
                        onChange={() => setForm({ ...form, paymentMethod: "TEST_PAYMENT" })}
                        className="mt-1 text-[#7A211B] focus:ring-[#7A211B]"
                      />
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-[#7A211B]" />
                          <span className="font-semibold text-sm text-[#222222]">
                            Test Payment (Instant Sandbox Simulation)
                          </span>
                          <span className="text-[10px] font-bold tracking-wider uppercase bg-[#1F7A4C] text-white px-2 py-0.5 rounded-xs">
                            Recommended for Testing
                          </span>
                        </div>
                        <p className="text-xs text-[#222222]/70 mt-1">
                          Simulates a verified real payment. An order will be recorded in the database as PAID.
                        </p>
                      </div>
                    </label>

                    {/* Option 2: Cash on Delivery */}
                    <label
                      className={`flex items-start gap-3.5 p-4 border rounded-sm cursor-pointer transition-all ${
                        form.paymentMethod === "COD"
                          ? "border-[#7A211B] bg-[#7A211B]/5"
                          : "border-[#222222]/15 hover:border-[#222222]/30"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={form.paymentMethod === "COD"}
                        onChange={() => setForm({ ...form, paymentMethod: "COD" })}
                        className="mt-1 text-[#7A211B] focus:ring-[#7A211B]"
                      />
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-[#B79555]" />
                          <span className="font-semibold text-sm text-[#222222]">
                            Cash on Delivery / Loom Pickup
                          </span>
                        </div>
                        <p className="text-xs text-[#222222]/70 mt-1">
                          Pay cash upon verified delivery at your doorstep or directly at our Mangalagiri loom center.
                        </p>
                      </div>
                    </label>

                    {/* Option 3: WhatsApp Order Confirmation */}
                    <label
                      className={`flex items-start gap-3.5 p-4 border rounded-sm cursor-pointer transition-all ${
                        form.paymentMethod === "WHATSAPP"
                          ? "border-[#7A211B] bg-[#7A211B]/5"
                          : "border-[#222222]/15 hover:border-[#222222]/30"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="WHATSAPP"
                        checked={form.paymentMethod === "WHATSAPP"}
                        onChange={() => setForm({ ...form, paymentMethod: "WHATSAPP" })}
                        className="mt-1 text-[#7A211B] focus:ring-[#7A211B]"
                      />
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-[#1F7A4C]" />
                          <span className="font-semibold text-sm text-[#222222]">
                            Confirm Order via WhatsApp
                          </span>
                        </div>
                        <p className="text-xs text-[#222222]/70 mt-1">
                          Our master weaver will contact you on WhatsApp to share loom pictures and finalize payment.
                        </p>
                      </div>
                    </label>

                  </div>
                </div>

              </div>

              {/* Right Column: Order Summary (~35%) */}
              <div className="lg:col-span-5 lg:sticky lg:top-24">
                <div className="bg-white border border-[#222222]/10 rounded-sm p-6 shadow-xs">
                  <h2 className="font-serif text-lg font-bold text-[#222222] pb-3 border-b border-[#222222]/10 mb-4">
                    Order Summary ({totalItems} {totalItems === 1 ? "Item" : "Items"})
                  </h2>

                  {/* Cart Items List Preview */}
                  <div className="divide-y divide-[#222222]/10 max-h-64 overflow-y-auto mb-4 pr-1">
                    {items.map((item) => (
                      <div key={item.id} className="py-3 flex items-center gap-3">
                        <div className="relative w-14 h-18 bg-[#EFE9DF] rounded-xs overflow-hidden flex-shrink-0 border border-[#222222]/5">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="56px"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="font-serif text-xs font-bold text-[#222222] line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-[11px] font-sans text-[#222222]/60">
                            Qty: {item.quantity} &times; ₹{item.price.toLocaleString("en-IN")}
                          </p>
                        </div>
                        <span className="font-sans text-xs font-bold text-[#222222] flex-shrink-0">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-2.5 font-sans text-xs text-[#222222]/80 pb-4 border-b border-[#222222]/10">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-[#222222]">
                        ₹{totalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Delivery (Direct from Looms)</span>
                      <span className="font-semibold text-[#1F7A4C] uppercase">FREE</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Handloom Verification</span>
                      <span className="font-semibold text-[#1F7A4C] uppercase">Included</span>
                    </div>
                  </div>

                  {/* Grand Total */}
                  <div className="flex justify-between items-baseline py-4 border-b border-[#222222]/10 mb-5">
                    <span className="font-serif text-sm font-bold text-[#222222]">TOTAL DUE</span>
                    <span className="font-sans text-2xl font-bold text-[#7A211B]">
                      ₹{totalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Submit Order Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#7A211B] hover:bg-[#5E1914] text-[#F7F3ED] font-sans text-xs sm:text-sm font-semibold tracking-[0.15em] uppercase py-4 px-6 rounded-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed mb-4"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#F7F3ED]/30 border-t-[#F7F3ED] rounded-full animate-spin" />
                        <span>Confirming Order...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>COMPLETE ORDER &bull; ₹{totalPrice.toLocaleString("en-IN")}</span>
                      </>
                    )}
                  </button>

                  {/* Trust Footer */}
                  <div className="text-[11px] font-sans text-[#222222]/65 space-y-2 border-t border-[#222222]/10 pt-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#B79555] flex-shrink-0" />
                      <span>Authentic Handloom direct from Mangalagiri weavers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-[#B79555] flex-shrink-0" />
                      <span>Your order data is encrypted &amp; stored securely</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </form>

        </div>
      </div>

      <Footer />
    </main>
  );
}
