"use client";

import { Search } from "lucide-react";
import type { SearchTab, SearchTabConfig } from "@/types/search";

type SearchCardProps = {
  tabs: SearchTabConfig[];
  activeTab: SearchTab;
  onTabChange: (tab: SearchTab) => void;
  serial: string;
  onSerialChange: (value: string) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
};

export default function SearchCard({
  tabs,
  activeTab,
  onTabChange,
  serial,
  onSerialChange,
  phone,
  onPhoneChange,
}: SearchCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-evenly border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "border-b-2 border-[#00175c] text-[#00175c]"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex items-end gap-3">
        <div className="flex-1 space-y-1.5">
          <label className="text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Serial Number
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
            <input
              type="text"
              value={serial}
              onChange={(e) => onSerialChange(e.target.value)}
              placeholder="Enter serial number"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {activeTab === "rma" && (
          <div className="flex-1 space-y-1.5">
            <label className="text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Phone Number
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
              <input
                type="text"
                value={phone}
                onChange={(e) => onPhoneChange(e.target.value)}
                placeholder="Enter phone number"
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        )}

        <button
          type="button"
          className="flex h-[38px] items-center justify-center gap-2 rounded-lg bg-[#00175c] px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#000f3d] active:scale-[0.98]"
        >
          <Search className="h-3.5 w-3.5" />
          Search
        </button>
      </div>
    </div>
  );
}
