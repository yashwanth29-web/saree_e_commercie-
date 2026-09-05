import UshaLogo from "@/components/ui/UshaLogo";

export default function UshaTicker() {
  const categories = [
    "Dresses",
    "Accessories",
    "Fashion Jewellery",
    "Pure Sarees",
    "Dress Materials",
    "Kurtis",
    "New Arrivals",
  ];

  return (
    <div className="bg-[#E4F4EC] border-y border-[#0B281B]/10 py-3 overflow-hidden">
      <div className="flex items-center gap-6 whitespace-nowrap animate-marquee">
        {[...categories, ...categories].map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 text-xs font-sans font-semibold text-[#0B281B]">
            <span>{item}</span>
            {/* Lotus/Trident Mini Badge */}
            <div className="w-5 h-5 rounded-full bg-[#0B281B] text-white flex items-center justify-center p-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
                <path d="M6 5v7a6 6 0 0 0 12 0V5" />
                <path d="M12 4v10" />
                <circle cx="8" cy="7" r="1" fill="currentColor" />
                <circle cx="12" cy="5" r="1.1" fill="currentColor" />
                <circle cx="16" cy="7" r="1" fill="currentColor" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
