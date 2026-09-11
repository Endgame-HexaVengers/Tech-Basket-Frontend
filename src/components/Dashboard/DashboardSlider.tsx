"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { BiLaptop } from "react-icons/bi";

interface SlideData {
  id: number;
  badge?: string;
  tagline: string;
  brandName: string;
  brandColor: string;
  tags: string[];
  bgGradient: string;
  type: "theme" | "inventory" | "pos";
}

const SLIDES: SlideData[] = [
  {
    id: 1,
    tagline: "এসে গেল নতুন থিম !",
    brandName: "Sellorá",
    brandColor: "text-[#d94a4a]",
    tags: ["Fashion", "Boutiques", "Clothing", "E-commerce", "Attire"],
    bgGradient: "from-[#f8f9fb] via-[#f1f3f7] to-[#e8edf4]",
    type: "theme",
  },
  {
    id: 2,
    badge: "AI Powered",
    tagline: "স্মার্ট ইনভেন্টরি ও এআই ট্র্যাকিং !",
    brandName: "AutoStock",
    brandColor: "text-indigo-600",
    tags: ["Real-time Stock", "Barcode Scan", "Serial RMA", "AI Forecast", "Multi-Branch"],
    bgGradient: "from-[#f5f8ff] via-[#edf2fc] to-[#e2ebfa]",
    type: "inventory",
  },
  {
    id: 3,
    badge: "POS Ready",
    tagline: "দ্রুত সেলস ও চালান জেনারেটর !",
    brandName: "QuickInvoice",
    brandColor: "text-emerald-600",
    tags: ["POS Counter", "Courier API", "Instant PDF", "Barcodes", "Delivery Sync"],
    bgGradient: "from-[#f4fbf7] via-[#ebf7f1] to-[#def2e7]",
    type: "pos",
  },
];

