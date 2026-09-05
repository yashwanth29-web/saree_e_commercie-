"use client";

import Link from "next/link";
import { Search, ShoppingBag, Menu, X, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import UshaLogo from "@/components/ui/UshaLogo";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const setCartDrawerOpen = useCartStore((state) => state.setIsOpen);

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

  // Keyboard Escape to close mobile menu & search
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
      {/* Top Header - Forest Green */}
      <header className="sticky top-0 z-40 bg-[#0B281B] text-white border-b border-white/10 transition-all duration-200">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 lg:h-18 flex items-center justify-between gap-4">
          
          {/* Mobile Hamburger Menu Toggle (Left) */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6 stroke-[2]" />
          </button>

          {/* Centered Usha Designers Logo */}
          <div className="flex-1 flex justify-center">
            <UshaLogo variant="light" size="md" />
          </div>

          {/* Action Icons (Right): Search & Cart */}
          <div className="flex items-center gap-1 sm:gap-2 text-white">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors"
              aria-label="Search products"
            >
              <Search className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors relative"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[2]" />
              {mounted && totalCartItems > 0 && (
                <span className="absolute top-1 right-1 bg-white text-[#0B281B] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {totalCartItems}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="border-t border-white/15 bg-[#061910] px-4 py-3 transition-all">
            <div className="container mx-auto max-w-2xl flex items-center gap-3">
              <Search className="w-4 h-4 text-white/60 flex-shrink-0" />
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
                  placeholder="Search sarees, dresses, jewellery..."
                  className="w-full bg-transparent border-none text-sm font-sans text-white focus:outline-hidden placeholder-white/50"
                  autoFocus
                />
              </form>
              <button
                onClick={() => setSearchOpen(false)}
                className="text-xs font-sans uppercase tracking-widest text-white/60 hover:text-white"
                aria-label="Close search"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Side Navbar / Mobile Drawer (Strictly: Home, Shop, Account, Help, Logout) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content - Forest Green */}
          <div className="relative mr-auto w-[82%] max-w-xs sm:max-w-sm bg-[#0B281B] text-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto animate-in slide-in-from-left duration-250">
            
            {/* Drawer Top Bar */}
            <div className="p-4 flex items-center justify-between border-b border-white/10">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full text-white/80 hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 stroke-[2.2]" />
              </button>
              
              <UshaLogo variant="light" size="sm" />

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSearchOpen(true);
                  }}
                  className="p-2 text-white/80 hover:text-white"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCartDrawerOpen(true);
                  }}
                  className="p-2 text-white/80 hover:text-white"
                  aria-label="Cart"
                >
                  <ShoppingBag className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation Links: Strictly Home, Shop, Account, Help */}
            <div className="p-6 flex flex-col gap-6 text-base font-sans font-medium">
              <Link
                href="/"
                prefetch={true}
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#C4E2D3] transition-colors py-1 active:translate-x-1 duration-100"
              >
                Home
              </Link>
              <Link
                href="/shop"
                prefetch={true}
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#C4E2D3] transition-colors py-1 active:translate-x-1 duration-100"
              >
                Shop
              </Link>
              <Link
                href="/account"
                prefetch={true}
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#C4E2D3] transition-colors py-1 active:translate-x-1 duration-100"
              >
                Account
              </Link>
              <Link
                href="/contact"
                prefetch={true}
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#C4E2D3] transition-colors py-1 active:translate-x-1 duration-100"
              >
                Help
              </Link>
            </div>

            {/* Bottom Section: My Account & Log Out button */}
            <div className="mt-auto p-6 border-t border-white/10 space-y-4">
              <div className="text-lg font-serif font-bold text-white">
                My Account
              </div>

              <div className="flex items-center gap-2 text-white/90">
                <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.location.href = "/account";
                }}
                className="w-full py-2.5 border border-white/60 hover:border-white text-white text-sm font-sans font-semibold rounded-xs transition-colors text-center"
              >
                Log Out
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
