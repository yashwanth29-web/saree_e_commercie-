"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { HANDLOOM_SHIMMER_BLUR } from "@/lib/imagePlaceholders";

interface ImageWithFallbackProps extends Omit<ImageProps, "src"> {
  src?: string | null;
  fallbackSrc?: string;
}

export default function ImageWithFallback({
  src,
  fallbackSrc = "/sarees/cat-pattu.jpg",
  alt,
  className = "",
  sizes,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // If no source is provided or error was triggered, use fallbackSrc
  const imageSource = !src || error ? fallbackSrc : src;

  return (
    <div className={`relative ${props.fill ? "w-full h-full" : ""} overflow-hidden bg-[#EAE2D5]`}>
      {/* Background warm shimmer tone while image decodes */}
      {!loaded && (
        <div className="absolute inset-0 bg-[#EAE2D5] animate-pulse z-0 pointer-events-none" />
      )}
      <Image
        {...props}
        src={imageSource}
        alt={alt || "Mangalagiri Handloom Saree"}
        sizes={sizes || "(max-width: 768px) 100vw, 33vw"}
        placeholder="blur"
        blurDataURL={props.blurDataURL || HANDLOOM_SHIMMER_BLUR}
        className={`object-cover object-center transition-all duration-300 ${className}`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
      />
    </div>
  );
}
