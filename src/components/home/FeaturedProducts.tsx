import Link from "next/link";
import prisma from "@/lib/prisma";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { MessageCircle } from "lucide-react";

export default async function FeaturedProducts() {
  // Query real featured products from the database
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      where: { active: true },
      include: {
        images: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    });
  } catch (err) {
    console.error("FeaturedProducts query error:", err);
  }

  return (
    <section className="py-16 sm:py-24 bg-ivory">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-xs font-sans tracking-[0.25em] uppercase text-[#7A211B] font-semibold block mb-2">
            DL Handlooms &bull; Weavers Collection
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-[#222222] font-bold mb-3 tracking-tight">
            NEW FROM THE LOOM
          </h2>
          <div className="w-16 h-[2px] bg-gold mx-auto mb-4" />
          <p className="font-sans text-[#222222]/70 text-sm md:text-base max-w-xl mx-auto">
            Our latest pure Mangalagiri handloom creations, woven with generations of authentic heritage.
          </p>
        </div>

        {/* Product Cards Grid - 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((product) => {
            const primaryImage = product.images?.[0]?.url || "/sarees/cat-pattu.jpg";
            const productHref = `/product/${product.slug || product.id}`;
            const whatsappMsg = encodeURIComponent(
              `Namaste DL Handlooms! I am interested in: ${product.name} (Price: ₹${product.price.toLocaleString("en-IN")}, SKU: ${product.sku || "N/A"}). Please confirm availability.`
            );

            return (
              <div 
                key={product.id} 
                className="group flex flex-col bg-white border border-[#222222]/10 rounded-sm overflow-hidden hover:border-[#222222]/20 hover:shadow-xs transition-all"
              >
                {/* Product Image Link */}
                <Link 
                  href={productHref} 
                  className="relative aspect-[3/4] bg-[#EFE9DF] overflow-hidden block"
                >
                  <ImageWithFallback
                    src={primaryImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badge */}
                  {product.bestseller && (
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 bg-[#7A211B] text-[#F7F3ED] text-[9px] sm:text-[10px] font-sans font-semibold tracking-wider uppercase px-2 py-0.5 rounded-2xs shadow-xs">
                      Bestseller
                    </div>
                  )}
                  {product.newArrival && !product.bestseller && (
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 bg-[#1F7A4C] text-[#F7F3ED] text-[9px] sm:text-[10px] font-sans font-semibold tracking-wider uppercase px-2 py-0.5 rounded-2xs shadow-xs">
                      New
                    </div>
                  )}
                </Link>

                {/* Product Details */}
                <div className="p-2.5 sm:p-4 flex flex-col flex-grow">
                  <p className="text-[9px] sm:text-[10px] text-[#7A211B] font-sans font-semibold tracking-widest uppercase mb-0.5 sm:mb-1">
                    {product.fabric || "Pure Handloom"}
                  </p>

                  <Link 
                    href={productHref} 
                    className="hover:text-[#7A211B] transition-colors flex-grow"
                  >
                    <h3 className="font-serif text-xs sm:text-base font-bold text-[#222222] line-clamp-2 leading-snug">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#222222]/5">
                    <span className="font-sans font-bold text-[#222222] text-xs sm:text-base">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>

                    {/* WhatsApp Quick Link */}
                    <a
                      href={`https://wa.me/919666228380?text=${whatsappMsg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-[#1F7A4C] font-semibold hover:underline min-h-[36px] items-center"
                      aria-label="Ask about this product on WhatsApp"
                    >
                      <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>Ask</span>
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
        
        {/* View All CTA */}
        <div className="mt-12 sm:mt-16 flex justify-center">
          <Link 
            href="/shop" 
            className="px-8 py-3.5 border border-[#7A211B] text-[#7A211B] hover:bg-[#7A211B] hover:text-[#F7F3ED] transition-colors font-sans text-xs font-semibold tracking-[0.2em] uppercase rounded-sm shadow-xs"
          >
            View Entire Collection
          </Link>
        </div>

      </div>
    </section>
  );
}
