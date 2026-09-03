"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-[#F7F3ED] py-8 sm:py-12 lg:py-16 overflow-hidden border-b border-[#222222]/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
          
          {/* Content Column (7 cols on desktop) */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Small Brand Label */}
            <div className="inline-flex items-center gap-2 bg-[#7A211B]/10 text-[#7A211B] px-3 py-1 rounded-full mb-3 sm:mb-4 text-[10px] sm:text-xs font-sans tracking-[0.2em] uppercase font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>DL Handlooms &bull; Mangalagiri</span>
            </div>
            
            {/* Responsive Fluid Heading */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl text-[#222222] font-bold mb-3 sm:mb-4 tracking-tight leading-[1.15]">
              MANGALAGIRI <br className="hidden sm:inline" />
              <span className="text-[#7A211B] italic font-medium">HANDLOOMS.</span>
            </h1>

            {/* Short Description */}
            <p className="text-[#222222]/75 font-sans text-xs sm:text-sm md:text-base max-w-lg mb-5 sm:mb-7 leading-relaxed">
              Pure handloom sarees woven directly by master weavers with authentic Nizam zari borders. Directly from the loom to your wardrobe.
            </p>

            {/* Primary Action Button */}
            <div className="flex flex-row gap-3 items-center w-full sm:w-auto mb-6 lg:mb-8">
              <Link 
                href="/shop" 
                className="flex-1 sm:flex-initial px-6 sm:px-7 py-3.5 bg-[#7A211B] text-[#F7F3ED] font-sans font-semibold tracking-[0.15em] text-xs uppercase hover:bg-[#5E1914] transition-all rounded-sm text-center shadow-xs flex items-center justify-center gap-2 touch-target"
              >
                <span>SHOP SAREES</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link 
                href="/category/pattu" 
                className="flex-1 sm:flex-initial px-5 sm:px-7 py-3.5 border border-[#7A211B]/40 text-[#7A211B] hover:bg-[#7A211B]/10 font-sans font-semibold tracking-[0.15em] text-xs uppercase transition-all rounded-sm text-center touch-target"
              >
                PATTU
              </Link>
            </div>

            {/* Trust Badges - Hidden on small mobile to keep image above fold, visible on sm+ */}
            <div className="hidden sm:flex items-center gap-3 sm:gap-4 text-[#222222]/60 text-[10px] sm:text-[11px] font-sans tracking-widest uppercase flex-wrap pt-4 border-t border-[#222222]/10 w-full">
              <span className="font-semibold text-[#7A211B]">Pure Handloom</span>
              <span className="w-1 h-1 rounded-full bg-[#B79555]" />
              <span>Direct from Weavers</span>
              <span className="w-1 h-1 rounded-full bg-[#B79555]" />
              <span>GI Tag Certified</span>
            </div>
          </motion.div>

          {/* Saree Image Column (Prominently visible on mobile & desktop) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="lg:col-span-5 flex justify-center lg:justify-end w-full"
          >
            <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md aspect-[3/4] rounded-sm overflow-hidden shadow-md border border-[#222222]/10 bg-[#EFE9DF]">
              <Image 
                src="/hero_saree.jpg"
                alt="Authentic Mangalagiri Saree by DL Handlooms"
                fill
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 420px"
                className="object-cover object-center"
                priority
              />
              
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 pointer-events-none" />

              {/* Anchored Craft Badge */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:right-auto bg-white/95 backdrop-blur-xs p-2.5 sm:p-3 rounded-xs shadow-sm border border-[#222222]/10 flex items-center gap-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#7A211B]/10 rounded-full flex items-center justify-center text-[#7A211B] flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-sans text-[8px] sm:text-[9px] text-[#222222]/60 tracking-widest uppercase font-semibold">Featured</p>
                  <p className="font-serif text-xs font-bold text-[#222222]">Pure Nizam Zari Border</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mobile Trust Badges (Placed below image on small mobile) */}
          <div className="sm:hidden flex items-center justify-center gap-2 text-[#222222]/60 text-[9px] font-sans tracking-wider uppercase flex-wrap pt-3 border-t border-[#222222]/10 w-full text-center">
            <span className="font-semibold text-[#7A211B]">Pure Handloom</span>
            <span className="w-1 h-1 rounded-full bg-[#B79555]" />
            <span>Direct from Weavers</span>
            <span className="w-1 h-1 rounded-full bg-[#B79555]" />
            <span>GI Certified</span>
          </div>

        </div>
      </div>
    </section>
  );
}
