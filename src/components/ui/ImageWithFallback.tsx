"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

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
  const [loading, setLoading] = useState(true);

  // If no source is provided or error was triggered, use fallbackSrc
  const imageSource = (!src || error) ? fallbackSrc : src;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-[#EFE9DF] animate-pulse z-0" />
      )}
      <Image
        {...props}
        src={imageSource}
        alt={alt || "Mangalagiri Handloom Saree"}
        sizes={sizes || "(max-width: 768px) 100vw, 33vw"}
        className={`object-cover object-center transition-opacity duration-300 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
    </div>
  );
}
