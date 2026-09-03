"use client";

import { useState } from "react";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

interface ProductImageGalleryProps {
  images: { url: string; altText?: string | null }[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const displayImages = images.length > 0 ? images : [{ url: "/sarees/cat-pattu.jpg", altText: productName }];
  const currentImage = displayImages[selectedIndex] || displayImages[0];

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Main High-Res Image */}
      <div className="relative aspect-[3/4] bg-[#EFE9DF] rounded-sm overflow-hidden border border-[#222222]/10 shadow-xs">
        <ImageWithFallback
          src={currentImage.url}
          alt={currentImage.altText || productName}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="w-full h-full object-cover object-center transition-all duration-300"
          priority
        />
        <div className="absolute top-3 left-3 bg-[#7A211B] text-[#F7F3ED] text-[9px] font-sans font-semibold tracking-widest uppercase px-2.5 py-1 rounded-2xs shadow-xs">
          Pure Handloom
        </div>
      </div>

      {/* Horizontal Strip / Thumbnail Gallery */}
      {displayImages.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-none">
          {displayImages.map((image, index) => {
            const isSelected = selectedIndex === index;
            return (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`relative w-16 sm:w-20 aspect-[3/4] rounded-2xs overflow-hidden flex-shrink-0 border-2 transition-all ${
                  isSelected ? "border-[#7A211B] ring-2 ring-[#7A211B]/20" : "border-[#222222]/15 opacity-70 hover:opacity-100"
                }`}
                aria-label={`View photo ${index + 1}`}
              >
                <ImageWithFallback
                  src={image.url}
                  alt={image.altText || `${productName} view ${index + 1}`}
                  fill
                  sizes="80px"
                  className="w-full h-full object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
