"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Search, Send } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";

interface ProductDetailClientSectionProps {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    images?: { url: string }[];
  };
  primaryImage: string;
}

export default function ProductDetailClientSection({
  product,
  primaryImage,
}: ProductDetailClientSectionProps) {
  const [activeTab, setActiveTab] = useState<"desc" | "shipping">("desc");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [shareToast, setShareToast] = useState(false);

  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const images =
    product.images && product.images.length > 0
      ? product.images.map((img) => img.url)
      : [primaryImage];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2000);
    }
  };

  return (
    <div>
      {/* Product Image Showcase */}
      <div className="relative aspect-square w-full bg-[#F4F8F6] rounded-xs overflow-hidden border border-[#0B281B]/10 shadow-xs">
        <Image
          src={images[activeImageIndex] || primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, 600px"
          className="object-cover"
          priority
        />

        {/* Top-Right Floating Wishlist Button */}
        <button
          onClick={() => toggleWishlist({ id: product.id, name: product.name, price: product.price, image: primaryImage })}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-md text-[#1C2621] hover:text-red-600 transition-colors"
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-600 text-red-600" : ""}`} />
        </button>

        {/* Bottom-Right Floating Zoom Button */}
        <button
          className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-md text-[#1C2621] hover:text-[#0B281B] transition-colors"
          aria-label="Zoom image"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Pagination Dot Indicator */}
      <div className="flex items-center justify-center gap-1.5 py-3">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImageIndex(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              activeImageIndex === idx
                ? "border-2 border-[#0B281B] bg-transparent"
                : "bg-[#0B281B]/30"
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Title + Share Button Row */}
      <div className="flex items-start justify-between gap-3 pt-1">
        <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#0B281B] leading-tight flex-1">
          {product.name}
        </h1>

        <button
          onClick={handleShare}
          className="w-9 h-9 rounded-full border border-[#0B281B]/15 flex items-center justify-center text-[#0B281B] hover:bg-[#0B281B]/5 transition-colors flex-shrink-0 relative"
          aria-label="Share product"
        >
          <Send className="w-4 h-4 -rotate-45" />
          {shareToast && (
            <span className="absolute -bottom-8 right-0 bg-[#0B281B] text-white text-[10px] px-2 py-0.5 rounded shadow-md whitespace-nowrap">
              Link copied!
            </span>
          )}
        </button>
      </div>

      {/* Price */}
      <div className="font-sans font-bold text-lg text-[#0B281B] mt-1 mb-4">
        ₹ {product.price.toLocaleString("en-IN")}
      </div>

      {/* Tabs: Product description & Shipping & Refund */}
      <div className="mt-6 border-b border-[#0B281B]/15 flex gap-6 text-sm font-sans font-semibold">
        <button
          onClick={() => setActiveTab("desc")}
          className={`pb-2 transition-colors relative ${
            activeTab === "desc"
              ? "text-[#0B281B] border-b-2 border-[#0B281B]"
              : "text-[#1C2621]/60 hover:text-[#0B281B]"
          }`}
        >
          Product description
        </button>

        <button
          onClick={() => setActiveTab("shipping")}
          className={`pb-2 transition-colors relative ${
            activeTab === "shipping"
              ? "text-[#0B281B] border-b-2 border-[#0B281B]"
              : "text-[#1C2621]/60 hover:text-[#0B281B]"
          }`}
        >
          Shipping &amp; Refund
        </button>
      </div>

      {/* Tab Content */}
      <div className="py-4 text-xs font-sans text-[#1C2621]/80 leading-relaxed">
        {activeTab === "desc" ? (
          <p>{product.description}</p>
        ) : (
          <div className="space-y-2">
            <p>• Standard domestic delivery: 3–6 business days across India.</p>
            <p>• Flat shipping fee of ₹150 applies at checkout.</p>
            <p>• Due to handloom and designer exclusivity, items are covered under strict exchange for transit damages only with an opening video.</p>
          </div>
        )}
      </div>
    </div>
  );
}
