"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

interface SlideData {
  id: number;
  badge?: string;
  tagline: string;
  brandName: string;
  brandColor: string;
  tags: string[];
  bgGradient: string;
  type: "theme" | "inventory" | "pos" | "analytics";
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
    tags: [
      "Real-time Stock",
      "Barcode Scan",
      "Serial RMA",
      "AI Forecast",
      "Multi-Branch",
    ],
    bgGradient: "from-[#f5f8ff] via-[#edf2fc] to-[#e2ebfa]",
    type: "inventory",
  },
  {
    id: 3,
    badge: "POS Ready",
    tagline: "দ্রুত সেলস ও চালান জেনারেটর !",
    brandName: "QuickInvoice",
    brandColor: "text-emerald-600",
    tags: [
      "POS Counter",
      "Courier API",
      "Instant PDF",
      "Barcodes",
      "Delivery Sync",
    ],
    bgGradient: "from-[#f4fbf7] via-[#ebf7f1] to-[#def2e7]",
    type: "pos",
  },
  {
    id: 4,
    badge: "Business Intelligence",
    tagline: "আপনার ব্যবসার সব তথ্য এক নজরে !",
    brandName: "InsightPro",
    brandColor: "text-violet-600",
    tags: [
      "Sales Analytics",
      "Revenue Reports",
      "Stock Insights",
      "Profit Tracking",
      "Smart Reports",
    ],
    bgGradient: "from-[#faf7ff] via-[#f3edfc] to-[#e8def8]",
    type: "analytics",
  },
];

