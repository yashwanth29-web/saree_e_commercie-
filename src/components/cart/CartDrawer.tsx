"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Minus, Plus, ChevronRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function CartDrawer() {
  const router = useRouter();
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, getTotalPrice } = useCartStore();

  const totalPrice = getTotalPrice();

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-2xs transition-opacity animate-in fade-in"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-250">
        
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#0B281B]/10">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B281B] tracking-tight">
            Shopping Cart
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full text-[#1C2621]/60 hover:text-[#0B281B] hover:bg-[#0B281B]/5 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 divide-y divide-[#0B281B]/5">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-serif text-lg text-[#0B281B] mb-2">Your cart is empty</p>
              <p className="text-xs text-[#1C2621]/60 mb-6">Explore our curated collections and add your favorite pieces.</p>
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push("/shop");
                }}
                className="px-6 py-2.5 bg-[#0B281B] text-white text-xs font-semibold rounded-xs tracking-wider uppercase"
              >
                Shop Now
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 flex gap-3.5 items-start">
                {/* Image */}
                <div className="relative w-18 h-18 sm:w-20 sm:h-20 bg-[#F4F8F6] rounded-xs overflow-hidden flex-shrink-0 border border-[#0B281B]/10">
                  <Image
                    src={item.image || "/sarees/cat-pattu.jpg"}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-sm font-semibold text-[#0B281B] truncate leading-tight mb-1">
                    {item.name}
                  </h3>
                  <div className="font-sans font-bold text-[#0B281B] text-sm mb-2.5">
                    ₹ {item.price.toLocaleString("en-IN")}
                  </div>

                  {/* Stepper + Remove */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-[#0B281B]/20 rounded-xs bg-white">
                      <button
                        onClick={() => {
                          if (item.quantity <= 1) {
                            removeItem(item.id);
                          } else {
                            updateQuantity(item.id, item.quantity - 1);
                          }
                        }}
                        className="w-7 h-7 flex items-center justify-center text-[#1C2621] hover:bg-[#0B281B]/5 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-semibold text-[#0B281B]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#1C2621] hover:bg-[#0B281B]/5 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-[#1C2621]/60 hover:text-[#0B281B] underline tracking-tight transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Subtotal & Instant Checkout */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#0B281B]/10 bg-[#FAFAF8] space-y-3.5">
            <div className="flex items-center justify-between text-base">
              <span className="font-sans font-medium text-[#1C2621]">Subtotal</span>
              <span className="font-sans font-bold text-lg text-[#0B281B]">
                ₹ {totalPrice.toLocaleString("en-IN")}
              </span>
            </div>

            {/* BUY NOW Button with UPI Badges */}
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/checkout");
              }}
              className="w-full py-3.5 bg-[#0B281B] hover:bg-[#082015] text-white rounded-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] group"
            >
              <span className="font-sans font-extrabold tracking-wider text-sm uppercase">
                BUY NOW
              </span>
              
              {/* Payment Pill Badges */}
              <div className="inline-flex items-center bg-white px-1.5 py-0.5 rounded-full text-[9px] gap-1 font-bold text-[#1C2621]">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#5F259F]">Pe</span>
                <span className="text-[#002970]">Paytm</span>
              </div>

              <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />

              <span className="text-[9px] text-white/70 ml-1 font-medium hidden sm:inline">
                Powered By Shiprocket
              </span>
            </button>

            {/* View Cart Link */}
            <div className="text-center pt-1">
              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="text-xs font-sans text-[#0B281B] underline hover:text-[#163C2A] font-medium"
              >
                View Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
