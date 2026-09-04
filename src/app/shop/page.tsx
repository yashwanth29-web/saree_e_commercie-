import prisma from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ShopCatalog from "@/components/shop/ShopCatalog";

export default async function ShopPage() {
  let products: any[] = [];
  let categories: any[] = [];

  try {
    const [pList, cList] = await Promise.all([
      prisma.product.findMany({
        where: { active: true },
        include: {
          images: true,
          category: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
      }),
    ]);
    products = pList;
    categories = cList;
  } catch (err) {
    console.error("Shop page query error:", err);
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#F7F3ED]">
      <Navbar />
      
      <div className="flex-grow pt-6 sm:pt-8 pb-16">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 max-w-7xl">
          
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-[10px] sm:text-xs font-sans tracking-[0.2em] uppercase text-[#7A211B] font-semibold block mb-1 sm:mb-2">
              DL Handlooms &bull; Authentic Weaves
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#222222] font-bold mb-2 sm:mb-3 tracking-tight uppercase">
              SHOP ALL
            </h1>
            <div className="w-12 sm:w-16 h-[2px] bg-gold mx-auto mb-3"></div>
            <p className="font-sans text-[#222222]/70 text-xs sm:text-sm max-w-xl mx-auto">
              Explore our entire collection of authentic Mangalagiri handloom sarees and dress materials.
            </p>
          </div>

          {/* Interactive Responsive Catalog with Mobile Bottom Sheets */}
          <ShopCatalog initialProducts={products} categories={categories} />

        </div>
      </div>
      
      <Footer />
    </main>
  );
}
