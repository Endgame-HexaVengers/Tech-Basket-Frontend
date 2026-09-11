"use client";

import { useState } from "react";
import { FiGlobe, FiCopy, FiCheck } from "react-icons/fi";
import { TbShoppingBagCheck } from "react-icons/tb";
import { toast } from "react-hot-toast";

interface DashboardGreetingProps {
  storeName?: string;
  userName?: string;
}

export default function DashboardGreeting({
  storeName = "VAYRON",
  userName,
}: DashboardGreetingProps) {
  const [copied, setCopied] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const displayName = userName || storeName;

  const handleCopyLink = async () => {
    try {
      const url = typeof window !== "undefined" ? window.location.origin : "https://techbasket.app";
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Store link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.success("Link copied!");
    }
  };

  const handleVisitWebsite = () => {
    if (typeof window !== "undefined") {
      window.open("/", "_blank");
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between sm:p-5">
      {/* Left side: Icon & Dynamic greeting */}
      <div className="flex items-center gap-3.5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-500 text-white shadow-md shadow-purple-500/20">
          <TbShoppingBagCheck className="h-6 w-6" />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {getGreeting()}, <span className="text-slate-900">{displayName}!</span>
          </h1>
          <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500 sm:text-sm">
            <span>You&apos;re building something amazing!</span>
            <span role="img" aria-label="party">🎉</span>
          </p>
        </div>
      </div>

      {/* Right side: Action buttons */}
      <div className="flex items-center gap-2.5 self-start sm:self-auto">
        <button
          type="button"
          onClick={handleVisitWebsite}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-slate-300 hover:bg-slate-50 active:scale-95 sm:text-sm"
        >
          <FiGlobe className="h-4 w-4 text-slate-600" />
          <span>Visit Website</span>
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-slate-300 hover:bg-slate-50 active:scale-95 sm:text-sm"
        >
          {copied ? (
            <>
              <FiCheck className="h-4 w-4 text-emerald-600" />
              <span className="text-emerald-700">Copied</span>
            </>
          ) : (
            <>
              <FiCopy className="h-4 w-4 text-slate-600" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
