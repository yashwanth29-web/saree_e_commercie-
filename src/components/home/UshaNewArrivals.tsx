import Link from "next/link";
import ProductCardOverlay, { ProductCardProps } from "@/components/product/ProductCardOverlay";

interface UshaNewArrivalsProps {
  products?: ProductCardProps[];
}

export default function UshaNewArrivals({ products }: UshaNewArrivalsProps) {
  const displayProducts: ProductCardProps[] = products && products.length > 0
    ? products
    : [
        {
          id: "na-1",
          name: "Radha-Krishna Vrindavan Kalamkari Handloom Saree",
          price: 3250,
          image: "/products/kalamkari-radha-krishna.jpg",
          slug: "radha-krishna-vrindavan-kalamkari",
        },
        {
          id: "na-2",
          name: "Mangalagiri Pattu Silver Zari Temple Saree - Rani Pink",
          price: 1950,
          image: "/products/mangalagiri-pattu-rani-pink.jpg",
          slug: "mangalagiri-pattu-silver-zari-rani-pink",
        },
        {
          id: "na-3",
          name: "Mangalagiri Pattu Silver Zari Temple Saree - Wine Maroon",
          price: 2100,
          image: "/products/mangalagiri-pattu-wine-maroon.jpg",
          slug: "mangalagiri-pattu-silver-zari-wine-maroon",
        },
        {
          id: "na-4",
          name: "100s Count Pure Cotton Saree - Forest Green Floral",
          price: 1450,
          image: "/products/mangalagiri-cotton-green-floral.jpg",
          slug: "mangalagiri-cotton-green-floral",
        },
      ];

  return (
    <section className="py-8 px-4 bg-white">
      <div className="max-w-md sm:max-w-3xl mx-auto">
        {/* Title */}
        <h2 className="font-serif text-2xl sm:text-3xl text-center font-bold text-[#0B281B] mb-6">
          New Arrivals
        </h2>

        {/* 2-Column Mobile Grid */}
        <div className="grid grid-cols-2 gap-3.5 sm:gap-6 mb-8">
          {displayProducts.slice(0, 4).map((product) => (
            <ProductCardOverlay key={product.id} {...product} />
          ))}
        </div>

        {/* "Shop more" button */}
        <div className="flex justify-center">
          <Link
            href="/shop?filter=new-arrivals"
            className="px-7 py-2.5 rounded-xs bg-[#0B281B] hover:bg-[#163C2A] text-white text-xs sm:text-sm font-sans font-semibold tracking-wider transition-colors shadow-xs"
          >
            Shop more
          </Link>
        </div>
      </div>
    </section>
  );
}
