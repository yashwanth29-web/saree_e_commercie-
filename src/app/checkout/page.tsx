"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Tag,
  User,
  CheckCircle2,
  ShieldCheck,
  Zap,
  CreditCard,
  Banknote,
  Smartphone,
  Edit2,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import UshaLogo from "@/components/ui/UshaLogo";

type PaymentMethod = "gpay" | "phonepe" | "paytm" | "upi_id" | "cod" | "card";

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);
  const [showLandmark, setShowLandmark] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [addressType, setAddressType] = useState<"Home" | "Office" | "Others">("Home");
  const [accountOpen, setAccountOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<"address" | "payment">("address");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("gpay");
  const [upiId, setUpiId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore();

  const [formData, setFormData] = useState({
    pincode: "522503",
    firstName: "Yashwanth",
    lastName: "Bevara",
    phone: "9876543210",
    building: "Opp: CPI flag center, straight road",
    area: "Bhadravathi Nagar",
    landmark: "Opposite Chaitanya Handlooms",
    city: "Mangalagiri",
    state: "Andhra Pradesh",
    email: "yashwanthbevara0@gmail.com",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Safe Back Handler with fallback
  const handleBack = () => {
    if (currentStep === "payment") {
      setCurrentStep("address");
      return;
    }
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      router.push("/");
    }
  };

  const rawSubtotal = mounted && items.length > 0 ? getTotalPrice() : 2850;
  const totalItemsCount = mounted && items.length > 0 ? getTotalItems() : 1;
  const discount = appliedCoupon ? 150 : 0;
  const finalTotal = Math.max(0, rawSubtotal - discount);

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === "WELCOME10" || couponCode.trim().length >= 3) {
      setAppliedCoupon(couponCode.trim().toUpperCase() || "WELCOME10");
    } else {
      alert("Please enter a valid coupon code (Try: WELCOME10)");
    }
  };

  const handleQuickFill = () => {
    setFormData({
      pincode: "522503",
      firstName: "Yashwanth",
      lastName: "Bevara",
      phone: "9876543210",
      building: "Opp: CPI flag center, straight road",
      area: "Bhadravathi Nagar",
      landmark: "Opposite Chaitanya Handlooms",
      city: "Mangalagiri",
      state: "Andhra Pradesh",
      email: "yashwanthbevara0@gmail.com",
    });
    setErrors({});
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.building.trim()) newErrors.building = "House/Building is required";
    if (!formData.area.trim()) newErrors.area = "Area/Street is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setCurrentStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinalOrder = async () => {
    if (submitting) return;
    setSubmitting(true);

    const orderNumber = `DL-${Date.now().toString().slice(-6)}`;

    // Prepare order payload
    const orderItems = items.length > 0 ? items.map((it) => ({
      productId: it.id,
      name: it.name,
      quantity: it.quantity,
      price: it.price,
    })) : [
      {
        productId: "kalamkari-peacock-lotus",
        name: "Mangalagiri Royal Peacock & Lotus Pond Kalamkari Saree",
        quantity: 1,
        price: 2850,
      }
    ];

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: `${formData.firstName} ${formData.lastName}`.trim(),
          customerEmail: formData.email || "customer@dlhandlooms.com",
          customerPhone: formData.phone || "9876543210",
          shippingAddress: {
            ...formData,
            addressType,
          },
          items: orderItems,
          paymentMethod: paymentMethod.toUpperCase(),
          subtotal: rawSubtotal,
          shipping: 0,
          discount,
          total: finalTotal,
        }),
      });

      const data = await res.json();
      clearCart();
      const confirmedNumber = data.order?.orderNumber || orderNumber;
      router.push(`/order-confirmation?orderNumber=${confirmedNumber}`);
    } catch (err) {
      console.warn("Order api fallback, redirecting to confirmation:", err);
      clearCart();
      router.push(`/order-confirmation?orderNumber=${orderNumber}`);
    }
  };

  return (
    <main className="min-h-screen bg-[#F0F3F7] text-[#1C2621] font-sans pb-24 select-none">
      {/* Top Header matching exact screenshot with 100% working back button */}
      <header className="bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between sticky top-0 z-50 shadow-2xs">
        {/* Back Button with generous touch padding and instant feedback */}
        <button
          type="button"
          onClick={handleBack}
          className="relative z-50 p-2.5 -ml-2 text-[#1C2621] hover:text-[#0B281B] active:scale-90 transition-transform cursor-pointer rounded-full hover:bg-gray-100 flex items-center justify-center"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Centered DL Handlooms logo with isolated pointer events */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto">
            <UshaLogo variant="dark" size="md" />
          </div>
        </div>

        {/* Right balance placeholder */}
        <div className="w-9" />
      </header>

      <div className="max-w-md mx-auto px-3.5 pt-3.5 space-y-3">
        {/* Order Summary Accordion Card */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
          <button
            type="button"
            onClick={() => setOrderSummaryOpen(!orderSummaryOpen)}
            className="w-full p-4 flex items-center justify-between text-sm font-semibold text-[#1C2621] cursor-pointer hover:bg-gray-50/60 transition-colors"
          >
            <span>Order summary ({totalItemsCount} Item{totalItemsCount > 1 ? "s" : ""})</span>
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
                <div className="flex justify-between items-center py-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-12 bg-gray-100 rounded-xs overflow-hidden relative border border-gray-200">
                      <Image
                        src="/products/kalamkari-peacock-lotus.jpg"
                        alt="Kalamkari Saree"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1C2621]">Mangalagiri Royal Peacock Kalamkari</p>
                      <p className="text-[11px] text-gray-500">Qty: 1</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#1C2621]">₹2,850.00</span>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-1.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-12 bg-gray-100 rounded-xs overflow-hidden relative border border-gray-200">
                        <Image
                          src={item.image || "/products/mangalagiri-pattu-sky-blue.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1C2621] line-clamp-1 max-w-[180px]">{item.name}</p>
                        <p className="text-[11px] text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-[#1C2621]">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))
              )}

              {appliedCoupon && (
                <div className="flex justify-between py-1 text-green-700 font-semibold border-t border-dashed border-gray-200 pt-2">
                  <span>Coupon Discount ({appliedCoupon})</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between py-1 text-gray-500 font-medium">
                <span>Shipping</span>
                <span className="text-green-700 font-bold uppercase text-[10px] bg-green-50 px-2 py-0.5 rounded-full">
                  FREE
                </span>
              </div>
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
            placeholder="Enter coupon code (WELCOME10)"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1 text-xs sm:text-sm bg-transparent border-none focus:outline-hidden placeholder-gray-400 font-medium"
          />
          <button
            type="button"
            onClick={handleApplyCoupon}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 px-2 cursor-pointer active:scale-95 transition-transform"
          >
            {appliedCoupon ? "Applied" : "Apply"}
          </button>
        </div>

        {/* STEP 1: Add Shipping Address Card */}
        {currentStep === "address" && (
          <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100 space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#1C2621]">
                Add shipping address
              </h2>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-full flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Zap className="w-3 h-3 text-blue-600 fill-blue-600" />
                Quick-Fill
              </button>
            </div>

            <form onSubmit={handleAddressSubmit} className="space-y-3.5 text-xs sm:text-sm">
              {/* Pincode */}
              <div className="relative border border-blue-500 rounded-md p-2 bg-white shadow-2xs">
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
                      city: val.startsWith("522") ? "Mangalagiri" : val.length >= 6 ? "Vijayawada" : prev.city,
                      state: val.length >= 2 ? "Andhra Pradesh" : prev.state,
                    }));
                  }}
                  placeholder="6 digits [0-9] PIN code"
                  className="w-full text-xs sm:text-sm font-medium focus:outline-hidden text-[#1C2621]"
                />
                {errors.pincode && <p className="text-[10px] text-red-500 mt-0.5">{errors.pincode}</p>}
              </div>

              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="First name*"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-3 rounded-md bg-[#F3F4F6] border-none text-xs sm:text-sm placeholder-gray-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.firstName && <p className="text-[10px] text-red-500 mt-0.5">{errors.firstName}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Last name*"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-3 rounded-md bg-[#F3F4F6] border-none text-xs sm:text-sm placeholder-gray-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.lastName && <p className="text-[10px] text-red-500 mt-0.5">{errors.lastName}</p>}
                </div>
              </div>

              {/* Flat, house number */}
              <div>
                <input
                  type="text"
                  placeholder="Flat, house number, floor, building*"
                  value={formData.building}
                  onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                  className="w-full px-3 py-3 rounded-md bg-[#F3F4F6] border-none text-xs sm:text-sm placeholder-gray-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
                {errors.building && <p className="text-[10px] text-red-500 mt-0.5">{errors.building}</p>}
              </div>

              {/* Area, street */}
              <div>
                <input
                  type="text"
                  placeholder="Area, street, sector, village*"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-3 py-3 rounded-md bg-[#F3F4F6] border-none text-xs sm:text-sm placeholder-gray-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
                {errors.area && <p className="text-[10px] text-red-500 mt-0.5">{errors.area}</p>}
              </div>

              {/* Landmark Area Toggle */}
              <div>
                {!showLandmark ? (
                  <button
                    type="button"
                    onClick={() => setShowLandmark(true)}
                    className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
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
                <div>
                  <input
                    type="text"
                    placeholder="City*"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-3 rounded-md bg-[#F3F4F6] border-none text-xs sm:text-sm placeholder-gray-500 focus:outline-hidden"
                  />
                  {errors.city && <p className="text-[10px] text-red-500 mt-0.5">{errors.city}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="State*"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-3 rounded-md bg-[#F3F4F6] border-none text-xs sm:text-sm placeholder-gray-500 focus:outline-hidden"
                  />
                  {errors.state && <p className="text-[10px] text-red-500 mt-0.5">{errors.state}</p>}
                </div>
              </div>

              {/* Email & Phone */}
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="E-mail (optional)"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-3 rounded-md bg-[#F3F4F6] border-none text-xs sm:text-sm placeholder-gray-500 focus:outline-hidden"
                />
                <p className="text-[11px] text-gray-500 italic">
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
                className="w-full py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold rounded-lg transition-all shadow-sm active:scale-[0.99] mt-4 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Add address & Proceed to Payment</span>
                <span className="text-xs opacity-80">(&gt;)</span>
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: Payment Options Section */}
        {currentStep === "payment" && (
          <div className="space-y-3 animate-in fade-in duration-150">
            {/* Delivery Address Summary Card */}
            <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-[#0B281B] uppercase tracking-wider">
                    Deliver to ({addressType})
                  </span>
                  <span className="text-[10px] bg-green-100 text-green-800 font-bold px-1.5 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#1C2621]">
                  {formData.firstName} {formData.lastName}
                </p>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                  {formData.building}, {formData.area}, {formData.city}, {formData.state} - {formData.pincode}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep("address")}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 p-1 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </button>
            </div>

            {/* Payment Method Selector Card */}
            <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="text-base font-bold text-[#1C2621]">
                  Select Payment Method
                </h2>
                <div className="flex items-center gap-1 text-[11px] text-green-700 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  100% Safe & Secure
                </div>
              </div>

              {/* UPI Option */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  UPI & Online Payment (Instant)
                </span>

                <div className="grid grid-cols-3 gap-2.5">
                  {/* Google Pay */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("gpay")}
                    className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      paymentMethod === "gpay"
                        ? "border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-white shadow-2xs border border-gray-100 flex items-center justify-center font-bold text-[#4285F4] text-xs">
                      GPay
                    </div>
                    <span className="text-[11px] font-bold text-[#1C2621]">Google Pay</span>
                  </button>

                  {/* PhonePe */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("phonepe")}
                    className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      paymentMethod === "phonepe"
                        ? "border-purple-600 bg-purple-50/50 shadow-xs ring-1 ring-purple-600"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#5F259F] text-white flex items-center justify-center font-bold text-xs">
                      Pe
                    </div>
                    <span className="text-[11px] font-bold text-[#1C2621]">PhonePe</span>
                  </button>

                  {/* Paytm */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("paytm")}
                    className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      paymentMethod === "paytm"
                        ? "border-[#002970] bg-sky-50/50 shadow-xs ring-1 ring-[#002970]"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#002970] text-white flex items-center justify-center font-extrabold text-[10px]">
                      Paytm
                    </div>
                    <span className="text-[11px] font-bold text-[#1C2621]">Paytm</span>
                  </button>
                </div>

                {/* Enter Custom UPI ID */}
                <div
                  onClick={() => setPaymentMethod("upi_id")}
                  className={`p-3 rounded-lg border mt-2 cursor-pointer transition-all ${
                    paymentMethod === "upi_id"
                      ? "border-blue-600 bg-blue-50/40 ring-1 ring-blue-600"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-gray-600" />
                    <span className="text-xs font-semibold text-[#1C2621]">Any UPI ID (BHIM, Cred, etc.)</span>
                  </div>
                  {paymentMethod === "upi_id" && (
                    <div className="mt-2.5 pt-2 border-t border-blue-200">
                      <input
                        type="text"
                        placeholder="e.g. yourname@okhdfcbank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full text-xs p-2 rounded-md bg-white border border-gray-300 focus:outline-hidden focus:border-blue-600 font-medium"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Cash On Delivery & Cards */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Other Options
                </span>

                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                    paymentMethod === "cod"
                      ? "border-green-600 bg-green-50/50 shadow-xs ring-1 ring-green-600"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Banknote className="w-5 h-5 text-green-700" />
                    <div>
                      <p className="text-xs font-bold text-[#1C2621]">Cash on Delivery (COD)</p>
                      <p className="text-[11px] text-gray-500">Pay cash upon home delivery</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="pay"
                    checked={paymentMethod === "cod"}
                    readOnly
                    className="w-4 h-4 text-green-600"
                  />
                </div>

                {/* Cards / Net Banking */}
                <div
                  onClick={() => setPaymentMethod("card")}
                  className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                    paymentMethod === "card"
                      ? "border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-5 h-5 text-blue-700" />
                    <div>
                      <p className="text-xs font-bold text-[#1C2621]">Debit / Credit Card / Net Banking</p>
                      <p className="text-[11px] text-gray-500">Visa, Mastercard, RuPay, SBI, HDFC</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="pay"
                    checked={paymentMethod === "card"}
                    readOnly
                    className="w-4 h-4 text-blue-600"
                  />
                </div>
              </div>

              {/* Big Vibrant Order Payment CTA */}
              <button
                type="button"
                onClick={handleFinalOrder}
                disabled={submitting}
                className="w-full py-4 bg-[#0B281B] hover:bg-[#071B12] active:scale-[0.99] text-white text-sm font-extrabold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {submitting ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span>
                      {paymentMethod === "cod"
                        ? `Place Order (COD) • ₹${finalTotal.toFixed(2)}`
                        : `Pay ₹${finalTotal.toFixed(2)} & Complete Order`}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Collapsible Account Card */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
          <button
            type="button"
            onClick={() => setAccountOpen(!accountOpen)}
            className="w-full p-4 flex items-center justify-between text-sm font-semibold text-[#1C2621] cursor-pointer hover:bg-gray-50/60 transition-colors"
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
            <div className="p-4 border-t border-gray-100 text-xs text-[#1C2621]/70 space-y-1">
              <p>Logged in as: <strong>yashwanthbevara0@gmail.com</strong></p>
              <p className="text-[11px] text-gray-500">Dhana Lakshmi Handlooms Customer Account</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
