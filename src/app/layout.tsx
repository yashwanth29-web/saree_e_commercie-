import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";
import CartDrawer from "@/components/cart/CartDrawer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DL Handlooms | Pure Mangalagiri Handlooms, Direct from Master Weavers",
  description: "Authentic Mangalagiri Pattu Sarees, Pure Cotton Sarees & Dress Materials direct from Dhana Lakshmi Handlooms, Bhadravathi Nagar, Mangalagiri.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                if (
                  (e && e.message && (e.message.indexOf('startTime') !== -1 || e.message.indexOf('reportAllChanges') !== -1)) ||
                  (e && e.filename && e.filename.indexOf('web-vitals') !== -1)
                ) {
                  e.stopImmediatePropagation();
                  e.preventDefault();
                  return true;
                }
              }, true);
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAFAF8] text-[#1C2621]">
        {children}
        <CartDrawer />
        <BottomNav />
      </body>
    </html>
  );
}
