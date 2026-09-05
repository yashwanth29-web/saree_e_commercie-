"use client";

import { useState, useMemo } from "react";
import { ChevronDown, X, Check } from "lucide-react";
import ProductCardOverlay, { ProductCardProps } from "@/components/product/ProductCardOverlay";

interface ProductItem {
  id: string;
  name: string;
  slug?: string | null;
  sku?: string | null;
  price: number;
  stock?: number;
  images?: { url: string; altText?: string | null }[];
  category?: { id: string; name: string; slug: string } | null;
}

interface ShopCatalogProps {
  initialProducts: ProductItem[];
  categories: { id: string; name: string; slug: string }[];
}

export default function ShopCatalog({ initialProducts, categories }: ShopCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name-asc");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [sortDrawerOpen, setSortDrawerOpen] = useState(false);

  // Default fallback products if database has few
  const defaultProducts: ProductCardProps[] = [
    {
      id: "ush-1",
      name: "10 X 10 Bedsheet",
      price: 950,
      image: "/sarees/feat-1.jpg",
      slug: "10-x-10-bedsheet",
      isSoldOut: true,
    },
    {
      id: "ush-2",
      name: "10 X 10 Premium Rayon Cotton",
      price: 1499,
      image: "/sarees/feat-2.jpg",
      slug: "10-x-10-premium-rayon-cotton-a",
      isSoldOut: false,
    },
    {
      id: "ush-3",
      name: "10 X 10 Premium Rayon Cotton",
      price: 1499,
      image: "/sarees/feat-3.jpg",
      slug: "10-x-10-premium-rayon-cotton-b",
      isSoldOut: false,
    },
    {
      id: "ush-4",
      name: "10 X 10 Premium Rayon Cotton",
      price: 1499,
      image: "/sarees/feat-4.jpg",
      slug: "10-x-10-premium-rayon-cotton-c",
      isSoldOut: false,
    },
    {
      id: "ush-5",
      name: "100 Count Lenin Dress Material",
      price: 1499,
      image: "/sarees/cat-dress.jpg",
      slug: "100-count-lenin-dress-material",
      isSoldOut: false,
    },
    {
      id: "ush-6",
      name: "3 PCS set dress Material",
      price: 699,
      image: "/sarees/cat-arrivals.jpg",
      slug: "3-pcs-set-dress-material-1",
      isSoldOut: true,
    },
    {
      id: "ush-7",
      name: "3 PCS set dress Material",
      price: 699,
      image: "/sarees/cat-cotton.jpg",
      slug: "3-pcs-set-dress-material-2",
      isSoldOut: false,
    },
    {
      id: "ush-8",
      name: "3 PCS set dress Material",
      price: 699,
      image: "/sarees/cat-pattu.jpg",
      slug: "3-pcs-set-dress-material-3",
      isSoldOut: true,
    },
    {
      id: "ush-9",
      name: "3 PCS set dress Material",
      price: 699,
      image: "/sarees/feat-1.jpg",
      slug: "3-pcs-set-dress-material-4",
      isSoldOut: true,
    },
  ];

  // Map initialProducts or fall back to default
  const productList: ProductCardProps[] = useMemo(() => {
    if (initialProducts && initialProducts.length >= 4) {
      return initialProducts.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        slug: p.slug || p.id,
        image: p.images?.[0]?.url || "/sarees/cat-pattu.jpg",
        isSoldOut: p.stock === 0,
      }));
    }
    return defaultProducts;
  }, [initialProducts]);

  // Sorted and filtered list
  const filteredProducts = useMemo(() => {
    let list = [...productList];

    if (sortBy === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-asc") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      list.sort((a, b) => b.name.localeCompare(a.name));
    }

    return list;
  }, [productList, sortBy]);

  const sortLabels: Record<string, string> = {
    "name-asc": "Alphabetically, A-Z",
    "name-desc": "Alphabetically, Z-A",
    "price-low": "Price, low to high",
    "price-high": "Price, high to low",
  };

  return (
    <div className="pt-4">
      {/* Top Filter & Sort Bar matching Screenshot */}
      <div className="flex items-center justify-between py-3 border-b border-[#0B281B]/10 mb-6 text-sm font-sans font-medium text-[#1C2621]">
        {/* Filter Trigger */}
        <button
          onClick={() => setFilterDrawerOpen(true)}
          className="flex items-center gap-1.5 hover:text-[#0B281B] transition-colors"
        >
          <span>Filter</span>
          <ChevronDown className="w-4 h-4 text-[#1C2621]" />
        </button>

        {/* Sort Trigger */}
        <button
          onClick={() => setSortDrawerOpen(true)}
          className="flex items-center gap-1.5 hover:text-[#0B281B] transition-colors"
        >
          <span>{sortLabels[sortBy] || "Alphabetically, A-Z"}</span>
          <ChevronDown className="w-4 h-4 text-[#1C2621]" />
        </button>
      </div>

      {/* 2-Column Mobile Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
        {filteredProducts.map((product) => (
          <ProductCardOverlay key={product.id} {...product} />
        ))}
      </div>

      {/* Filter Bottom Sheet Modal */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-2xs"
            onClick={() => setFilterDrawerOpen(false)}
          />
          <div className="relative bg-white w-full rounded-t-2xl p-5 shadow-2xl z-10 max-h-[70vh] overflow-y-auto animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between pb-3 border-b border-[#0B281B]/10 mb-4">
              <h3 className="font-serif text-lg font-bold text-[#0B281B]">Filters</h3>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="p-1 rounded-full text-[#1C2621]/60 hover:text-[#0B281B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setFilterDrawerOpen(false);
                }}
                className={`w-full py-2.5 px-3 text-left rounded-xs text-xs font-semibold flex items-center justify-between ${
                  selectedCategory === "all" ? "bg-[#0B281B] text-white" : "hover:bg-gray-100"
                }`}
              >
                <span>All Products</span>
                {selectedCategory === "all" && <Check className="w-4 h-4" />}
              </button>

              {["Sarees", "Dresses", "Dress Materials", "Jewellery"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat.toLowerCase());
                    setFilterDrawerOpen(false);
                  }}
                  className={`w-full py-2.5 px-3 text-left rounded-xs text-xs font-semibold flex items-center justify-between ${
                    selectedCategory === cat.toLowerCase()
                      ? "bg-[#0B281B] text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat.toLowerCase() && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sort Bottom Sheet Modal */}
      {sortDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-2xs"
            onClick={() => setSortDrawerOpen(false)}
          />
          <div className="relative bg-white w-full rounded-t-2xl p-5 shadow-2xl z-10 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between pb-3 border-b border-[#0B281B]/10 mb-4">
              <h3 className="font-serif text-lg font-bold text-[#0B281B]">Sort By</h3>
              <button
                onClick={() => setSortDrawerOpen(false)}
                className="p-1 rounded-full text-[#1C2621]/60 hover:text-[#0B281B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {Object.entries(sortLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSortBy(key);
                    setSortDrawerOpen(false);
                  }}
                  className={`w-full py-2.5 px-3 text-left rounded-xs text-xs font-semibold flex items-center justify-between ${
                    sortBy === key ? "bg-[#0B281B] text-white" : "hover:bg-gray-100"
                  }`}
                >
                  <span>{label}</span>
                  {sortBy === key && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
