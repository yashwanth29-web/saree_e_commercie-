"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { useWishlistStore, WishlistItem } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, clearWishlist, getTotalItems } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);

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

  const totalItems = getTotalItems();

  const handleMoveToCart = (item: WishlistItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      sku: item.sku,
      slug: item.slug,
    });
    // Remove from wishlist after moving to cart
    removeItem(item.id);
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#F7F3ED]">
      <Navbar />

      <div className="flex-grow pt-8 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          
          {/* Header */}
          <div className="mb-8 border-b border-[#222222]/10 pb-5 flex items-baseline justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#222222] tracking-tight mb-1">
                My Wishlist
              </h1>
              <p className="text-sm font-sans text-[#222222]/70">
                {totalItems} {totalItems === 1 ? "saved saree" : "saved sarees"}
              </p>
            </div>

            {items.length > 0 && (
              <button
                onClick={clearWishlist}
                className="text-xs font-sans text-[#222222]/50 hover:text-[#7A211B] underline transition-colors"
              >
                Clear Wishlist
              </button>
            )}
          </div>

          {items.length === 0 ? (
            /* Empty State */
            <div className="bg-white border border-[#222222]/10 rounded-sm p-10 sm:p-16 text-center max-w-xl mx-auto shadow-xs my-8">
              <div className="w-16 h-16 bg-[#7A211B]/10 text-[#7A211B] rounded-full flex items-center justify-center mx-auto mb-5">
                <Heart className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#222222] mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-[#222222]/70 font-sans text-sm mb-7 max-w-md mx-auto">
                Save your favorite Mangalagiri pattu and cotton sarees here to view or order them anytime.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#7A211B] hover:bg-[#5E1914] text-[#F7F3ED] font-sans text-xs font-semibold tracking-[0.15em] uppercase px-7 py-3.5 rounded-sm transition-colors shadow-sm"
              >
                <span>EXPLORE SAREES</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            /* Wishlist Products Grid (2 columns on mobile) */
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-[#222222]/10 rounded-sm overflow-hidden flex flex-col group hover:border-[#222222]/20 hover:shadow-xs transition-all"
                >
                  {/* Image */}
                  <Link
                    href={`/product/${item.id}`}
                    className="relative aspect-[3/4] bg-[#EFE9DF] overflow-hidden block"
                  >
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeItem(item.id);
                      }}
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 bg-white/90 hover:bg-white text-[#7A211B] rounded-full shadow-xs transition-colors touch-target"
                      title="Remove from wishlist"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </Link>

                  {/* Details */}
                  <div className="p-2.5 sm:p-4 flex flex-col flex-grow">
                    <p className="text-[9px] sm:text-[10px] text-[#7A211B] font-sans font-semibold uppercase tracking-wider mb-1">
                      {item.fabric || "Pure Handloom"}
                    </p>

                    <Link
                      href={`/product/${item.id}`}
                      className="font-serif text-xs sm:text-base font-bold text-[#222222] hover:text-[#7A211B] line-clamp-2 block leading-snug mb-2 flex-grow"
                    >
                      {item.name}
                    </Link>

                    <div className="pt-2 border-t border-[#222222]/5 mt-auto">
                      <p className="font-sans font-bold text-[#222222] text-xs sm:text-base mb-2">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>

                      {/* Move to Cart Action */}
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="w-full bg-[#7A211B] hover:bg-[#5E1914] text-[#F7F3ED] font-sans text-[11px] sm:text-xs font-semibold tracking-wider uppercase py-2 sm:py-2.5 px-2 rounded-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs touch-target"
                      >
                        <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span>Move to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      <Footer />
    </main>
  );
}
