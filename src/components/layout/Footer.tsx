"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowUp, MapPin, Phone } from "lucide-react";
import BrandLogo from "@/components/ui/UshaLogo";

export default function Footer() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className="bg-[#0B281B] text-white pt-10 pb-24 sm:pb-12 border-t border-white/10 relative">
        <div className="container mx-auto px-5 max-w-lg sm:max-w-4xl">
          
          {/* Logo */}
          <div className="mb-4">
            <BrandLogo variant="light" size="lg" />
          </div>

          {/* Tagline / Bio */}
          <p className="text-white/85 text-xs sm:text-sm font-sans leading-relaxed mb-6 font-normal">
            Welcome to <strong className="font-semibold text-white">Dhana Lakshmi Handlooms (DL Handlooms)</strong> — where generations of master handloom weaving meet pure Mangalagiri craftsmanship. Every warp and weft is crafted with authentic heritage, grace, and natural comfort.
          </p>

          {/* Store Location Notice */}
          <div className="mb-6 p-3 bg-white/5 rounded-xs border border-white/10 flex items-start gap-2.5 text-xs text-white/90">
            <MapPin className="w-4 h-4 text-[#C4E2D3] flex-shrink-0 mt-0.5" />
            <span>
              Opp:CPI flag center, straight road, opposite chaitanya handlooms, Bhadravathi Nagar, Mangalagiri, Andhra Pradesh 522503
            </span>
          </div>

          {/* Accordion Links */}
          <div className="border-t border-white/10 divide-y divide-white/10 mb-8">
            
            {/* Quick link */}
            <div>
              <button
                onClick={() => toggleSection("quick")}
                className="w-full py-4 flex items-center justify-between text-sm font-sans font-semibold tracking-wide text-white"
              >
                <span>Quick link</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-250 ${
                    openSections["quick"] ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSections["quick"] && (
                <ul className="pb-4 space-y-2.5 text-xs text-white/80 font-sans pl-1">
                  <li><Link href="/shop" className="hover:text-white">All Sarees</Link></li>
                  <li><Link href="/category/pattu" className="hover:text-white">Mangalagiri Pattu</Link></li>
                  <li><Link href="/category/cotton" className="hover:text-white">Pure Cotton Sarees</Link></li>
                  <li><Link href="/category/dress-materials" className="hover:text-white">Dress Materials</Link></li>
                  <li><Link href="/shop?filter=best-sellers" className="hover:text-white">Best Sellers</Link></li>
                  <li><Link href="/shop?filter=new-arrivals" className="hover:text-white">New Arrivals</Link></li>
                </ul>
              )}
            </div>

            {/* Help */}
            <div>
              <button
                onClick={() => toggleSection("help")}
                className="w-full py-4 flex items-center justify-between text-sm font-sans font-semibold tracking-wide text-white"
              >
                <span>Help</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-250 ${
                    openSections["help"] ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSections["help"] && (
                <ul className="pb-4 space-y-2.5 text-xs text-white/80 font-sans pl-1">
                  <li><Link href="/contact" className="hover:text-white">Contact Us &amp; Store Location</Link></li>
                  <li><Link href="/account" className="hover:text-white">My Account</Link></li>
                  <li><Link href="/track-order" className="hover:text-white">Track Order</Link></li>
                  <li><Link href="/shipping" className="hover:text-white">Loom Direct Shipping</Link></li>
                  <li><Link href="/returns" className="hover:text-white">Returns &amp; Exchange</Link></li>
                </ul>
              )}
            </div>

            {/* Discover */}
            <div>
              <button
                onClick={() => toggleSection("discover")}
                className="w-full py-4 flex items-center justify-between text-sm font-sans font-semibold tracking-wide text-white"
              >
                <span>Discover</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-250 ${
                    openSections["discover"] ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSections["discover"] && (
                <ul className="pb-4 space-y-2.5 text-xs text-white/80 font-sans pl-1">
                  <li><Link href="/about" className="hover:text-white">Our Weaving Heritage</Link></li>
                  <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                </ul>
              )}
            </div>

          </div>

          {/* Copyright & Credit */}
          <div className="pt-2 flex flex-col gap-1 text-xs text-white/80 font-sans">
            <p className="font-semibold text-white">
              Copyright © DL Handlooms (Dhana Lakshmi Handlooms) | 2026
            </p>
            <p className="text-white/70">
              Opp:CPI flag center, Bhadravathi Nagar, Mangalagiri, AP 522503
            </p>
          </div>

        </div>
      </footer>

      {/* Floating Scroll-To-Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed right-4 bottom-18 sm:bottom-6 z-30 w-11 h-11 rounded-full bg-[#0B281B] border border-white/20 text-white flex items-center justify-center shadow-lg hover:bg-[#163C2A] transition-all active:scale-95"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5 stroke-[2.4]" />
      </button>
    </>
  );
}
