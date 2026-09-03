"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { SlidersHorizontal, ArrowUpDown, X, Check, MessageCircle } from "lucide-react";

interface ProductItem {
  id: string;
  name: string;
  slug?: string | null;
  sku?: string | null;
  price: number;
  fabric?: string | null;
  color?: string | null;
  bestseller?: boolean;
  newArrival?: boolean;
  images?: { url: string; altText?: string | null }[];
  category?: { id: string; name: string; slug: string } | null;
}

interface ShopCatalogProps {
  initialProducts: ProductItem[];
  categories: { id: string; name: string; slug: string }[];
}

export default function ShopCatalog({ initialProducts, categories }: ShopCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedFabric, setSelectedFabric] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");

  // Mobile Bottom Sheet States
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [sortDrawerOpen, setSortDrawerOpen] = useState(false);

  // Extract unique fabrics
  const fabrics = useMemo(() => {
    const set = new Set<string>();
    initialProducts.forEach((p) => {
      if (p.fabric) set.add(p.fabric);
    });
    return Array.from(set);
  }, [initialProducts]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    // Category filter
    if (selectedCategory !== "all") {
      list = list.filter(
        (p) => p.category?.slug === selectedCategory || p.category?.id === selectedCategory
      );
    }

    // Fabric filter
    if (selectedFabric !== "all") {
      list = list.filter((p) => p.fabric === selectedFabric);
    }

    // Sort
    if (sortBy === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-asc") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [initialProducts, selectedCategory, selectedFabric, sortBy]);

  const activeFilterCount = (selectedCategory !== "all" ? 1 : 0) + (selectedFabric !== "all" ? 1 : 0);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedFabric("all");
  };

  return (
    <div>
      {/* Mobile Top Filter & Sort Bar */}
      <div className="lg:hidden flex items-center gap-2 mb-6 sticky top-16 z-30 bg-[#F7F3ED]/95 backdrop-blur-sm py-2 border-y border-[#222222]/10">
        <button
          onClick={() => setFilterDrawerOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#222222]/20 py-2.5 px-4 rounded-sm text-xs font-sans font-semibold tracking-wider uppercase text-[#222222] touch-target"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#7A211B]" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#7A211B] text-white text-[10px] flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setSortDrawerOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#222222]/20 py-2.5 px-4 rounded-sm text-xs font-sans font-semibold tracking-wider uppercase text-[#222222] touch-target"
        >
          <ArrowUpDown className="w-4 h-4 text-[#7A211B]" />
          <span>Sort By</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 bg-white p-6 rounded-sm border border-[#222222]/10 sticky top-24">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#222222]/10">
            <h2 className="font-serif text-lg font-bold text-[#222222]">Refine Collection</h2>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs text-[#7A211B] font-semibold hover:underline"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="text-xs font-sans font-bold tracking-widest text-[#222222]/70 uppercase mb-3">
              Categories
            </h3>
            <div className="space-y-1.5">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`w-full text-left text-xs py-1.5 px-2 rounded-xs font-sans transition-colors flex items-center justify-between ${
                  selectedCategory === "all"
                    ? "bg-[#7A211B]/10 text-[#7A211B] font-bold"
                    : "text-[#222222]/80 hover:bg-[#222222]/5"
                }`}
              >
                <span>All Categories</span>
                {selectedCategory === "all" && <Check className="w-3.5 h-3.5" />}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left text-xs py-1.5 px-2 rounded-xs font-sans transition-colors flex items-center justify-between ${
                    selectedCategory === cat.slug
                      ? "bg-[#7A211B]/10 text-[#7A211B] font-bold"
                      : "text-[#222222]/80 hover:bg-[#222222]/5"
                  }`}
                >
                  <span>{cat.name}</span>
                  {selectedCategory === cat.slug && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Fabric Filter */}
          {fabrics.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-sans font-bold tracking-widest text-[#222222]/70 uppercase mb-3">
                Fabric / Weave
              </h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedFabric("all")}
                  className={`w-full text-left text-xs py-1.5 px-2 rounded-xs font-sans transition-colors flex items-center justify-between ${
                    selectedFabric === "all"
                      ? "bg-[#7A211B]/10 text-[#7A211B] font-bold"
                      : "text-[#222222]/80 hover:bg-[#222222]/5"
                  }`}
                >
                  <span>All Fabrics</span>
                  {selectedFabric === "all" && <Check className="w-3.5 h-3.5" />}
                </button>
                {fabrics.map((fabric) => (
                  <button
                    key={fabric}
                    onClick={() => setSelectedFabric(fabric)}
                    className={`w-full text-left text-xs py-1.5 px-2 rounded-xs font-sans transition-colors flex items-center justify-between ${
                      selectedFabric === fabric
                        ? "bg-[#7A211B]/10 text-[#7A211B] font-bold"
                        : "text-[#222222]/80 hover:bg-[#222222]/5"
                    }`}
                  >
                    <span>{fabric}</span>
                    {selectedFabric === fabric && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Desktop Sort Dropdown */}
          <div>
            <h3 className="text-xs font-sans font-bold tracking-widest text-[#222222]/70 uppercase mb-3">
              Sort Order
            </h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-[#F7F3ED] border border-[#222222]/20 text-xs py-2 px-3 rounded-xs text-[#222222] font-sans focus:outline-hidden focus:border-[#7A211B]"
            >
              <option value="default">Featured / Handloom</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </aside>

        {/* Product Grid (9 cols desktop, 2 cols mobile) */}
        <div className="lg:col-span-9">
          
          {/* Active Filter Chips & Results Count */}
          <div className="flex items-center justify-between mb-4 text-xs font-sans text-[#222222]/70">
            <span>Showing {filteredProducts.length} authentic pieces</span>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-[#7A211B] font-semibold hover:underline lg:hidden"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* 2 Columns on Mobile, 3 on Tablet, 3-4 on Desktop */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-6">
              {filteredProducts.map((product) => {
                const primaryImage = product.images?.[0]?.url || "/sarees/cat-pattu.jpg";
                const productHref = `/product/${product.slug || product.id}`;
                const whatsappMsg = encodeURIComponent(
                  `Namaste DL Handlooms! I am interested in: ${product.name} (Price: ₹${product.price.toLocaleString("en-IN")}, SKU: ${product.sku || "N/A"}). Please share availability.`
                );

                return (
                  <div
                    key={product.id}
                    className="group flex flex-col bg-white border border-[#222222]/10 rounded-sm overflow-hidden hover:border-[#222222]/20 hover:shadow-xs transition-all"
                  >
                    {/* Product Image */}
                    <Link
                      href={productHref}
                      className="relative aspect-[3/4] bg-[#EFE9DF] overflow-hidden block"
                    >
                      <ImageWithFallback
                        src={primaryImage}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Badge */}
                      {product.bestseller && (
                        <div className="absolute top-2 left-2 z-10 bg-[#7A211B] text-[#F7F3ED] text-[9px] font-sans font-semibold tracking-wider uppercase px-2 py-0.5 rounded-2xs shadow-xs">
                          Bestseller
                        </div>
                      )}
                      {product.newArrival && !product.bestseller && (
                        <div className="absolute top-2 left-2 z-10 bg-[#1F7A4C] text-[#F7F3ED] text-[9px] font-sans font-semibold tracking-wider uppercase px-2 py-0.5 rounded-2xs shadow-xs">
                          New
                        </div>
                      )}
                    </Link>

                    {/* Product Details */}
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
                        <span className="font-sans font-bold text-[#222222] text-xs sm:text-base">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>

                        {/* WhatsApp Quick Ask */}
                        <a
                          href={`https://wa.me/919666228380?text=${whatsappMsg}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-[#1F7A4C] font-semibold hover:underline min-h-[36px] items-center"
                          aria-label="Ask about this product on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Ask</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-[#222222]/10 rounded-sm p-8">
              <p className="font-serif text-lg text-[#222222] mb-2">No matching handlooms found</p>
              <p className="text-xs text-[#222222]/60 mb-4">Try clearing your filters to see more sarees.</p>
              <button
                onClick={clearFilters}
                className="px-5 py-2.5 bg-[#7A211B] text-white text-xs font-semibold uppercase tracking-wider rounded-xs"
              >
                Clear Filters
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Mobile Filter Bottom Sheet */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-2xs transition-opacity"
            onClick={() => setFilterDrawerOpen(false)}
          />

          {/* Drawer Sheet */}
          <div className="relative bg-white w-full rounded-t-xl max-h-[85vh] flex flex-col shadow-2xl z-10 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-[#222222]/10 flex items-center justify-between">
              <h2 className="font-serif text-base font-bold text-[#222222]">Filters</h2>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="p-1 rounded-full text-[#222222]/60 hover:text-[#222222] touch-target"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Filter Options */}
            <div className="p-4 overflow-y-auto space-y-6">
              {/* Category */}
              <div>
                <h3 className="text-xs font-sans font-bold tracking-widest text-[#222222]/70 uppercase mb-2">
                  Category
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`py-2 px-3 rounded-xs text-xs font-sans font-medium text-center border transition-all ${
                      selectedCategory === "all"
                        ? "bg-[#7A211B] text-white border-[#7A211B]"
                        : "bg-[#F7F3ED] text-[#222222] border-[#222222]/15"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`py-2 px-3 rounded-xs text-xs font-sans font-medium text-center border transition-all ${
                        selectedCategory === cat.slug
                          ? "bg-[#7A211B] text-white border-[#7A211B]"
                          : "bg-[#F7F3ED] text-[#222222] border-[#222222]/15"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fabric */}
              {fabrics.length > 0 && (
                <div>
                  <h3 className="text-xs font-sans font-bold tracking-widest text-[#222222]/70 uppercase mb-2">
                    Fabric
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedFabric("all")}
                      className={`py-2 px-3 rounded-xs text-xs font-sans font-medium text-center border transition-all ${
                        selectedFabric === "all"
                          ? "bg-[#7A211B] text-white border-[#7A211B]"
                          : "bg-[#F7F3ED] text-[#222222] border-[#222222]/15"
                      }`}
                    >
                      All Fabrics
                    </button>
                    {fabrics.map((fabric) => (
                      <button
                        key={fabric}
                        onClick={() => setSelectedFabric(fabric)}
                        className={`py-2 px-3 rounded-xs text-xs font-sans font-medium text-center border transition-all ${
                          selectedFabric === fabric
                            ? "bg-[#7A211B] text-white border-[#7A211B]"
                            : "bg-[#F7F3ED] text-[#222222] border-[#222222]/15"
                        }`}
                      >
                        {fabric}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-[#222222]/10 bg-[#F7F3ED] flex items-center gap-3 pb-safe">
              <button
                onClick={() => {
                  clearFilters();
                  setFilterDrawerOpen(false);
                }}
                className="flex-1 py-3 border border-[#222222]/30 text-xs font-semibold tracking-wider uppercase text-[#222222] rounded-xs touch-target"
              >
                Reset
              </button>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="flex-1 py-3 bg-[#7A211B] text-white text-xs font-semibold tracking-wider uppercase rounded-xs shadow-xs touch-target"
              >
                Apply Filters ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sort Bottom Sheet */}
      {sortDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-2xs transition-opacity"
            onClick={() => setSortDrawerOpen(false)}
          />

          {/* Drawer Sheet */}
          <div className="relative bg-white w-full rounded-t-xl max-h-[60vh] flex flex-col shadow-2xl z-10 overflow-hidden pb-safe">
            <div className="p-4 border-b border-[#222222]/10 flex items-center justify-between">
              <h2 className="font-serif text-base font-bold text-[#222222]">Sort By</h2>
              <button
                onClick={() => setSortDrawerOpen(false)}
                className="p-1 rounded-full text-[#222222]/60 hover:text-[#222222] touch-target"
                aria-label="Close sort"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-2 divide-y divide-[#222222]/5">
              {[
                { id: "default", label: "Featured / Recommended" },
                { id: "price-low", label: "Price: Low to High" },
                { id: "price-high", label: "Price: High to Low" },
                { id: "name-asc", label: "Name: A to Z" },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSortBy(option.id);
                    setSortDrawerOpen(false);
                  }}
                  className={`w-full py-3.5 px-4 text-left font-sans text-sm flex items-center justify-between touch-target ${
                    sortBy === option.id ? "text-[#7A211B] font-bold" : "text-[#222222]"
                  }`}
                >
                  <span>{option.label}</span>
                  {sortBy === option.id && <Check className="w-4 h-4 text-[#7A211B]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
