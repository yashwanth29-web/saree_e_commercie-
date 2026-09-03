"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, MessageCircle, Check, Heart, Zap } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

interface ProductActionsProps {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    sku?: string;
    slug?: string;
    stock?: number;
    fabric?: string;
  };
}

export default function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (isAdded) return;
    setIsAdding(true);

    setTimeout(() => {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || "/sarees/cat-pattu.jpg",
        sku: product.sku || `DL-${product.id.slice(0, 4)}`,
        slug: product.slug,
        stock: product.stock ?? 10,
      });
      setIsAdding(false);
      setIsAdded(true);

      setTimeout(() => setIsAdded(false), 2500);
    }, 400);
  };

  const handleBuyNow = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || "/sarees/cat-pattu.jpg",
      sku: product.sku || `DL-${product.id.slice(0, 4)}`,
      slug: product.slug,
      stock: product.stock ?? 10,
    });
    router.push("/checkout");
  };

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || "/sarees/cat-pattu.jpg",
      sku: product.sku,
      slug: product.slug,
      fabric: product.fabric,
    });
  };

  const whatsappMessage = `Namaste DL Handlooms, I am interested in ordering: ${product.name} (Price: ₹${product.price.toLocaleString("en-IN")}, SKU: ${product.sku || "N/A"}). Please confirm availability.`;
  const whatsappUrl = `https://wa.me/919666228380?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="flex flex-col gap-3 pt-4 border-t border-[#222222]/10 mt-auto">
      
      {/* Primary Action Buttons Row */}
      <div className="flex gap-3 items-stretch">
        
        {/* Add to Cart CTA */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`flex-grow font-sans text-xs sm:text-sm font-semibold tracking-[0.15em] uppercase py-3.5 sm:py-4 px-5 rounded-sm transition-all duration-300 flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md active:scale-[0.99] ${
            isAdded
              ? "bg-[#1F7A4C] text-[#F7F3ED]"
              : "bg-[#7A211B] text-[#F7F3ED] hover:bg-[#5E1914]"
          }`}
          aria-label="Add item to shopping bag"
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" />
              <span>Added to Cart</span>
            </>
          ) : isAdding ? (
            <>
              <div className="w-4 h-4 border-2 border-[#F7F3ED]/30 border-t-[#F7F3ED] rounded-full animate-spin" />
              <span>Adding...</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </>
          )}
        </button>

        {/* Wishlist Toggle Heart Button */}
        <button
          onClick={handleToggleWishlist}
          className={`p-3.5 sm:p-4 border rounded-sm transition-colors flex items-center justify-center flex-shrink-0 ${
            isWishlisted
              ? "border-[#7A211B] bg-[#7A211B]/5 text-[#7A211B]"
              : "border-[#222222]/20 hover:border-[#7A211B] text-[#222222]/70 hover:text-[#7A211B]"
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
          title={isWishlisted ? "In your Wishlist" : "Add to Wishlist"}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? "fill-[#7A211B]" : ""}`} />
        </button>
      </div>

      {/* Buy Now CTA */}
      <button
        onClick={handleBuyNow}
        className="w-full bg-[#B79555] text-[#F7F3ED] hover:bg-[#9E7D3B] font-sans text-xs sm:text-sm font-semibold tracking-[0.15em] uppercase py-3.5 rounded-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
        aria-label="Buy now and proceed directly to checkout"
      >
        <Zap className="w-4 h-4 fill-current" />
        <span>Buy It Now</span>
      </button>

      {/* Secondary Action: WhatsApp Direct Loom Order */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full border border-[#1F7A4C]/40 bg-[#1F7A4C]/5 hover:bg-[#1F7A4C]/15 text-[#1F7A4C] font-sans text-xs sm:text-sm font-semibold tracking-[0.15em] uppercase py-3 rounded-sm transition-all duration-300 flex items-center justify-center gap-2 touch-target"
        aria-label="Inquire or order on WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
        <span>Order / Inquire on WhatsApp</span>
      </a>

      {/* Sticky Mobile Add to Cart & Buy Now Bottom CTA Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#222222]/15 p-2.5 pb-safe shadow-xl">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          {/* Price display */}
          <div className="flex flex-col min-w-[65px] px-1">
            <span className="text-[9px] text-[#222222]/60 uppercase font-sans font-semibold tracking-wider leading-none">Total</span>
            <span className="text-sm sm:text-base font-bold font-sans text-[#7A211B] leading-tight mt-0.5">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`flex-1 py-3 px-2 rounded-xs font-sans text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 touch-target ${
              isAdded
                ? "bg-[#1F7A4C] text-white"
                : "bg-[#7A211B] text-white active:bg-[#5E1914]"
            }`}
          >
            {isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
            <span>{isAdded ? "Added" : "Add to Cart"}</span>
          </button>

          {/* Buy Now button */}
          <button
            onClick={handleBuyNow}
            className="flex-1 py-3 px-2 bg-[#B79555] text-white rounded-xs font-sans text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 touch-target active:bg-[#9E7D3B]"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>

    </div>
  );
}
