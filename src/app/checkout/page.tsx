"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronUp, Tag, User, CheckCircle2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import UshaLogo from "@/components/ui/UshaLogo";

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);
  const [showLandmark, setShowLandmark] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [addressType, setAddressType] = useState<"Home" | "Office" | "Others">("Home");
  const [accountOpen, setAccountOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore();

  const [formData, setFormData] = useState({
    pincode: "",
    firstName: "",
    lastName: "",
    building: "",
    area: "",
    landmark: "",
    city: "",
    state: "",
    email: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F3F4F6]">
        <div className="w-8 h-8 border-2 border-[#0B281B]/30 border-t-[#0B281B] rounded-full animate-spin" />
      </main>
    );
  }

  const subtotal = items.length > 0 ? getTotalPrice() : 1499;
  const totalItemsCount = items.length > 0 ? getTotalItems() : 1;
  const discount = appliedCoupon ? 150 : 0;
  const finalTotal = Math.max(0, subtotal - discount);

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === "WELCOME10" || couponCode.trim().length > 2) {
      setAppliedCoupon(couponCode.trim().toUpperCase());
    } else {
      alert("Please enter a valid coupon code");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.pincode) newErrors.pincode = "Pincode is required";
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.building) newErrors.building = "House/Building is required";
    if (!formData.area) newErrors.area = "Area/Street is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setOrderSuccess(true);
    clearCart();
  };

  if (orderSuccess) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#F3F4F6] text-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#0B281B]">Order Confirmed!</h2>
          <p className="text-xs font-sans text-[#1C2621]/70 leading-relaxed">
            Thank you for shopping with Usha Designers. Your order has been placed and tracking information will be sent to your email.
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 bg-[#0B281B] text-white text-xs font-bold uppercase rounded-xs tracking-wider"
          >
            Return to Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F0F3F7] text-[#1C2621] font-sans pb-16">
      {/* Top Bar matching screenshot */}
      <header className="bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <button
          onClick={() => router.back()}
          className="p-2 text-[#1C2621] hover:text-[#0B281B] transition-colors -ml-2"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        <div className="flex-1 flex justify-center -ml-6">
          <UshaLogo variant="dark" size="md" />
        </div>
      </header>

      <div className="max-w-md mx-auto px-3.5 pt-3.5 space-y-3">
        {/* Order Summary Accordion Card */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
          <button
            onClick={() => setOrderSummaryOpen(!orderSummaryOpen)}
            className="w-full p-4 flex items-center justify-between text-sm font-semibold text-[#1C2621]"
          >
            <span>Order summary ({totalItemsCount} Item)</span>
            <div className="flex items-center gap-1.5 font-bold text-[#1C2621]">
              <span>₹{finalTotal.toFixed(2)}</span>
              {orderSummaryOpen ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </div>
          </button>

          {orderSummaryOpen && (
            <div className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-3 text-xs text-[#1C2621]/80">
              {items.length === 0 ? (
                <div className="flex justify-between py-1">
                  <span>10 X 10 Premium Rayon Cotton</span>
                  <span className="font-semibold text-[#1C2621]">₹1,499.00</span>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex justify-between py-1">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="font-semibold text-[#1C2621]">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
              {appliedCoupon && (
                <div className="flex justify-between py-1 text-green-700 font-medium">
                  <span>Coupon Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Coupon Code Container */}
        <div className="bg-white rounded-xl p-3.5 shadow-xs border border-gray-100 flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0">
            <Tag className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1 text-xs sm:text-sm bg-transparent border-none focus:outline-hidden placeholder-gray-400 font-medium"
          />
          <button
            type="button"
            onClick={handleApplyCoupon}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 px-2"
          >
            Apply
          </button>
        </div>

        {/* Add Shipping Address Form Card */}
        <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100 space-y-4">
          <h2 className="text-base font-bold text-[#1C2621]">
            Add shipping address
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs sm:text-sm">
            {/* Pincode with floating style */}
            <div className="relative border border-blue-500 rounded-md p-2 bg-white">
              <label className="text-[10px] text-gray-500 font-medium block">
                Pincode<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    pincode: val,
                    // Mock auto-fill city/state for convenience
                    city: val.length >= 6 ? "Vijayawada" : prev.city,
                    state: val.length >= 6 ? "Andhra Pradesh" : prev.state,
                  }));
                }}
                placeholder="6 digits [0-9] PIN code"
                className="w-full text-xs sm:text-sm font-medium focus:outline-hidden text-[#1C2621]"
              />
              {errors.pincode && <p className="text-[10px] text-red-500">{errors.pincode}</p>}
            </div>

            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="First name*"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-3 rounded-md bg-[#F3F4F6] border-none text-xs sm:text-sm placeholder-gray-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Last name*"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-3 rounded-md bg-[#F3F4F6] border-none text-xs sm:text-sm placeholder-gray-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Flat, house number */}
            <input
              type="text"
              placeholder="Flat, house number, floor, building*"
              value={formData.building}
              onChange={(e) => setFormData({ ...formData, building: e.target.value })}
              className="w-full px-3 py-3 rounded-md bg-[#F3F4F6] border-none text-xs sm:text-sm placeholder-gray-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />

            {/* Area, street */}
            <input
              type="text"
              placeholder="Area, street, sector, village*"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              className="w-full px-3 py-3 rounded-md bg-[#F3F4F6] border-none text-xs sm:text-sm placeholder-gray-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />

            {/* Landmark Area Toggle */}
            <div>
              {!showLandmark ? (
                <button
                  type="button"
                  onClick={() => setShowLandmark(true)}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  + Landmark area
                </button>
              ) : (
                <input
                  type="text"
                  placeholder="Landmark area (optional)"
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  className="w-full px-3 py-3 rounded-md bg-[#F3F4F6] border-none text-xs sm:text-sm placeholder-gray-500 focus:outline-hidden"
                />
              )}
            </div>

            {/* City & State */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="City*"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-3 rounded-md bg-[#F3F4F6] border-none text-xs sm:text-sm placeholder-gray-500 focus:outline-hidden"
              />
              <input
                type="text"
                placeholder="State*"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-3 rounded-md bg-[#F3F4F6] border-none text-xs sm:text-sm placeholder-gray-500 focus:outline-hidden"
              />
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="E-mail (optional)"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-3 rounded-md bg-[#F3F4F6] border-none text-xs sm:text-sm placeholder-gray-500 focus:outline-hidden"
              />
              <p className="text-[11px] text-gray-500 italic mt-1">
                Order delivery details will be sent here
              </p>
            </div>

            {/* Address Type Radio Buttons */}
            <div className="pt-2">
              <label className="text-xs font-bold text-[#1C2621] block mb-2">
                Address type
              </label>
              <div className="flex items-center gap-6 text-xs sm:text-sm font-medium">
                {(["Home", "Office", "Others"] as const).map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="addressType"
                      checked={addressType === type}
                      onChange={() => setAddressType(type)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Blue Add address CTA button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50 mt-4 active:scale-99"
            >
              {submitting ? "Processing..." : "Add address"}
            </button>
          </form>
        </div>

        {/* Collapsible Account Card */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
          <button
            onClick={() => setAccountOpen(!accountOpen)}
            className="w-full p-4 flex items-center justify-between text-sm font-semibold text-[#1C2621]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center text-gray-600">
                <User className="w-4 h-4" />
              </div>
              <span>Account</span>
            </div>
            {accountOpen ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {accountOpen && (
            <div className="p-4 border-t border-gray-100 text-xs text-[#1C2621]/70">
              <p>Logged in as: <strong>yashwanthbevara0@gmail.com</strong></p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
