"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { MapPin, Phone, Truck, Check } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

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
              alt="Mangalagiri Pattu Saree"
              fill
              sizes="110px"
              className="object-cover"
              priority
            />
          </div>

          {/* Center Title & Breadcrumbs */}
          <div className="flex flex-col items-center text-center px-2">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0B281B] tracking-tight mb-2">
              Contact Us
            </h1>
            <div className="flex items-center gap-1.5 text-xs font-sans text-[#0B281B]/80">
              <Link href="/" className="hover:underline">Home</Link>
              <span>&gt;</span>
              <span className="font-semibold">Contact &amp; Store Location</span>
            </div>
          </div>

          {/* Right Angled Photo */}
          <div className="relative w-20 h-28 sm:w-26 sm:h-36 rounded-lg overflow-hidden shadow-md transform rotate-3 border border-white/50 flex-shrink-0">
            <Image
              src="/sarees/cat-cotton.jpg"
              alt="Mangalagiri Cotton Saree"
              fill
              sizes="110px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-grow pb-16">
        <div className="max-w-md sm:max-w-xl mx-auto px-5 pt-8 space-y-8">
          
          {/* Contact Info Cards */}
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar justify-start sm:justify-center">
            {/* Card 1: Exact Store Address */}
            <div className="w-64 sm:w-72 flex-shrink-0 bg-white border border-[#0B281B]/10 rounded-sm p-4 flex flex-col items-center text-center shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#EAF5F1] text-[#0B281B] flex items-center justify-center mb-3">
                <MapPin className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#0B281B] mb-2">
                Store &amp; Loom Address
              </h3>
              <p className="text-xs font-sans text-[#1C2621]/85 leading-relaxed font-medium">
                Opp:CPI flag center, straight road, opposite chaitanya handlooms, Bhadravathi Nagar, Mangalagiri, Andhra Pradesh 522503
              </p>
            </div>

            {/* Card 2: Phone & WhatsApp */}
            <div className="w-64 sm:w-72 flex-shrink-0 bg-white border border-[#0B281B]/10 rounded-sm p-4 flex flex-col items-center text-center shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#EAF5F1] text-[#0B281B] flex items-center justify-center mb-3">
                <Phone className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#0B281B] mb-2">
                Direct Loom Contact
              </h3>
              <p className="text-xs font-sans text-[#1C2621]/85 leading-relaxed font-medium">
                +91 96662 28380<br />
                dlhandlooms.mangalagiri@gmail.com
              </p>
            </div>

            {/* Card 3: Pan-India Delivery */}
            <div className="w-64 sm:w-72 flex-shrink-0 bg-white border border-[#0B281B]/10 rounded-sm p-4 flex flex-col items-center text-center shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#EAF5F1] text-[#0B281B] flex items-center justify-center mb-3">
                <Truck className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#0B281B] mb-2">
                Pan-India Loom Delivery
              </h3>
              <p className="text-xs font-sans text-[#1C2621]/85 leading-relaxed font-medium">
                Fast &amp; Reliable direct-from-weaver delivery across all pin codes in India.
              </p>
            </div>
          </div>

          {/* Form Header */}
          <div className="text-center pt-2">
            <h2 className="font-sans font-bold text-lg sm:text-xl text-[#1C2621] mb-1">
              Connect with DL Handlooms
            </h2>
            <p className="text-xs sm:text-sm font-sans text-[#1C2621]/70 max-w-sm mx-auto">
              For loom inquiries, bulk orders, or custom weaving requirements, reach out below:
            </p>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-3 font-sans text-sm">
            {submitted && (
              <div className="bg-[#D8EEDF] text-[#13683A] p-3 rounded-xs text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Thank you! Our loom master will respond to your inquiry shortly.</span>
              </div>
            )}

            {/* First Name */}
            <div>
              <input
                type="text"
                placeholder="First name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-sm border border-[#1C2621]/20 bg-[#F9FBF9] text-[#1C2621] placeholder-[#1C2621]/40 focus:outline-hidden focus:border-[#0B281B]"
              />
            </div>

            {/* Last Name */}
            <div>
              <input
                type="text"
                placeholder="Last name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-sm border border-[#1C2621]/20 bg-[#F9FBF9] text-[#1C2621] placeholder-[#1C2621]/40 focus:outline-hidden focus:border-[#0B281B]"
              />
            </div>

            {/* Country Selector + Phone */}
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-sm border border-[#1C2621]/20 bg-[#F9FBF9]">
                <span className="text-base">🇮🇳</span>
                <span className="text-xs font-semibold text-[#1C2621]">▼</span>
              </div>
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#1C2621]/50 font-medium">
                  Phone +91
                </div>
                <input
                  type="tel"
                  placeholder=""
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-22 pr-3.5 py-2.5 rounded-sm border border-[#1C2621]/20 bg-[#F9FBF9] text-[#1C2621] focus:outline-hidden focus:border-[#0B281B]"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-sm border border-[#1C2621]/20 bg-[#F9FBF9] text-[#1C2621] placeholder-[#1C2621]/40 focus:outline-hidden focus:border-[#0B281B]"
              />
            </div>

            {/* Message */}
            <div>
              <textarea
                placeholder="Message (e.g. inquiry on Mangalagiri pattu or custom color)"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-sm border border-[#1C2621]/20 bg-[#F9FBF9] text-[#1C2621] placeholder-[#1C2621]/40 focus:outline-hidden focus:border-[#0B281B]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#0B281B] hover:bg-[#163C2A] text-white font-sans font-bold text-sm tracking-wider uppercase rounded-xs transition-colors shadow-md active:scale-99"
            >
              Submit Inquiry
            </button>
          </form>

        </div>
      </div>

      <Footer />
    </main>
  );
}
