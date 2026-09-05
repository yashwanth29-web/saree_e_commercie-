import prisma from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ShopCatalog from "@/components/shop/ShopCatalog";

export const revalidate = 60;

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
    <main className="min-h-screen flex flex-col bg-[#FAFAF8]">
      <Navbar />

      {/* Mint / Sage Gradient Hero Header */}
      <div className="bg-gradient-to-b from-[#81B39F] via-[#A8D3C0] to-[#DCF0E6] py-10 px-4 text-center">
        <div className="flex items-center justify-center gap-2 text-xs font-sans text-[#0B281B]/80 mb-2">
          <span>Home</span>
          <span>&gt;</span>
          <span className="font-semibold text-[#0B281B]">Products</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B281B] tracking-tight">
          PRODUCTS
        </h1>
      </div>

      <div className="flex-grow pb-16">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 max-w-5xl">
          <ShopCatalog initialProducts={products} categories={categories} />
        </div>
      </div>

      <Footer />
    </main>
  );
}
