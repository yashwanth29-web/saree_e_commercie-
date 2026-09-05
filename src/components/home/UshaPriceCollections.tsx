import Link from "next/link";
import Image from "next/image";

interface PriceRange {
  label: string;
  query: string;
  image: string;
}

export default function UshaPriceCollections() {
  const priceBrackets: PriceRange[] = [
    {
      label: "Under ₹999",
      query: "maxPrice=999",
      image: "/sarees/cat-arrivals.jpg",
    },
    {
      label: "₹1,000 – ₹2,999",
      query: "minPrice=1000&maxPrice=2999",
      image: "/sarees/cat-pattu.jpg",
    },
    {
      label: "₹3,000+",
      query: "minPrice=3000",
      image: "/sarees/cat-dress.jpg",
    },
  ];

  return (
    <section className="py-8 px-4 bg-[#FAFAF8] border-t border-[#0B281B]/5">
      <div className="max-w-md sm:max-w-4xl mx-auto">
        {/* Title */}
        <h2 className="font-serif text-2xl sm:text-3xl text-center font-bold text-[#0B281B] mb-6">
          Price by Collections
        </h2>

        {/* Horizontal scroll on mobile / flex layout */}
        <div className="flex gap-3 sm:gap-5 overflow-x-auto pb-4 no-scrollbar justify-start sm:justify-center">
          {priceBrackets.map((bracket) => (
            <Link
              key={bracket.label}
              href={`/shop?${bracket.query}`}
              className="relative w-44 sm:w-56 flex-shrink-0 bg-gradient-to-b from-[#87BFA8] via-[#B2DEC8] to-[#E3F5EC] rounded-xl p-3 flex flex-col items-center shadow-xs hover:shadow-md transition-all group overflow-hidden border border-[#0B281B]/10"
            >
              {/* Decorative side dots/sparkles */}
              <div className="absolute left-2 top-10 flex flex-col gap-1 opacity-50 text-[#0B281B] text-[8px]">
                <span>•</span><span>•</span><span>•</span><span>•</span>
              </div>
              <div className="absolute right-2 top-10 flex flex-col gap-1 opacity-50 text-[#0B281B] text-[8px]">
                <span>•</span><span>•</span><span>•</span><span>•</span>
              </div>

              {/* Price Label */}
              <div className="font-serif font-bold text-sm sm:text-base text-[#0B281B] text-center mb-3">
                {bracket.label}
              </div>

              {/* Arched Photo Frame */}
              <div className="relative w-32 h-44 sm:w-40 sm:h-52 rounded-t-full overflow-hidden border-2 border-white/60 shadow-inner bg-white/30">
                <Image
                  src={bracket.image}
                  alt={bracket.label}
                  fill
                  sizes="160px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
