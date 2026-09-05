import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import UshaHero from "@/components/home/UshaHero";
import UshaCollections from "@/components/home/UshaCollections";
import UshaBestSellers from "@/components/home/UshaBestSellers";
import UshaPriceCollections from "@/components/home/UshaPriceCollections";
import UshaFeaturedBanner from "@/components/home/UshaFeaturedBanner";
import UshaNewArrivals from "@/components/home/UshaNewArrivals";
import UshaTicker from "@/components/home/UshaTicker";
import prisma from "@/lib/prisma";

export const revalidate = 60;

export default async function HomePage() {
  let bestSellers: any[] = [];
  let newArrivals: any[] = [];

  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      include: { images: true, category: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    const mapped = products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      slug: p.slug,
      image: p.images?.[0]?.url || "/sarees/cat-pattu.jpg",
      isSoldOut: p.stock === 0,
    }));

    bestSellers = mapped.slice(0, 4);
    newArrivals = mapped.slice(4, 8);
  } catch (err) {
    console.warn("Could not query products from database for homepage:", err);
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#FAFAF8]">
      <Navbar />

      <div className="flex-grow">
        {/* 1. Mint Hero with 3 Angled Panels */}
        <UshaHero />

        {/* 2. Shop by collections (Circular Avatars) */}
        <UshaCollections />

        {/* 3. Best Sellers 2-Column Grid */}
        <UshaBestSellers products={bestSellers.length > 0 ? bestSellers : undefined} />

        {/* 4. Price by Collections (Arched Cards) */}
        <UshaPriceCollections />

        {/* 5. Forest Green Full-Bleed Category Banner */}
        <UshaFeaturedBanner />

        {/* 6. New Arrivals 2-Column Grid */}
        <UshaNewArrivals products={newArrivals.length > 0 ? newArrivals : undefined} />

        {/* 7. Category Pill Ticker */}
        <UshaTicker />
      </div>

      <Footer />
    </main>
  );
}
