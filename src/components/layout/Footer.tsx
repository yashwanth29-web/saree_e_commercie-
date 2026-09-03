"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="bg-[#1A1A1A] text-[#F7F3ED] pt-12 sm:pt-16 pb-8 relative overflow-hidden border-t border-[#B79555]/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        
        {/* Brand Info Banner */}
        <div className="mb-8 pb-8 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-[#B79555]">
              DL HANDLOOMS
            </h2>
            <p className="font-sans text-white/70 text-xs sm:text-sm mt-1 max-w-md">
              Authentic Mangalagiri Handloom Sarees &amp; Dress Materials directly from master weavers.
            </p>
          </div>

          <div className="flex gap-4 items-center">
            <a 
              href="https://instagram.com/dlhandlooms.mangalagiri" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#7A211B] text-white/80 hover:text-white flex items-center justify-center transition-colors touch-target"
              aria-label="Follow us on Instagram"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a 
              href="tel:9666228380" 
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#1F7A4C] text-white/80 hover:text-white flex items-center justify-center transition-colors touch-target"
              aria-label="Call weaver direct"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Desktop 4-Column Layout (md+) */}
        <div className="hidden md:grid md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: About */}
          <div>
            <h3 className="font-sans text-xs font-bold tracking-[0.2em] mb-4 uppercase text-[#B79555]">
              Heritage
            </h3>
            <p className="font-sans text-xs text-white/70 leading-relaxed">
              Based in Mangalagiri, Andhra Pradesh. Every warp and weft represents centuries of traditional Nizam handloom craftsmanship.
            </p>
          </div>

          {/* Col 2: Shop */}
          <div>
            <h3 className="font-sans text-xs font-bold tracking-[0.2em] mb-4 uppercase text-[#B79555]">
              Shop Collections
            </h3>
            <ul className="space-y-2.5 font-sans text-xs text-white/70">
              <li><Link href="/shop" className="hover:text-white transition-colors">All Handlooms</Link></li>
              <li><Link href="/category/pattu" className="hover:text-white transition-colors">Mangalagiri Pattu</Link></li>
              <li><Link href="/category/cotton" className="hover:text-white transition-colors">Cotton Sarees</Link></li>
              <li><Link href="/category/dress-materials" className="hover:text-white transition-colors">Dress Materials</Link></li>
              <li><Link href="/new-arrivals" className="hover:text-white transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Col 3: Support */}
          <div>
            <h3 className="font-sans text-xs font-bold tracking-[0.2em] mb-4 uppercase text-[#B79555]">
              Customer Support
            </h3>
            <ul className="space-y-2.5 font-sans text-xs text-white/70">
              <li><Link href="/about" className="hover:text-white transition-colors">About Our Looms</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Loom Direct Shipping</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">Returns &amp; Exchange</Link></li>
              <li><Link href="/wishlist" className="hover:text-white transition-colors">Saved Wishlist</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h3 className="font-sans text-xs font-bold tracking-[0.2em] mb-4 uppercase text-[#B79555]">
              Direct Loom Contact
            </h3>
            <div className="space-y-2 font-sans text-xs text-white/70">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#B79555] flex-shrink-0 mt-0.5" />
                <span>Mangalagiri, Guntur District, Andhra Pradesh, 522503</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#B79555] flex-shrink-0" />
                <a href="tel:9666228380" className="hover:text-white transition-colors">+91 96662 28380</a>
              </p>
              <p className="text-[11px] text-white/50 pt-1">Mon - Sun: 9:00 AM - 9:00 PM IST</p>
            </div>
          </div>
        </div>

        {/* Mobile Accordion Layout (< md) */}
        <div className="md:hidden space-y-1 mb-8 divide-y divide-white/10">
          
          {/* Accordion 1: SHOP */}
          <div>
            <button
              onClick={() => toggleSection("shop")}
              className="w-full py-3.5 flex items-center justify-between text-left font-sans text-xs font-bold tracking-[0.15em] uppercase text-[#B79555] touch-target"
            >
              <span>Shop Collections</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${openSection === "shop" ? "rotate-180" : ""}`} />
            </button>
            {openSection === "shop" && (
              <ul className="pb-4 space-y-3 font-sans text-xs text-white/70 pl-2">
                <li><Link href="/shop" className="hover:text-white block py-1">All Handlooms</Link></li>
                <li><Link href="/category/pattu" className="hover:text-white block py-1">Mangalagiri Pattu</Link></li>
                <li><Link href="/category/cotton" className="hover:text-white block py-1">Cotton Sarees</Link></li>
                <li><Link href="/category/dress-materials" className="hover:text-white block py-1">Dress Materials</Link></li>
                <li><Link href="/new-arrivals" className="hover:text-white block py-1">New Arrivals</Link></li>
              </ul>
            )}
          </div>

          {/* Accordion 2: CUSTOMER SUPPORT */}
          <div>
            <button
              onClick={() => toggleSection("support")}
              className="w-full py-3.5 flex items-center justify-between text-left font-sans text-xs font-bold tracking-[0.15em] uppercase text-[#B79555] touch-target"
            >
              <span>Customer Support</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${openSection === "support" ? "rotate-180" : ""}`} />
            </button>
            {openSection === "support" && (
              <ul className="pb-4 space-y-3 font-sans text-xs text-white/70 pl-2">
                <li><Link href="/about" className="hover:text-white block py-1">About Our Looms</Link></li>
                <li><Link href="/contact" className="hover:text-white block py-1">Contact Us</Link></li>
                <li><Link href="/shipping" className="hover:text-white block py-1">Shipping &amp; Delivery</Link></li>
                <li><Link href="/returns" className="hover:text-white block py-1">Returns &amp; Exchange</Link></li>
                <li><Link href="/wishlist" className="hover:text-white block py-1">My Wishlist</Link></li>
              </ul>
            )}
          </div>

          {/* Accordion 3: CONTACT */}
          <div>
            <button
              onClick={() => toggleSection("contact")}
              className="w-full py-3.5 flex items-center justify-between text-left font-sans text-xs font-bold tracking-[0.15em] uppercase text-[#B79555] touch-target"
            >
              <span>Loom Contact</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${openSection === "contact" ? "rotate-180" : ""}`} />
            </button>
            {openSection === "contact" && (
              <div className="pb-4 space-y-2.5 font-sans text-xs text-white/70 pl-2">
                <p className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#B79555] flex-shrink-0 mt-0.5" />
                  <span>Mangalagiri, Guntur District, AP</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#B79555] flex-shrink-0" />
                  <a href="tel:9666228380" className="hover:text-white py-1 block">+91 96662 28380</a>
                </p>
                <p className="text-[10px] text-white/50">Direct Master Weaver Support</p>
              </div>
            )}
          </div>

        </div>

        {/* Copyright & Legal */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-[11px] font-sans text-white/50 gap-3">
          <p>&copy; {new Date().getFullYear()} DL Handlooms. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
