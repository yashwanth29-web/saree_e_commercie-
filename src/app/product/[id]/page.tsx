import { PrismaClient } from '@prisma/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ProductActions from '@/components/product/ProductActions';
import ProductImageGallery from '@/components/product/ProductImageGallery';

const prisma = new PrismaClient();

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const targetId = resolvedParams.id;

  // 1. Try finding by ID, Slug, or SKU
  let product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: targetId },
        { slug: targetId },
        { sku: targetId },
      ],
    },
    include: {
      images: true,
      category: true,
    }
  });

  // 2. Fallback for legacy homepage demo links (e.g. DL-101, DL-102, DL-103, DL-104)
  if (!product) {
    const allProducts = await prisma.product.findMany({
      include: {
        images: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });

    if (targetId === "DL-101" && allProducts[0]) product = allProducts[0];
    else if (targetId === "DL-102" && allProducts[1]) product = allProducts[1];
    else if (targetId === "DL-103" && allProducts[2]) product = allProducts[2];
    else if (targetId === "DL-104" && allProducts[3]) product = allProducts[3];
    else if (allProducts.length > 0) product = allProducts[0];
  }

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#F7F3ED]">
      <Navbar />
      
      <div className="flex-grow pt-4 sm:pt-8 pb-28 sm:pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Product Images Gallery (5 cols desktop, full width mobile) */}
            <div className="lg:col-span-6 xl:col-span-5">
              <ProductImageGallery 
                images={product.images}
                productName={product.name}
              />
            </div>

            {/* Product Info (7 cols desktop) */}
            <div className="lg:col-span-6 xl:col-span-7 flex flex-col">
              <p className="text-[10px] sm:text-xs font-sans tracking-[0.2em] text-[#7A211B] font-semibold uppercase mb-2">
                {product.category.name} &bull; SKU: {product.sku || 'DL-PAT-001'}
              </p>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-[#222222] mb-3 leading-snug">
                {product.name}
              </h1>
              
              <div className="text-xl sm:text-2xl font-sans text-[#7A211B] font-bold mb-4">
                ₹{product.price.toLocaleString('en-IN')}
              </div>

              <div className="w-12 h-[1px] bg-[#B79555] mb-4"></div>

              <p className="font-sans text-[#222222]/80 text-xs sm:text-sm leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Specifications Card */}
              <div className="grid grid-cols-2 gap-2.5 mb-6 font-sans text-xs text-[#222222]/80 bg-white p-3.5 sm:p-4 rounded-sm border border-[#222222]/10">
                <div>
                  <span className="font-semibold block text-[10px] text-[#222222]/60 uppercase tracking-wider mb-0.5">Fabric:</span>
                  <span className="font-medium text-[#222222]">{product.fabric || 'Pure Handloom'}</span>
                </div>
                <div>
                  <span className="font-semibold block text-[10px] text-[#222222]/60 uppercase tracking-wider mb-0.5">Weave:</span>
                  <span className="font-medium text-[#222222]">{product.weave || 'Mangalagiri Handloom'}</span>
                </div>
                <div>
                  <span className="font-semibold block text-[10px] text-[#222222]/60 uppercase tracking-wider mb-0.5">Color:</span>
                  <span className="font-medium text-[#222222]">{product.color || 'Traditional'}</span>
                </div>
                <div>
                  <span className="font-semibold block text-[10px] text-[#222222]/60 uppercase tracking-wider mb-0.5">Occasion:</span>
                  <span className="font-medium text-[#222222]">{product.occasion || 'Festive / Wedding'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <ProductActions 
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.images[0]?.url,
                  sku: product.sku,
                  slug: product.slug,
                  stock: product.stock,
                  fabric: product.fabric || undefined
                }} 
              />
            </div>

          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
