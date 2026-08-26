"use client";

import { useCallback, useState } from "react";
import FadeUp from "@/components/FadeUp";
import ResizableTable from "@/components/ResizableTable";
import SearchCard from "@/components/SearchSection/SearchCard";
import { SEARCH_TABS, RESULTS_MAP } from "@/data/searchResults";
import type { SearchTab } from "@/types/search";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<SearchTab>("advance");
  const [serial, setSerial] = useState("");
  const [phone, setPhone] = useState("");
  const [colWidths, setColWidths] = useState<Record<string, number>>({});

  const results = RESULTS_MAP[activeTab];

  const handleColResize = useCallback((colName: string, width: number) => {
    setColWidths((prev) => ({ ...prev, [colName]: width }));
  }, []);

  return (
    <div className="space-y-5 p-6">
      <FadeUp>
        <SearchCard
          tabs={SEARCH_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          serial={serial}
          onSerialChange={setSerial}
          phone={phone}
          onPhoneChange={setPhone}
        />
      </FadeUp>

      {results.map((section) => (
        <FadeUp key={section.title}>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-slate-50 px-4 py-2.5">
              <span className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                {section.title}
              </span>
            </div>
            <ResizableTable
              columns={section.columns}
              rows={section.rows}
              colWidths={colWidths}
              onColResize={handleColResize}
            />
          </div>
        </FadeUp>
      ))}
    </div>
  );
}