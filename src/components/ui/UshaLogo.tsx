import Link from "next/link";
import Image from "next/image";

interface BrandLogoProps {
  className?: string;
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  href?: string;
}

export default function BrandLogo({
  className = "",
  variant = "light",
  size = "md",
  href = "/",
}: BrandLogoProps) {
  const isLight = variant === "light";
  const textColor = isLight ? "text-white" : "text-[#0B281B]";
  const subTextColor = isLight ? "text-white/80" : "text-[#0B281B]/70";

  const sizeStyles = {
    sm: {
      img: 32,
      title: "text-sm tracking-wide",
      sub: "text-[7.5px] tracking-[0.2em]",
      gap: "gap-2",
    },
    md: {
      img: 40,
      title: "text-base sm:text-lg font-bold tracking-wide",
      sub: "text-[8.5px] sm:text-[9px] font-semibold tracking-[0.2em]",
      gap: "gap-2.5",
    },
    lg: {
      img: 50,
      title: "text-xl sm:text-2xl font-bold tracking-wide",
      sub: "text-[9.5px] sm:text-[10px] font-semibold tracking-[0.22em]",
      gap: "gap-3",
    },
  }[size];

  const content = (
    <div className={`flex items-center ${sizeStyles.gap} ${className} group`}>
      {/* DL Handlooms Ornate Logo */}
      <div className="relative rounded-full overflow-hidden bg-white p-0.5 shadow-xs flex-shrink-0 border border-white/30">
        <Image
          src="/logo.jpg"
          alt="DL Handlooms"
          width={sizeStyles.img}
          height={sizeStyles.img}
          className="object-contain rounded-full"
          priority
        />
      </div>

      {/* Wordmark */}
      <div className="flex flex-col leading-tight">
        <span className={`font-serif font-extrabold ${sizeStyles.title} ${textColor} leading-tight`}>
          DL HANDLOOMS
        </span>
        <span className={`font-sans uppercase ${sizeStyles.sub} ${subTextColor}`}>
          DHANA LAKSHMI &bull; MANGALAGIRI
        </span>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
