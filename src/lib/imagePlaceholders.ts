/**
 * High-performance image placeholder helpers for Next.js Image
 * Renders instantly in 0ms without waiting for network downloads.
 */

// A warm, silk/handloom cream-toned SVG data URL (5x7 aspect ratio)
export const HANDLOOM_SHIMMER_BLUR =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0IDUiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjUiIGZpbGw9IiNFMkQ2QzMiLz48L3N2Zz4=";

export function getShimmerDataUrl(w = 400, h = 500) {
  const shimmerSvg = `
  <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop stop-color="#EDE6DA" offset="20%" />
        <stop stop-color="#DFCFAF" offset="50%" />
        <stop stop-color="#EDE6DA" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#EDE6DA" />
    <rect width="${w}" height="${h}" fill="url(#g)" opacity="0.6" />
  </svg>`;

  const base64 =
    typeof window === "undefined"
      ? Buffer.from(shimmerSvg).toString("base64")
      : window.btoa(shimmerSvg);

  return `data:image/svg+xml;base64,${base64}`;
}
