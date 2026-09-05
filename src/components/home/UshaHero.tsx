import Link from "next/link";
import Image from "next/image";

interface HeroProps {
  bannerImages?: string[];
}

export default function UshaHero({ bannerImages }: HeroProps) {
  const images = bannerImages && bannerImages.length >= 3 
    ? bannerImages 
    : [
        "/products/kalamkari-peacock-lotus.jpg",
        "/products/mangalagiri-pattu-sky-blue.jpg",
        "/products/mangalagiri-cotton-maroon-ikkat.jpg"
      ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#598473] via-[#81AB9C] to-[#CCE7DC] pt-6 pb-12 px-4 sm:px-6">
      <div className="max-w-md sm:max-w-xl mx-auto flex flex-col items-center text-center">
        
        {/* 3 Angled Photo Panels */}
        <div className="flex items-center justify-center gap-2 sm:gap-3.5 mb-6 w-full max-w-sm">
          {/* Left Panel */}
          <div className="relative w-28 h-40 sm:w-34 sm:h-48 rounded-xl overflow-hidden shadow-lg transform -rotate-3 border-2 border-white/40">
            <Image
              src={images[0]}
              alt="Mangalagiri Pattu Saree"
              fill
              sizes="140px"
              className="object-cover"
              priority
            />
          </div>

          {/* Middle Panel */}
          <div className="relative w-32 h-44 sm:w-38 sm:h-52 rounded-xl overflow-hidden shadow-2xl z-10 border-2 border-white/50">
            <Image
              src={images[1]}
              alt="DL Handlooms Authentic Weaves"
              fill
              sizes="160px"
              className="object-cover"
              priority
            />
          </div>

          {/* Right Panel */}
          <div className="relative w-28 h-40 sm:w-34 sm:h-48 rounded-xl overflow-hidden shadow-lg transform rotate-3 border-2 border-white/40">
            <Image
              src={images[2]}
              alt="Handloom Dress Material"
              fill
              sizes="140px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Heading & Subtitle for DL Handlooms */}
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0B281B] mb-2 drop-shadow-xs">
          DL HANDLOOMS
        </h1>

        <p className="font-sans text-xs sm:text-sm font-medium text-[#0B281B]/85 max-w-xs sm:max-w-sm leading-relaxed mb-5">
          Pure Mangalagiri Handlooms, Direct from Master Weavers.<br />
          Authentic Pattu, Cotton Sarees &amp; Dress Materials.
        </p>

        {/* SHOP NOW Button */}
        <Link
          href="/shop"
          className="inline-flex items-center justify-center px-8 py-2.5 rounded-full bg-[#0B281B] hover:bg-[#071F14] text-white text-xs sm:text-sm font-sans font-bold tracking-wider uppercase transition-all shadow-md active:scale-95"
        >
          SHOP NOW
        </Link>

      </div>
    </section>
  );
}
