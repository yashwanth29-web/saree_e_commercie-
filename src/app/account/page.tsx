"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Check } from "lucide-react";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "addresses" | "wishlist">("dashboard");

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Mint / Sage Gradient Hero with Dual Angled Models */}
      <div className="relative bg-gradient-to-b from-[#6A9684] via-[#8AB3A3] to-[#D5EDE3] pt-6 pb-8 px-4 overflow-hidden">
        <div className="max-w-md sm:max-w-xl mx-auto flex items-center justify-between">
          {/* Left Angled Photo */}
          <div className="relative w-20 h-28 sm:w-26 sm:h-36 rounded-lg overflow-hidden shadow-md transform -rotate-3 border border-white/50 flex-shrink-0">
            <Image
              src="/sarees/cat-pattu.jpg"
              alt="Usha Account Model 1"
              fill
              sizes="110px"
              className="object-cover"
              priority
            />
          </div>

          {/* Center Title & Breadcrumbs */}
          <div className="flex flex-col items-center text-center px-2">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0B281B] tracking-tight mb-2">
              My Account
            </h1>
            <div className="flex items-center gap-1.5 text-xs font-sans text-[#0B281B]/80">
              <Link href="/" className="hover:underline">Home</Link>
              <span>&gt;</span>
              <span className="font-semibold">Account</span>
            </div>
          </div>

          {/* Right Angled Photo */}
          <div className="relative w-20 h-28 sm:w-26 sm:h-36 rounded-lg overflow-hidden shadow-md transform rotate-3 border border-white/50 flex-shrink-0">
            <Image
              src="/sarees/cat-cotton.jpg"
              alt="Usha Account Model 2"
              fill
              sizes="110px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Sub-Nav Tabs Row */}
      <div className="border-b border-[#0B281B]/10 bg-white">
        <div className="max-w-md sm:max-w-xl mx-auto px-4 flex items-center gap-6 text-xs sm:text-sm font-sans font-medium text-[#1C2621]/80 py-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`transition-colors whitespace-nowrap ${
              activeTab === "dashboard"
                ? "text-[#0B281B] font-bold border-b-2 border-[#0B281B] pb-1 -mb-3"
                : "hover:text-[#0B281B]"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("addresses")}
            className={`transition-colors whitespace-nowrap ${
              activeTab === "addresses"
                ? "text-[#0B281B] font-bold border-b-2 border-[#0B281B] pb-1 -mb-3"
                : "hover:text-[#0B281B]"
            }`}
          >
            Addresses
          </button>
          <Link
            href="/wishlist"
            className="hover:text-[#0B281B] transition-colors whitespace-nowrap"
          >
            Wishlist
          </Link>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to log out?")) {
                window.location.href = "/";
              }
            }}
            className="hover:text-[#0B281B] transition-colors whitespace-nowrap"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Account Body Content */}
      <div className="flex-grow pb-16">
        <div className="max-w-md sm:max-w-xl mx-auto px-5 pt-6 space-y-8">
          
          {/* Greeting */}
          <div className="text-xs sm:text-sm font-sans text-[#1C2621]">
            <span>Hello (not ? </span>
            <button
              onClick={() => (window.location.href = "/")}
              className="underline text-[#0B281B] hover:text-[#163C2A] font-medium"
            >
              Log Out
            </button>
            <span>)</span>
          </div>

          {/* Order History Section */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B281B]">
              Order History
            </h2>

            {/* Empty State Green Card */}
            <div className="bg-[#D8EEDF] border border-[#B3DDC0] rounded-xs p-3.5 flex items-center gap-3 text-xs sm:text-sm font-sans">
              <div className="text-[#13683A] flex-shrink-0">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-[#13683A]">
                <Link href="/shop" className="underline font-bold hover:text-[#0B281B]">
                  Make your first order.
                </Link>
                <span className="text-[#1C2621]/80">
                  You haven&apos;t placed any orders yet.
                </span>
              </div>
            </div>
          </div>

          {/* Account Details Section */}
          <div className="space-y-4 pt-2">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B281B]">
              Account Details
            </h2>

            <div className="space-y-2 text-xs sm:text-sm font-sans">
              <div>
                <span className="text-[#1C2621]/60 font-medium">Name</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[#1C2621]/60 font-medium">Email</span>
                <span className="text-[#1C2621] font-medium">yashwanthbevara0@gmail.com</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/account#addresses"
                className="inline-block px-5 py-2.5 rounded-xs bg-[#0B281B] hover:bg-[#163C2A] text-white text-xs font-sans font-semibold tracking-wider transition-colors shadow-xs"
              >
                View Addresses (0)
              </Link>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
