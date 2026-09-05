"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Shirt, User, HelpCircle } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  // Navigation items matching Usha Designers screenshots
  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Shop",
      href: "/shop",
      icon: Shirt,
      isActive: pathname.startsWith("/shop") || pathname.startsWith("/category") || pathname.startsWith("/product"),
    },
    {
      label: "Account",
      href: "/account",
      icon: User,
      isActive: pathname.startsWith("/account"),
    },
    {
      label: "Help",
      href: "/contact",
      icon: HelpCircle,
      isActive: pathname.startsWith("/contact") || pathname.startsWith("/help"),
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#0B281B]/10 shadow-[0_-2px_10px_rgba(0,0,0,0.04)] sm:hidden"
      aria-label="Bottom Navigation"
    >
      <div className="grid grid-cols-4 h-15 items-center max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <Link
              key={item.label}
              href={item.href}
              prefetch={true}
              className={`flex flex-col items-center justify-center py-1 transition-colors active:scale-95 duration-100 ${
                active ? "text-[#0B281B] font-bold" : "text-[#1C2621]/70 hover:text-[#0B281B]"
              }`}
            >
              <Icon
                className={`w-5 h-5 mb-0.5 transition-transform ${
                  active ? "scale-105 stroke-[2.2]" : "stroke-[1.6]"
                }`}
              />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
