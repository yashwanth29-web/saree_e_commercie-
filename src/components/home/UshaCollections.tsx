import Link from "next/link";
import Image from "next/image";

interface CollectionItem {
  name: string;
  slug: string;
  image: string;
}

interface UshaCollectionsProps {
  collections?: CollectionItem[];
}

export default function UshaCollections({ collections }: UshaCollectionsProps) {
  const items: CollectionItem[] = collections && collections.length > 0
    ? collections
    : [
        {
          name: "Mangalagiri Pattu",
          slug: "pattu",
          image: "/products/mangalagiri-pattu-sky-blue.jpg",
        },
        {
          name: "Kalamkari Sarees",
          slug: "kalamkari",
          image: "/products/kalamkari-peacock-lotus.jpg",
        },
        {
          name: "Cotton Sarees",
          slug: "cotton",
          image: "/products/mangalagiri-cotton-yellow-bandhani.jpg",
        },
      ];

  return (
    <section className="py-8 px-4 bg-white">
      <div className="max-w-md sm:max-w-3xl mx-auto">
        {/* Section Heading */}
        <h2 className="font-serif text-2xl sm:text-3xl text-center font-bold text-[#0B281B] mb-6">
          Shop by collections
        </h2>

        {/* Circular Avatars Row */}
        <div className="flex items-center justify-center gap-5 sm:gap-8 overflow-x-auto no-scrollbar py-2">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`/shop?category=${item.slug}`}
              className="flex flex-col items-center group flex-shrink-0"
            >
              {/* Circle Avatar */}
              <div className="relative w-22 h-22 sm:w-26 sm:h-26 rounded-full overflow-hidden border-2 border-[#0B281B]/20 p-0.5 group-hover:border-[#0B281B] transition-all shadow-xs">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="110px"
                    className="object-cover group-hover:scale-108 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Title */}
              <span className="mt-2.5 font-sans text-xs sm:text-sm font-semibold text-[#1C2621] group-hover:text-[#0B281B] transition-colors text-center">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
