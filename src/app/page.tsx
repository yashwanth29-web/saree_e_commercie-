import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import ShopByCategory from "@/components/home/ShopByCategory";
import FeaturedProducts from "@/components/home/FeaturedProducts";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      
      <div className="flex-grow">
        <Hero />
        <ShopByCategory />
        <FeaturedProducts />
      </div>

      <Footer />
    </main>
  );
}
