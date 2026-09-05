"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Eye, Check } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

export interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  slug?: string;
  isSoldOut?: boolean;
}

export default function ProductCardOverlay({
  id,
  name,
  price,
  image,
  slug,
  isSoldOut = false,
}: ProductCardProps) {
  const [addedAnimation, setAddedAnimation] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const setIsCartOpen = useCartStore((state) => state.setIsOpen);
  const { isInWishlist, addItem: addWishlist, removeItem: removeWishlist } = useWishlistStore();

  const href = `/product/${slug || id}`;
  const isWishlisted = isInWishlist(id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut) return;
    addItem({ id, name, price, image, slug });
    setIsCartOpen(true);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeWishlist(id);
    } else {
      addWishlist({ id, name, price, image, slug });
    }
  };

  return (
    <div className="group flex flex-col w-full">
      {/* Product Image Container */}
      <div className="relative aspect-[4/5] w-full bg-[#F4F8F6] overflow-hidden rounded-xs">
        <Link href={href} prefetch={true} className="block w-full h-full">
          <Image
            src={image || "/sarees/cat-pattu.jpg"}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="eager"
            priority={true}
            className="object-cover w-full h-full group-hover:scale-103 transition-transform duration-200"
          />
        </Link>

        {/* Sold Out Badge */}
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-18 h-18 rounded-full bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center shadow-md border border-[#0B281B]/10">
              <span className="text-[11px] font-bold tracking-wider text-[#0B281B] leading-tight text-center">
                SOLD<br />OUT
              </span>
            </div>
          </div>
        )}

        {/* Action Overlay Bar: Floating Pill at Bottom Center */}
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10">
          <div className="flex items-center bg-white rounded-xs shadow-md border border-black/10 divide-x divide-black/10 px-0.5 py-0.5">
            {/* Wishlist */}
            <button
              onClick={handleToggleWishlist}
              className={`w-7 h-7 flex items-center justify-center transition-colors ${
                isWishlisted ? "text-red-600" : "text-[#1C2621]/80 hover:text-[#0B281B]"
              }`}
              aria-label="Add to wishlist"
            >
              <Heart
                className={`w-3.5 h-3.5 ${isWishlisted ? "fill-red-600" : ""}`}
              />
            </button>

            {/* Add To Cart */}
            <button
              onClick={handleAddToCart}
              disabled={isSoldOut}
              className="w-7 h-7 flex items-center justify-center text-[#1C2621]/80 hover:text-[#0B281B] disabled:opacity-40 transition-colors"
              aria-label="Add to cart"
            >
              {addedAnimation ? (
                <Check className="w-3.5 h-3.5 text-green-700 animate-in zoom-in" />
              ) : (
                <ShoppingBag className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Quick View / Link */}
            <Link
              href={href}
              className="w-7 h-7 flex items-center justify-center text-[#1C2621]/80 hover:text-[#0B281B] transition-colors"
              aria-label="View product details"
            >
              <Eye className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Details */}
      <Link
        href={href}
        prefetch={true}
        className="pt-2 flex flex-col cursor-pointer group/title"
      >
        <h3 className="font-serif text-[13px] sm:text-sm font-normal text-[#1C2621] group-hover/title:text-[#0B281B] line-clamp-2 leading-snug transition-colors">
          {name}
        </h3>
        <div className="font-sans font-medium text-sm text-[#0B281B] mt-0.5">
          ₹ {price.toLocaleString("en-IN")}
        </div>
      </Link>
    </div>
  );
}
