"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Heart, ShoppingBag, User, Menu, X, Phone, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const totalWishlistItems = useWishlistStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Keyboard Escape to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#F7F3ED]/95 backdrop-blur-md border-b border-[#222222]/10 transition-all duration-200">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 lg:h-20 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0 group py-1 pr-1 sm:pr-4">
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 overflow-hidden rounded-sm transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/logo.jpg"
                alt="DL Handlooms"
                fill
                sizes="44px"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-sm sm:text-base lg:text-lg font-bold tracking-wider text-[#7A211B] leading-tight">
                DL HANDLOOMS
              </span>
              <span className="text-[8px] sm:text-[9px] font-sans tracking-[0.2em] text-[#222222]/60 uppercase">
                Mangalagiri &bull; Pure Weave
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links - Centered with Breathing Room */}
          <nav className="hidden lg:flex items-center justify-center gap-5 xl:gap-7 font-sans text-xs tracking-[0.14em] font-semibold text-[#222222]/85 whitespace-nowrap">
            <Link href="/" className="hover:text-[#7A211B] transition-colors py-2 px-1">
              HOME
            </Link>
            <Link href="/shop" className="hover:text-[#7A211B] transition-colors py-2 px-1">
              SHOP ALL
            </Link>
            <Link href="/category/pattu" className="hover:text-[#7A211B] transition-colors py-2 px-1">
              MANGALAGIRI PATTU
            </Link>
            <Link href="/category/cotton" className="hover:text-[#7A211B] transition-colors py-2 px-1">
              COTTON SAREES
            </Link>
            <Link href="/category/dress-materials" className="hover:text-[#7A211B] transition-colors py-2 px-1">
              DRESS MATERIALS
            </Link>
            <Link href="/about" className="hover:text-[#7A211B] transition-colors py-2 px-1">
              ABOUT
            </Link>
          </nav>

          {/* Action Icons (44px min touch target on mobile) */}
          <div className="flex items-center gap-0.5 sm:gap-2 text-[#222222]">
            
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full hover:bg-[#222222]/5 text-[#222222] hover:text-[#7A211B] transition-colors relative"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account (Desktop/Tablet) */}
            <Link
              href="/account"
              className="hidden md:flex w-10 h-10 sm:w-11 sm:h-11 items-center justify-center rounded-full hover:bg-[#222222]/5 text-[#222222] hover:text-[#7A211B] transition-colors"
              aria-label="My Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full hover:bg-[#222222]/5 text-[#222222] hover:text-[#7A211B] transition-colors relative"
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {mounted && totalWishlistItems > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-[#7A211B] text-[#F7F3ED] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {totalWishlistItems}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full hover:bg-[#222222]/5 text-[#222222] hover:text-[#7A211B] transition-colors relative"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {mounted && totalCartItems > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-[#7A211B] text-[#F7F3ED] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {totalCartItems}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full hover:bg-[#222222]/5 text-[#222222] hover:text-[#7A211B] transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

          </div>

        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="border-t border-[#222222]/10 bg-[#F7F3ED] px-6 py-3 transition-all">
            <div className="container mx-auto max-w-2xl flex items-center gap-3">
              <Search className="w-4 h-4 text-[#222222]/50 flex-shrink-0" />
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
                className="flex-grow flex items-center"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pure pattu sarees, cotton, dress materials..."
                  className="w-full bg-transparent border-none text-sm font-sans text-[#222222] focus:outline-none placeholder-[#222222]/40"
                  autoFocus
                />
              </form>
              <button
                onClick={() => setSearchOpen(false)}
                className="text-xs font-sans uppercase tracking-widest text-[#222222]/50 hover:text-[#7A211B]"
                aria-label="Close search"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-[#F7F3ED] h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            
            {/* Drawer Header */}
            <div className="p-5 flex items-center justify-between border-b border-[#222222]/10">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 rounded-sm overflow-hidden">
                  <Image
                    src="/logo.jpg"
                    alt="DL Handlooms"
                    fill
                    sizes="32px"
                    className="object-contain"
                  />
                </div>
                <span className="font-serif text-sm font-bold text-[#7A211B] tracking-wider">
                  DL HANDLOOMS
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-[#222222]/60 hover:text-[#7A211B]"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="p-6 flex flex-col gap-4 font-sans text-xs tracking-[0.2em] font-semibold text-[#222222]/85 divide-y divide-[#222222]/5">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="pt-2 hover:text-[#7A211B] flex items-center justify-between"
              >
                <span>HOME</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#222222]/30" />
              </Link>
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="pt-4 hover:text-[#7A211B] flex items-center justify-between"
              >
                <span>SHOP ALL SAREES</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#222222]/30" />
              </Link>
              <Link
                href="/category/pattu"
                onClick={() => setMobileMenuOpen(false)}
                className="pt-4 hover:text-[#7A211B] flex items-center justify-between"
              >
                <span>MANGALAGIRI PATTU</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#222222]/30" />
              </Link>
              <Link
                href="/category/cotton"
                onClick={() => setMobileMenuOpen(false)}
                className="pt-4 hover:text-[#7A211B] flex items-center justify-between"
              >
                <span>COTTON SAREES</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#222222]/30" />
              </Link>
              <Link
                href="/category/dress-materials"
                onClick={() => setMobileMenuOpen(false)}
                className="pt-4 hover:text-[#7A211B] flex items-center justify-between"
              >
                <span>DRESS MATERIALS</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#222222]/30" />
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="pt-4 hover:text-[#7A211B] flex items-center justify-between"
              >
                <span>OUR WEAVING STORY</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#222222]/30" />
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="p-6 mt-auto bg-[#EFE9DF]/50 border-t border-[#222222]/10 space-y-3">
              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 bg-[#7A211B] text-[#F7F3ED] flex items-center justify-center gap-2 text-xs font-sans tracking-widest uppercase font-semibold rounded-sm shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>View Cart ({mounted ? totalCartItems : 0})</span>
              </Link>
              
              <a
                href="https://wa.me/919666228380?text=Namaste%20DL%20Handlooms,%20I%20have%20an%20inquiry%20about%20your%20sarees"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 border border-[#1F7A4C]/30 text-[#1F7A4C] hover:bg-[#1F7A4C]/10 flex items-center justify-center gap-2 text-xs font-sans tracking-widest uppercase font-semibold rounded-sm transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Loom WhatsApp Help</span>
              </a>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
