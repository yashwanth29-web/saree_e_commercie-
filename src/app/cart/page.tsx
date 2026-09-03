"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { useCartStore, CartItem } from "@/store/cartStore";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  MessageCircle,
  Lock
} from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    getTotalPrice, 
    getTotalItems 
  } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen flex flex-col bg-[#F7F3ED]">
        <Navbar />
        <div className="flex-grow flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-[#7A211B]/30 border-t-[#7A211B] rounded-full animate-spin" />
        </div>
        <Footer />
      </main>
    );
  }

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  // Pre-formatted WhatsApp order message listing all items, SKUs, quantities, and prices
  const generateWhatsAppUrl = () => {
    const lines = items.map((item, index) => {
      const sku = item.sku ? ` (${item.sku})` : "";
      const itemSubtotal = (item.price * item.quantity).toLocaleString("en-IN");
      return `${index + 1}. ${item.name}${sku} x ${item.quantity} = ₹${itemSubtotal}`;
    });

    const message = [
      "Namaste DL Handlooms! I would like to place an order from your website:",
      "",
      ...lines,
      "",
      `Total Items: ${totalItems}`,
      `Grand Total: ₹${totalPrice.toLocaleString("en-IN")}`,
      "",
      "Please confirm availability and share payment/delivery details. Thank you!"
    ].join("\n");

    return `https://wa.me/919666228380?text=${encodeURIComponent(message)}`;
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#F7F3ED]">
      <Navbar />

      <div className="flex-grow pt-8 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          
          {/* Header */}
          <div className="mb-8 border-b border-[#222222]/10 pb-5">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#222222] tracking-tight mb-1">
              Shopping Cart
            </h1>
            <p className="text-sm font-sans text-[#222222]/70">
              {totalItems} {totalItems === 1 ? "item" : "items"} in your bag
            </p>
          </div>

          {items.length === 0 ? (
            /* Empty State */
            <div className="bg-white border border-[#222222]/10 rounded-sm p-10 sm:p-16 text-center max-w-xl mx-auto shadow-xs my-8">
              <div className="w-16 h-16 bg-[#7A211B]/10 text-[#7A211B] rounded-full flex items-center justify-center mx-auto mb-5">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#222222] mb-2">
                Your cart is empty.
              </h2>
              <p className="text-[#222222]/70 font-sans text-sm mb-7">
                Discover authentic Mangalagiri handlooms.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#7A211B] hover:bg-[#5E1914] text-[#F7F3ED] font-sans text-xs font-semibold tracking-[0.15em] uppercase px-7 py-3.5 rounded-sm transition-colors shadow-sm"
              >
                <span>SHOP SAREES</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            /* 2-Column Cart Grid (65% / 35%) */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              
              {/* Left Column: Cart Items (~65%) */}
              <div className="lg:col-span-8 space-y-4">
                
                {/* Clear All Row */}
                <div className="flex justify-end pb-1">
                  <button
                    onClick={clearCart}
                    className="text-xs font-sans text-[#222222]/50 hover:text-[#7A211B] transition-colors underline"
                  >
                    Clear Cart
                  </button>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {items.map((item: CartItem) => {
                    const maxStock = item.stock ?? 20;
                    const isMaxReached = item.quantity >= maxStock;
                    const isMinReached = item.quantity <= 1;
                    const productHref = `/product/${item.id}`;

                    return (
                      <div
                        key={item.id}
                        className="bg-white border border-[#222222]/10 rounded-sm p-3.5 sm:p-5 flex gap-3 sm:gap-6 items-start sm:items-center shadow-xs hover:border-[#222222]/20 transition-all"
                      >
                        {/* 1. Thumbnail Image */}
                        <Link
                          href={productHref}
                          className="relative w-20 sm:w-28 h-28 sm:h-36 flex-shrink-0 rounded-sm overflow-hidden bg-[#EFE9DF] border border-[#222222]/5 block"
                        >
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="(max-width: 640px) 80px, 120px"
                            className="w-full h-full object-cover object-center"
                          />
                        </Link>

                        {/* 2. Product Details & Controls */}
                        <div className="flex-grow min-w-0 flex flex-col justify-between self-stretch">
                          {/* Top row: Title & Trash Button */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <Link
                                href={productHref}
                                className="font-serif text-xs sm:text-base lg:text-lg font-bold text-[#222222] hover:text-[#7A211B] transition-colors line-clamp-2 block leading-snug"
                              >
                                {item.name}
                              </Link>
                              <p className="text-[10px] sm:text-xs font-sans text-[#7A211B] font-semibold tracking-wider uppercase mt-0.5">
                                Pure Handloom &bull; {item.sku || `DL-${item.id.slice(0, 4)}`}
                              </p>
                            </div>

                            {/* Delete Trash Button */}
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-[#222222]/40 hover:text-[#7A211B] transition-colors p-1.5 rounded-full hover:bg-[#7A211B]/5 flex-shrink-0 touch-target"
                              aria-label={`Remove ${item.name} from cart`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Bottom row: Price & Quantity Controls */}
                          <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-[#222222]/5 sm:border-0 sm:pt-0">
                            <div>
                              <span className="font-sans text-sm sm:text-lg font-bold text-[#222222]">
                                ₹{item.price.toLocaleString("en-IN")}
                              </span>
                              {item.quantity > 1 && (
                                <span className="block sm:inline sm:ml-2 text-[10px] sm:text-xs font-sans text-[#222222]/50">
                                  (₹{(item.price * item.quantity).toLocaleString("en-IN")} total)
                                </span>
                              )}
                            </div>

                            {/* Quantity Stepper ([-] qty [+]) */}
                            <div className="flex items-center border border-[#222222]/20 rounded-sm bg-white overflow-hidden shadow-2xs">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={isMinReached}
                                className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-colors ${
                                  isMinReached 
                                    ? "text-[#222222]/20 cursor-not-allowed" 
                                    : "text-[#222222]/70 hover:bg-[#F7F3ED] active:bg-[#F7F3ED] text-[#222222]"
                                }`}
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              
                              <span className="w-7 sm:w-8 text-center font-sans text-xs sm:text-sm font-semibold text-[#222222]">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={isMaxReached}
                                className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-colors ${
                                  isMaxReached 
                                    ? "text-[#222222]/20 cursor-not-allowed" 
                                    : "text-[#222222]/70 hover:bg-[#F7F3ED] active:bg-[#F7F3ED] text-[#222222]"
                                }`}
                                aria-label="Increase quantity"
                                title={isMaxReached ? "Max stock reached" : "Add more"}
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* Return to Shop Link */}
                <div className="pt-2">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-1.5 text-xs font-sans tracking-widest uppercase text-[#222222]/70 hover:text-[#7A211B] transition-colors font-semibold"
                  >
                    <span>&larr; Continue Shopping</span>
                  </Link>
                </div>

              </div>

              {/* Right Column: Order Summary (~35%) */}
              <div className="lg:col-span-4 lg:sticky lg:top-24">
                <div className="bg-white border border-[#222222]/10 rounded-sm p-6 sm:p-7 shadow-xs">
                  
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-[#222222] tracking-tight pb-3 border-b border-[#222222]/10 mb-4">
                    ORDER SUMMARY
                  </h2>

                  <div className="space-y-3 font-sans text-sm text-[#222222]/80 pb-4 border-b border-[#222222]/10">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-[#222222]">
                        ₹{totalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Shipping</span>
                      <span className="text-xs font-semibold text-[#1F7A4C] tracking-wide uppercase bg-[#1F7A4C]/10 px-2 py-0.5 rounded-xs">
                        FREE
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span className="font-medium text-[#222222]/50">₹0</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline py-4 border-b border-[#222222]/10 mb-5">
                    <span className="font-serif text-base font-bold text-[#222222]">TOTAL</span>
                    <span className="font-sans text-2xl font-bold text-[#7A211B]">
                      ₹{totalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Primary CTA: Proceed to Checkout */}
                  <button
                    onClick={() => router.push("/checkout")}
                    className="w-full bg-[#7A211B] hover:bg-[#5E1914] text-[#F7F3ED] font-sans text-xs sm:text-sm font-semibold tracking-[0.15em] uppercase py-4 px-6 rounded-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md mb-3"
                  >
                    <Lock className="w-4 h-4" />
                    <span>PROCEED TO CHECKOUT</span>
                  </button>

                  {/* Secondary CTA: WhatsApp Direct Loom Order */}
                  <a
                    href={generateWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#1F7A4C] hover:bg-[#18603B] text-white font-sans text-xs sm:text-sm font-semibold tracking-[0.15em] uppercase py-3.5 px-6 rounded-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md text-center"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>ORDER VIA WHATSAPP</span>
                  </a>

                  {/* Compact Trust Information */}
                  <div className="pt-6 mt-6 border-t border-[#222222]/10 space-y-2.5 text-xs font-sans text-[#222222]/70">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-[#B79555] flex-shrink-0" />
                      <span>100% Authentic Mangalagiri Handloom</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Truck className="w-4 h-4 text-[#B79555] flex-shrink-0" />
                      <span>Direct from Weavers &bull; Free Insured Delivery</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-[#B79555] flex-shrink-0" />
                      <span>Traditional Handwoven Quality Assurance</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      <Footer />
    </main>
  );
}
