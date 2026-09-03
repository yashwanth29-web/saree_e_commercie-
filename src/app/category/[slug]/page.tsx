import { PrismaClient } from '@prisma/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

const prisma = new PrismaClient();

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const category = await prisma.category.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      products: {
        include: {
          images: true,
        }
      }
    }
  });

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      
      <div className="flex-grow pt-8 pb-16">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="text-center mb-12">
            <span className="text-xs font-sans tracking-[0.2em] uppercase text-[#7A211B] font-semibold block mb-2">
              DL Handlooms &bull; Collection
            </span>
            <h1 className="font-serif text-3xl md:text-4xl text-[#222222] font-bold mb-3 tracking-tight uppercase">
              {category.name}
            </h1>
            <div className="w-16 h-[2px] bg-gold mx-auto mb-4"></div>
            <p className="font-sans text-[#222222]/70 text-sm max-w-xl mx-auto">
              {category.description || `Explore our collection of authentic Mangalagiri ${category.name}.`}
            </p>
          </div>

          {category.products.length === 0 ? (
            <div className="text-center text-[#222222]/60 py-16 bg-white border border-[#222222]/10 rounded-sm">
              No products found in this category right now.
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {category.products.map((product: any) => {
                const primaryImage = product.images?.[0]?.url || "/sarees/cat-pattu.jpg";
                const productHref = `/product/${product.slug || product.id}`;
                return (
                  <div key={product.id} className="group flex flex-col bg-white border border-[#222222]/10 rounded-sm overflow-hidden hover:border-[#222222]/20 hover:shadow-xs transition-all">
                    <Link href={productHref} className="relative aspect-[3/4] bg-[#EFE9DF] overflow-hidden block">
                      <ImageWithFallback 
                        src={primaryImage} 
                        alt={product.name}
                        fill
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </Link>
                    <div className="p-2.5 sm:p-4 flex flex-col flex-grow">
                      <p className="text-[9px] sm:text-[10px] text-[#7A211B] font-sans font-semibold tracking-widest uppercase mb-1">
                        {product.fabric || "Pure Handloom"}
                      </p>
                      <Link href={productHref} className="hover:text-[#7A211B] transition-colors flex-grow">
                        <h3 className="font-serif text-xs sm:text-base font-bold text-[#222222] line-clamp-2 leading-snug">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#222222]/5">
                        <p className="font-sans font-bold text-[#222222] text-xs sm:text-base">
                          ₹{product.price.toLocaleString('en-IN')}
                        </p>
                        <span className="text-[11px] text-[#1F7A4C] font-semibold">In Stock</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