export default function DashboardSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide(
      (prev) => (prev - 1 + SLIDES.length) % SLIDES.length,
    );
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
          {/* LEFT SIDE */}
          <div className="relative flex w-full items-center justify-center py-4 sm:w-1/2 lg:w-7/12">
            <div className="absolute -left-6 top-1/2 h-44 w-44 -translate-y-1/2 rounded-full bg-white/60 blur-2xl" />

            {/* THEME */}
            {slide.type === "theme" && (
              <div className="relative flex items-center justify-center">
                {/* Back Left Window */}
                <div className="absolute -left-6 -top-4 hidden h-44 w-40 rotate-[-5deg] rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-lg md:block">
                  <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-400" />
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="ml-2 text-[9px] font-medium text-slate-400">
                      Best Sellers
                    </span>
                  </div>

                  <div className="mt-2 space-y-1.5">
                    <div className="flex h-20 w-full flex-col justify-end rounded-md bg-gradient-to-tr from-rose-100 via-amber-50 to-pink-100 p-2">
                      <span className="text-[10px] font-bold text-slate-800">
                        Summer Drop
                      </span>
                      <span className="text-[8px] font-semibold text-rose-600">
                        ৳ 1,450
                      </span>
                    </div>

                    <div className="h-2 w-3/4 rounded bg-slate-200" />
                    <div className="h-2 w-1/2 rounded bg-slate-100" />
                  </div>
                </div>

                {/* Back Right Window */}
                <div className="absolute -right-4 -top-5 hidden h-48 w-44 rotate-[4deg] rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-lg md:block">
                  <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-400" />
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="ml-2 text-[9px] font-medium text-slate-400">
                      New Arrival Sale
                    </span>
                  </div>

                  <div className="mt-2 space-y-2">
                    <div className="flex h-24 w-full flex-col justify-between rounded-md bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 p-2">
                      <span className="w-fit rounded bg-black/70 px-1.5 py-0.5 text-[8px] font-bold text-white">
                        20% OFF
                      </span>

                      <span className="text-[9px] font-bold text-slate-800">
                        Boutique Collection
                      </span>
                    </div>

                    <div className="flex items-center justify-between px-1">
                      <span className="text-[9px] font-bold text-slate-700">
                        ৳ 2,890
                      </span>

                      <span className="text-[8px] text-slate-400">
                        In stock
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main Laptop */}
                <div className="relative z-10 w-64 rounded-xl border border-slate-300/80 bg-slate-900 p-2 shadow-2xl sm:w-80 md:w-96">
                  <div className="mb-1.5 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                  </div>

                  <div className="relative overflow-hidden rounded-lg bg-white p-3 shadow-inner">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold tracking-tight text-slate-900">
                          Sellora
                        </span>

                        <span className="hidden rounded-full bg-rose-50 px-1.5 py-0.5 text-[8px] font-bold text-rose-600 sm:inline-block">
                          New Theme
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[9px] text-slate-500">
                        <span className="font-semibold text-slate-800">
                          Home
                        </span>
                        <span>Shop</span>
                        <span>Lookbook</span>
                      </div>
                    </div>

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

                      <div className="flex flex-col items-center gap-1">
                        <div className="flex h-16 w-14 items-center justify-center rounded-md bg-gradient-to-tr from-amber-200 via-rose-200 to-indigo-200 shadow-xs">
                          <span className="text-lg">👗</span>
                        </div>

                        <div className="flex gap-1">
                          <span className="h-2 w-2 rounded-full bg-rose-400" />
                          <span className="h-2 w-2 rounded-full bg-amber-400" />
                          <span className="h-2 w-2 rounded-full bg-slate-800" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                      <div className="rounded border border-slate-100 bg-slate-50 p-1.5">
                        <div className="flex h-6 w-full items-center justify-center rounded bg-rose-100/60 text-[10px]">
                          ✨
                        </div>
                        <p className="mt-1 truncate text-[8px] font-semibold text-slate-700">
                          Silk Kurti
                        </p>
                        <p className="text-[7px] font-bold text-rose-600">
                          ৳ 1,850
                        </p>
                      </div>

                      <div className="rounded border border-slate-100 bg-slate-50 p-1.5">
                        <div className="flex h-6 w-full items-center justify-center rounded bg-amber-100/60 text-[10px]">
                          🌿
                        </div>
                        <p className="mt-1 truncate text-[8px] font-semibold text-slate-700">
                          Linen Co-ord
                        </p>
                        <p className="text-[7px] font-bold text-amber-600">
                          ৳ 2,400
                        </p>
                      </div>

                      <div className="rounded border border-slate-100 bg-slate-50 p-1.5">
                        <div className="flex h-6 w-full items-center justify-center rounded bg-indigo-100/60 text-[10px]">
                          🌸
                        </div>
                        <p className="mt-1 truncate text-[8px] font-semibold text-slate-700">
                          Cotton Tunic
                        </p>
                        <p className="text-[7px] font-bold text-indigo-600">
                          ৳ 1,290
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="relative -bottom-2.5 mx-auto h-2 w-32 rounded-b-lg bg-slate-700 shadow-md" />
                </div>
              </div>
            )}

            {/* INVENTORY */}
            {slide.type === "inventory" && (
              <div className="relative z-10 w-full max-w-sm rounded-2xl border border-indigo-200/80 bg-white p-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-700">
                      AI
                    </span>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Inventory Health
                      </h4>

                      <p className="text-[9px] text-slate-400">
                        Real-time smart analysis
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                    94% Healthy
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2">
                    <span className="text-xs font-medium text-slate-700">
                      Stock Reorder Alerts
                    </span>

                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                      2 Items
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2">
                    <span className="text-xs font-medium text-slate-700">
                      RMA Warranty Claims
                    </span>

                    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">
                      0 Pending
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2">
                    <span className="text-xs font-medium text-slate-700">
                      Automated Barcode Sync
                    </span>

                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* POS */}
            {slide.type === "pos" && (
              <div className="relative z-10 w-full max-w-sm rounded-2xl border border-emerald-200/80 bg-white p-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-700">
                      POS
                    </span>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Fast Sales Terminal
                      </h4>

                      <p className="text-[9px] text-slate-400">
                        Multi-branch checkout
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                    Online
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-center">
                    <p className="text-[10px] font-medium text-slate-500">
                      Daily Invoices
                    </p>

                    <p className="text-base font-bold text-slate-900">
                      42 Orders
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-center">
                    <p className="text-[10px] font-medium text-slate-500">
                      Dispatch Time
                    </p>

                    <p className="text-base font-bold text-emerald-600">
                      ~ 12 Mins
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 rounded-lg bg-emerald-50/70 p-2 text-center text-xs font-semibold text-emerald-800">
                  Ready for instant courier booking & PDF slip printing
                </div>
              </div>
            )}

            {/* ANALYTICS */}
            {slide.type === "analytics" && (
              <div className="relative z-10 w-full max-w-sm rounded-2xl border border-violet-200/80 bg-white p-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-xs font-bold text-violet-700">
                      BI
                    </span>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Business Analytics
                      </h4>

                      <p className="text-[9px] text-slate-400">
                        Smart business overview
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[9px] font-bold text-violet-700">
                    Live Data
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                    <p className="text-[10px] font-medium text-slate-500">
                      Revenue
                    </p>

                    <p className="mt-0.5 text-base font-bold text-slate-900">
                      ৳ 24.8K
                    </p>

                    <span className="text-[9px] font-semibold text-emerald-600">
                      +18.4%
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                    <p className="text-[10px] font-medium text-slate-500">
                      Orders
                    </p>

                    <p className="mt-0.5 text-base font-bold text-slate-900">
                      186
                    </p>

                    <span className="text-[9px] font-semibold text-emerald-600">
                      +12.8%
                    </span>
                  </div>
                </div>

                <div className="mt-2.5 rounded-xl bg-violet-50 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-violet-800">
                      Monthly Performance
                    </span>

                    <span className="text-[9px] font-bold text-violet-600">
                      82%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-violet-100">
                    <div className="h-full w-[82%] rounded-full bg-violet-500" />
                  </div>
                </div>

                <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                  <div className="rounded-lg bg-emerald-50 p-2 text-center">
                    <p className="text-[8px] text-slate-500">Profit</p>
                    <p className="text-[10px] font-bold text-emerald-700">
                      +24%
                    </p>
                  </div>

                  <div className="rounded-lg bg-amber-50 p-2 text-center">
                    <p className="text-[8px] text-slate-500">Stock</p>
                    <p className="text-[10px] font-bold text-amber-700">
                      91%
                    </p>
                  </div>

                  <div className="rounded-lg bg-blue-50 p-2 text-center">
                    <p className="text-[8px] text-slate-500">Growth</p>
                    <p className="text-[10px] font-bold text-blue-700">
                      +16%
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="relative z-10 flex w-full flex-col items-center text-center sm:w-1/2 sm:items-start sm:pl-6 sm:text-left lg:w-5/12">
            {slide.badge && (
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-slate-700 shadow-2xs backdrop-blur-xs">
                <HiSparkles className="text-amber-500" />
                {slide.badge}
              </span>
            )}

            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              {slide.tagline}
            </h2>

            <div className="mt-1 flex items-center justify-center gap-2 sm:justify-start">
              <span
                className={`text-3xl font-extrabold italic tracking-tight sm:text-4xl lg:text-5xl ${slide.brandColor}`}
                style={{
                  fontFamily: "cursive, system-ui, sans-serif",
                }}
              >
                {slide.brandName}
              </span>

              <span className="select-none text-2xl font-black text-red-500 sm:text-3xl">
                ✓
              </span>
            </div>

            {/* TAGS */}
            <div className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">
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

      {/* PREVIOUS BUTTON */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-slate-200/80 bg-white/90 p-2 text-slate-700 opacity-0 shadow-md backdrop-blur-xs transition group-hover:opacity-100 hover:scale-110 hover:bg-white active:scale-95"
      >
        <FiChevronLeft className="h-5 w-5" />
      </button>

      {/* NEXT BUTTON */}
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-slate-200/80 bg-white/90 p-2 text-slate-700 opacity-0 shadow-md backdrop-blur-xs transition group-hover:opacity-100 hover:scale-110 hover:bg-white active:scale-95"
      >
        <FiChevronRight className="h-5 w-5" />
      </button>

      {/* PAGINATION */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/60 px-3 py-1.5 shadow-2xs backdrop-blur-xs">
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