export default function DashboardSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5500);

    return () => clearInterval(timer);
  }, [isHovered, nextSlide]);

  const slide = SLIDES[currentSlide];

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-r shadow-xs transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ minHeight: "340px" }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className={`relative flex min-h-[340px] w-full flex-col items-center justify-between bg-gradient-to-r ${slide.bgGradient} p-6 sm:flex-row sm:p-8 lg:px-12`}
        >
          {/* LEFT SIDE: Realistic Multi-Screen & Laptop Mockup */}
          <div className="relative flex w-full items-center justify-center py-4 sm:w-1/2 lg:w-7/12">
            {/* Background ambient lighting */}
            <div className="absolute -left-6 top-1/2 h-44 w-44 -translate-y-1/2 rounded-full bg-white/60 blur-2xl" />

            {slide.type === "theme" && (
              <div className="relative flex items-center justify-center">
                {/* Back Left Window Mockup */}
                <div className="absolute -left-6 -top-4 hidden h-44 w-40 rotate-[-5deg] rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-lg md:block">
                  <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-400" />
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="ml-2 text-[9px] font-medium text-slate-400">Best Sellers</span>
                  </div>
                  <div className="mt-2 space-y-1.5">
                    <div className="h-20 w-full rounded-md bg-gradient-to-tr from-rose-100 via-amber-50 to-pink-100 p-2 flex flex-col justify-end">
                      <span className="text-[10px] font-bold text-slate-800">Summer Drop</span>
                      <span className="text-[8px] text-rose-600 font-semibold">৳ 1,450</span>
                    </div>
                    <div className="h-2 w-3/4 rounded bg-slate-200" />
                    <div className="h-2 w-1/2 rounded bg-slate-100" />
                  </div>
                </div>

                {/* Back Right Window Mockup */}
                <div className="absolute -right-4 -top-5 hidden h-48 w-44 rotate-[4deg] rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-lg md:block">
                  <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-400" />
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="ml-2 text-[9px] font-medium text-slate-400">New Arrival Sale</span>
                  </div>
                  <div className="mt-2 space-y-2">
                    <div className="h-24 w-full rounded-md bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 p-2 flex flex-col justify-between">
                      <span className="rounded bg-black/70 px-1.5 py-0.5 text-[8px] font-bold text-white w-fit">20% OFF</span>
                      <span className="text-[9px] font-bold text-slate-800">Boutique Collection</span>
                    </div>
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[9px] font-bold text-slate-700">৳ 2,890</span>
                      <span className="text-[8px] text-slate-400">In stock</span>
                    </div>
                  </div>
                </div>

                {/* Center Main Laptop Mockup */}
                <div className="relative z-10 w-64 sm:w-80 md:w-96 rounded-xl border border-slate-300/80 bg-slate-900 p-2 shadow-2xl">
                  {/* Laptop Camera dot */}
                  <div className="mb-1.5 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                  </div>
                  {/* Laptop Screen Content */}
                  <div className="relative overflow-hidden rounded-lg bg-white p-3 shadow-inner">
                    {/* Header nav inside screen */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold tracking-tight text-slate-900">Sellora</span>
                        <span className="hidden sm:inline-block rounded-full bg-rose-50 px-1.5 py-0.2 text-[8px] font-bold text-rose-600">New Theme</span>
                      </div>
                      <div className="flex items-center gap-2 text-[9px] text-slate-500">
                        <span className="font-semibold text-slate-800">Home</span>
                        <span>Shop</span>
                        <span>Lookbook</span>
                      </div>
                    </div>

                    {/* Hero Banner inside screen */}
                    <div className="mt-2.5 flex items-center justify-between rounded-lg bg-gradient-to-r from-stone-100 via-rose-50 to-amber-50 p-3">
                      <div>
                        <span className="rounded-full bg-white/80 px-2 py-0.5 text-[8px] font-semibold text-rose-600 shadow-2xs">
                          Fashion Edition
                        </span>
                        <h4 className="mt-1 text-xs font-black text-slate-900 sm:text-sm">
                          Summer Style 2026
                        </h4>
                        <p className="text-[9px] text-slate-500">
                          Curated elegant attire for modern lifestyles
                        </p>
                        <button
                          type="button"
                          className="mt-2 inline-flex items-center gap-1 rounded bg-slate-900 px-2 py-1 text-[9px] font-medium text-white shadow-2xs"
                        >
                          View Collection
                        </button>
                      </div>

                      {/* Screen Fashion Palette / Mini graphic */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="h-16 w-14 rounded-md bg-gradient-to-tr from-amber-200 via-rose-200 to-indigo-200 shadow-xs flex items-center justify-center">
                          <span className="text-lg">👗</span>
                        </div>
                        <div className="flex gap-1">
                          <span className="h-2 w-2 rounded-full bg-rose-400" />
                          <span className="h-2 w-2 rounded-full bg-amber-400" />
                          <span className="h-2 w-2 rounded-full bg-slate-800" />
                        </div>
                      </div>
                    </div>

                    {/* Mini product row inside screen */}
                    <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                      <div className="rounded bg-slate-50 p-1.5 border border-slate-100">
                        <div className="h-6 w-full rounded bg-rose-100/60 flex items-center justify-center text-[10px]">✨</div>
                        <p className="mt-1 truncate text-[8px] font-semibold text-slate-700">Silk Kurti</p>
                        <p className="text-[7px] text-rose-600 font-bold">৳ 1,850</p>
                      </div>
                      <div className="rounded bg-slate-50 p-1.5 border border-slate-100">
                        <div className="h-6 w-full rounded bg-amber-100/60 flex items-center justify-center text-[10px]">🌿</div>
                        <p className="mt-1 truncate text-[8px] font-semibold text-slate-700">Linen Co-ord</p>
                        <p className="text-[7px] text-amber-600 font-bold">৳ 2,400</p>
                      </div>
                      <div className="rounded bg-slate-50 p-1.5 border border-slate-100">
                        <div className="h-6 w-full rounded bg-indigo-100/60 flex items-center justify-center text-[10px]">🌸</div>
                        <p className="mt-1 truncate text-[8px] font-semibold text-slate-700">Cotton Tunic</p>
                        <p className="text-[7px] text-indigo-600 font-bold">৳ 1,290</p>
                      </div>
                    </div>
                  </div>

                  {/* Laptop Base Stand */}
                  <div className="relative -bottom-2.5 mx-auto h-2 w-32 rounded-b-lg bg-slate-700 shadow-md" />
                </div>
              </div>
            )}

            {slide.type === "inventory" && (
              <div className="relative z-10 w-full max-w-sm rounded-2xl border border-indigo-200/80 bg-white p-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs">
                      AI
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Inventory Health</h4>
                      <p className="text-[9px] text-slate-400">Real-time smart analysis</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                    94% Healthy
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2">
                    <span className="text-xs font-medium text-slate-700">Stock Reorder Alerts</span>
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">2 Items</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2">
                    <span className="text-xs font-medium text-slate-700">RMA Warranty Claims</span>
                    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">0 Pending</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2">
                    <span className="text-xs font-medium text-slate-700">Automated Barcode Sync</span>
                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">Active</span>
                  </div>
                </div>
              </div>
            )}

            {slide.type === "pos" && (
              <div className="relative z-10 w-full max-w-sm rounded-2xl border border-emerald-200/80 bg-white p-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs">
                      POS
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Fast Sales Terminal</h4>
                      <p className="text-[9px] text-slate-400">Multi-branch checkout</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                    Online
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-center">
                    <p className="text-[10px] text-slate-500 font-medium">Daily Invoices</p>
                    <p className="text-base font-bold text-slate-900">42 Orders</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-center">
                    <p className="text-[10px] text-slate-500 font-medium">Dispatch Time</p>
                    <p className="text-base font-bold text-emerald-600">~ 12 Mins</p>
                  </div>
                </div>

                <div className="mt-2.5 rounded-lg bg-emerald-50/70 p-2 text-center text-xs font-semibold text-emerald-800">
                  Ready for instant courier booking & PDF slip printing
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDE: Typography & Tag Chips matching screenshot */}
          <div className="relative z-10 flex w-full flex-col items-center text-center sm:w-1/2 sm:items-start sm:text-left lg:w-5/12 sm:pl-6">
            {slide.badge && (
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-slate-700 shadow-2xs backdrop-blur-xs">
                <HiSparkles className="text-amber-500" />
                {slide.badge}
              </span>
            )}

            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              {slide.tagline}
            </h2>

            <div className="mt-1 flex items-center justify-center sm:justify-start gap-2">
              <span
                className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold italic tracking-tight ${slide.brandColor}`}
                style={{ fontFamily: "cursive, system-ui, sans-serif" }}
              >
                {slide.brandName}
              </span>
              {/* Red checkmark doodle matching screenshot */}
              <span className="text-2xl sm:text-3xl font-black text-red-500 select-none">
                ✓
              </span>
            </div>

            {/* Tag Pills matching screenshot */}
            <div className="mt-5 flex flex-wrap justify-center sm:justify-start gap-2">
              {slide.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-200/90 bg-white/90 px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs backdrop-blur-xs transition hover:border-slate-300 hover:bg-white"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next Navigation Arrows (appear on hover) */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-slate-200/80 bg-white/90 p-2 text-slate-700 shadow-md backdrop-blur-xs opacity-0 transition group-hover:opacity-100 hover:bg-white hover:scale-110 active:scale-95"
      >
        <FiChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-slate-200/80 bg-white/90 p-2 text-slate-700 shadow-md backdrop-blur-xs opacity-0 transition group-hover:opacity-100 hover:bg-white hover:scale-110 active:scale-95"
      >
        <FiChevronRight className="h-5 w-5" />
      </button>

      {/* Bottom Pagination Dots (Matching screenshot pill + dots) */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/60 px-3 py-1.5 backdrop-blur-xs shadow-2xs">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`transition-all duration-300 ${
              currentSlide === index
                ? "h-2 w-6 rounded-full bg-slate-700"
                : "h-2 w-2 rounded-full bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
