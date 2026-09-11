"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useTabs } from "@/context/TabContext";
import DashboardGreeting from "./DashboardGreeting";
import DashboardSlider from "./DashboardSlider";
import DashboardStats from "./DashboardStats";
import DashboardAnalytics from "./DashboardAnalytics";
import DashboardQuickActions from "./DashboardQuickActions";
import FadeUp from "@/components/FadeUp";
import { FiHeadphones, FiMessageCircle, FiPhoneCall, FiX } from "react-icons/fi";

export default function DashboardView() {
  
  const { data: session } = authClient.useSession();
  const { openTab } = useTabs();
  const [supportOpen, setSupportOpen] = useState(false);

  const userName = session?.user?.name || "VAYRON";

  const handleNewSale = () => {
    openTab({ path: "/sales/create", title: "Sales Entry" });
  };

  return (
    <div className="relative min-h-screen space-y-6 pb-12">
      {/* 1. TOP GREETING HEADER */}
      <FadeUp>
        <DashboardGreeting userName={userName} storeName="VAYRON" />
      </FadeUp>

      {/* 2. HERO PROMO SLIDER (Matching Reference Image) */}
      <FadeUp delay={100}>
        <DashboardSlider />
      </FadeUp>

      {/* 3. KEY METRICS STATS (5 Cards) */}
      <FadeUp delay={150}>
        <DashboardStats
          revenueToday="BDT 0"
          revenueMonth="BDT 0 this month"
          ordersToday={0}
          ordersMonth={0}
          activeProducts={1}
          totalCustomers={0}
          websiteVisits={1}
        />
      </FadeUp>

      {/* 4. REVENUE OVERVIEW & ORDERS BY STATUS */}
      <FadeUp delay={200}>
        <DashboardAnalytics onNewSale={handleNewSale} />
      </FadeUp>

      {/* 5. QUICK ERP OPERATIONS */}
      <FadeUp delay={250}>
        <DashboardQuickActions />
      </FadeUp>

      {/* 6. FLOATING SUPPORT BUTTON (Matching the headphone icon in the screenshot) */}
      <div className="fixed bottom-6 right-6 z-40">
        {supportOpen && (
          <div className="mb-3 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="text-xs font-bold text-slate-800">Customer Care & Support</h4>
              </div>
              <button
                type="button"
                onClick={() => setSupportOpen(false)}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 space-y-2">
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-emerald-50/60 p-2.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100/60"
              >
                <FiMessageCircle className="h-4 w-4 text-emerald-600" />
                <span>Instant WhatsApp Support</span>
              </a>

              <a
                href="tel:+8801700000000"
                className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-indigo-50/60 p-2.5 text-xs font-semibold text-indigo-800 transition hover:bg-indigo-100/60"
              >
                <FiPhoneCall className="h-4 w-4 text-indigo-600" />
                <span>Call Helpdesk (+880)</span>
              </a>
            </div>

            <p className="mt-2.5 text-center text-[10px] text-slate-400">
              TechBasket Priority Support • 24/7 Available
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => setSupportOpen(!supportOpen)}
          className="relative flex h-13 w-13 items-center justify-center rounded-2xl bg-[#6f2dbd] text-white shadow-lg shadow-purple-600/30 transition hover:scale-105 active:scale-95"
          aria-label="Customer Support"
        >
          <FiHeadphones className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
          </span>
        </button>
      </div>
    </div>
  );
}
