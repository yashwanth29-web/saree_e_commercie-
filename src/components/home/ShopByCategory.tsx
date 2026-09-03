import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "MANGALAGIRI PATTU",
    href: "/category/pattu",
    image: "/sarees/cat-pattu.jpg",
  },
  {
    title: "COTTON SAREES",
    href: "/category/cotton",
    image: "/sarees/cat-cotton.jpg",
  },
  {
    title: "DRESS MATERIALS",
    href: "/category/dress-materials",
    image: "/sarees/cat-dress.jpg",
  },
  {
    title: "NEW ARRIVALS",
    href: "/new-arrivals",
    image: "/sarees/cat-arrivals.jpg",
  }
];

export default function ShopByCategory() {
  return (
    <section className="py-16 sm:py-20 bg-[#F7F3ED] border-t border-[#222222]/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
          <div>
            <span className="text-xs font-sans tracking-[0.2em] uppercase text-[#7A211B] font-semibold block mb-2">
              Curated Weaves
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#222222] font-bold tracking-tight">
              SHOP BY CATEGORY
            </h2>
            <p className="font-sans text-[#222222]/70 text-sm max-w-xl mt-2">
              Explore our authentic collections, crafted directly by the weavers of Mangalagiri.
            </p>
          </div>
          <Link 
            href="/shop" 
            className="hidden sm:inline-flex items-center gap-2 text-[#7A211B] hover:text-[#5E1914] font-sans text-xs font-semibold tracking-widest uppercase transition-colors"
          >
            <span>View All Sarees</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link 
              key={index} 
              href={category.href}
              className="group block relative aspect-[3/4] overflow-hidden rounded-sm bg-[#EFE9DF] shadow-xs border border-[#222222]/10"
            >
              <Image
                src={category.image}
                alt={category.title}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
              
              <div className="absolute bottom-0 left-0 right-0 p-5 flex items-center justify-between">
                <h3 className="font-sans text-white text-sm sm:text-base tracking-wider font-semibold uppercase">
                  {category.title}
                </h3>
                <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 sm:hidden flex justify-center">
          <Link 
            href="/shop" 
            className="inline-flex items-center gap-2 text-[#7A211B] font-sans text-xs font-semibold tracking-widest uppercase"
          >
            <span>View All Sarees</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
