import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function UshaFeaturedBanner() {
  return (
    <section className="relative bg-[#0B281B] text-white py-12 px-4 overflow-hidden">
      <div className="max-w-md sm:max-w-xl mx-auto relative min-h-[460px] flex flex-col items-center justify-center text-center">
        
        {/* Floating Top Left Photo */}
        <div className="absolute top-2 left-2 w-20 h-28 sm:w-28 sm:h-36 rounded-sm overflow-hidden shadow-lg border border-white/20">
          <Image
            src="/sarees/cat-arrivals.jpg"
            alt="Saree Collection"
            fill
            sizes="110px"
            className="object-cover"
          />
        </div>

        {/* Floating Top Right Photo */}
        <div className="absolute top-6 right-2 w-22 h-30 sm:w-30 sm:h-40 rounded-sm overflow-hidden shadow-lg border border-white/20">
          <Image
            src="/sarees/cat-cotton.jpg"
            alt="Dress Collection"
            fill
            sizes="120px"
            className="object-cover"
          />
        </div>

        {/* Center Typography */}
        <div className="flex flex-col items-center gap-3 z-10 my-16">
          <Link
            href="/category/pattu"
            className="flex items-center gap-3 font-sans font-black text-2xl sm:text-4xl tracking-wider text-white hover:text-[#C4E2D3] transition-colors group"
          >
            <span>MANGALAGIRI PATTU</span>
            <div className="w-9 h-9 rounded-full border border-white/60 flex items-center justify-center group-hover:border-white group-hover:bg-white group-hover:text-[#0B281B] transition-all">
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </Link>

          <Link
            href="/category/cotton"
            className="font-sans font-black text-2xl sm:text-4xl tracking-wider text-white/80 hover:text-white transition-colors"
          >
            PURE COTTON
          </Link>

          <Link
            href="/category/dress-materials"
            className="font-sans font-black text-2xl sm:text-4xl tracking-wider text-white/80 hover:text-white transition-colors"
          >
            DRESS MATERIALS
          </Link>
        </div>

        {/* Floating Bottom Center Photo */}
        <div className="relative w-36 h-48 sm:w-44 sm:h-56 rounded-sm overflow-hidden shadow-2xl border-2 border-white/30 z-10">
          <Image
            src="/sarees/cat-dress.jpg"
            alt="Featured Collection"
            fill
            sizes="170px"
            className="object-cover"
          />
        </div>

      </div>
    </section>
  );
}
