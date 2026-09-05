"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Truck, Package, ChevronRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

interface ProductActionsProps {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    sku?: string;
    slug?: string;
    stock?: number;
  };
}

export default function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const setIsCartOpen = useCartStore((state) => state.setIsOpen);

  // Dynamic delivery dates (e.g. 4-8 days from now)
  const today = new Date();
  const deliveryStart = new Date(today);
  deliveryStart.setDate(today.getDate() + 4);
  const deliveryEnd = new Date(today);
  deliveryEnd.setDate(today.getDate() + 8);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || "/sarees/cat-pattu.jpg",
      sku: product.sku,
      slug: product.slug,
      stock: product.stock ?? 10,
      quantity,
    });
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || "/sarees/cat-pattu.jpg",
      sku: product.sku,
      slug: product.slug,
      stock: product.stock ?? 10,
      quantity,
    });
    router.push("/checkout");
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Quantity Stepper */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-sans font-medium text-[#1C2621]">Quantity</span>
        <div className="flex items-center border border-[#0B281B]/20 rounded-xs bg-white">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-9 h-8 flex items-center justify-center text-[#1C2621] hover:bg-[#0B281B]/5 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-10 text-center text-xs font-semibold text-[#0B281B]">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="w-9 h-8 flex items-center justify-center text-[#1C2621] hover:bg-[#0B281B]/5 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Add To Cart Button */}
      <button
        onClick={handleAddToCart}
        className="w-full py-3 bg-white border border-[#0B281B] text-[#0B281B] hover:bg-[#0B281B]/5 text-xs sm:text-sm font-sans font-semibold tracking-wider uppercase rounded-xs transition-colors"
      >
        Add to cart
      </button>

      {/* BUY NOW Button with UPI logos */}
      <button
        onClick={handleBuyNow}
        className="w-full py-3.5 bg-[#0B281B] hover:bg-[#071F14] text-white rounded-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] group"
      >
        <span className="font-sans font-extrabold tracking-wider text-sm uppercase">
          BUY NOW
        </span>

        {/* Payment badges */}
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

      {/* Estimated Delivery & Shipping Notices */}
      <div className="pt-2 space-y-2 text-xs font-sans text-[#1C2621]/80">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#0B281B] flex-shrink-0" />
          <span>
            <strong className="text-[#1C2621]">Estimated Delivery:</strong>{" "}
            {formatDate(deliveryStart)} - {formatDate(deliveryEnd)}
          </span>
        </div>

        <div className="flex items-start gap-2">
          <Package className="w-4 h-4 text-[#0B281B] flex-shrink-0 mt-0.5" />
          <span>A flat shipping charge of ₹150 is applicable on all products.</span>
        </div>
      </div>

      {/* Dark Green Trust Badges Strip */}
      <div className="bg-[#0B281B] text-white p-2.5 rounded-xs flex items-center justify-around text-[11px] font-sans font-medium">
        <div className="flex items-center gap-1.5">
          <span>⚠️</span>
          <span>No Return/Exchange</span>
        </div>
        <div className="w-[1px] h-3 bg-white/20" />
        <div className="flex items-center gap-1.5">
          <span>🚚</span>
          <span>3–6 day delivery across all India</span>
        </div>
      </div>

      {/* Mobile Sticky Add To Cart docked above bottom nav */}
      <div className="sm:hidden fixed bottom-15 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#0B281B]/10 p-2.5 shadow-xl">
        <button
          onClick={handleAddToCart}
          className="w-full py-3 bg-[#0B281B] text-white text-xs font-sans font-bold tracking-wider uppercase rounded-xs shadow-md active:scale-98"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
