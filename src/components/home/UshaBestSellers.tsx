import Link from "next/link";
import ProductCardOverlay, { ProductCardProps } from "@/components/product/ProductCardOverlay";

interface UshaBestSellersProps {
  products?: ProductCardProps[];
}

export default function UshaBestSellers({ products }: UshaBestSellersProps) {
  const displayProducts: ProductCardProps[] = products && products.length > 0
    ? products
    : [
        {
          id: "bs-1",
          name: "Mangalagiri Royal Peacock & Lotus Pond Kalamkari Saree",
          price: 2850,
          image: "/products/kalamkari-peacock-lotus.jpg",
          slug: "mangalagiri-peacock-lotus-kalamkari",
        },
        {
          id: "bs-2",
          name: "Mangalagiri Pattu Silver Zari Temple Saree - Sky Blue",
          price: 1950,
          image: "/products/mangalagiri-pattu-sky-blue.jpg",
          slug: "mangalagiri-pattu-silver-zari-sky-blue",
        },
        {
          id: "bs-3",
          name: "100s Count Pure Cotton Saree - Turmeric Yellow Bandhani",
          price: 1450,
          image: "/products/mangalagiri-cotton-yellow-bandhani.jpg",
          slug: "mangalagiri-cotton-yellow-bandhani",
        },
        {
          id: "bs-4",
          name: "Vrindavan Kamadhenu Cow & Lotus Handloom Saree",
          price: 2950,
          image: "/products/kalamkari-pichwai-cow.jpg",
          slug: "vrindavan-kamadhenu-lotus-kalamkari",
        },
      ];

  return (
    <section className="py-8 px-4 bg-white border-t border-[#0B281B]/5">
      <div className="max-w-md sm:max-w-3xl mx-auto">
        {/* Title */}
        <h2 className="font-serif text-2xl sm:text-3xl text-center font-bold text-[#0B281B] mb-6">
          Best Sellers
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
            href="/shop?filter=best-sellers"
            className="px-7 py-2.5 rounded-xs bg-[#0B281B] hover:bg-[#163C2A] text-white text-xs sm:text-sm font-sans font-semibold tracking-wider transition-colors shadow-xs"
          >
            Shop more
          </Link>
        </div>
      </div>
    </section>
  );
}
