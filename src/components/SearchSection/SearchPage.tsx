"use client";

import { useCallback, useState } from "react";
import FadeUp from "@/components/FadeUp";
import ResizableTable from "@/components/ResizableTable";
import SearchCard from "@/components/SearchSection/SearchCard";
import { useTabs } from "@/context/TabContext";
import { SEARCH_TABS, RESULTS_MAP } from "@/data/searchResults";
import type { SearchTab } from "@/types/search";

export default function SearchPage() {
  const { updateTabTitle } = useTabs();

  const [searchType, setSearchType] = useState<SearchTab>("advance");
  const [serialMap, setSerialMap] = useState<Record<SearchTab, string>>({
    advance: "",
    rma: "",
    production: "",
  });
  const [phoneMap, setPhoneMap] = useState<Record<SearchTab, string>>({
    advance: "",
    rma: "",
    production: "",
  });
  const [colWidths, setColWidths] = useState<Record<string, number>>({});

  const results = RESULTS_MAP[searchType];

  const handleTabChange = useCallback(
    (tab: SearchTab) => {
      setSearchType(tab);
      const label = SEARCH_TABS.find((t) => t.key === tab)?.label ?? "Search";
      updateTabTitle("/search", label);
    },
    [updateTabTitle],
  );

  const handleSerialChange = useCallback(
    (value: string) => {
      setSerialMap((prev) => ({ ...prev, [searchType]: value }));
    },
    [searchType],
  );

  const handlePhoneChange = useCallback(
    (value: string) => {
      setPhoneMap((prev) => ({ ...prev, [searchType]: value }));
    },
    [searchType],
  );

  const handleColResize = useCallback((colName: string, width: number) => {
    setColWidths((prev) => ({ ...prev, [colName]: width }));
  }, []);

  return (
    <div className="space-y-5 p-6">
      <FadeUp>
        <SearchCard
          tabs={SEARCH_TABS}
          activeTab={searchType}
          onTabChange={handleTabChange}
          serial={serialMap[searchType]}
          onSerialChange={handleSerialChange}
          phone={phoneMap[searchType]}
          onPhoneChange={handlePhoneChange}
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
