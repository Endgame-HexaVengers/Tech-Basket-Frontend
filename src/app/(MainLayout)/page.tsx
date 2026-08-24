"use client";

import { useCallback, useRef, useState } from "react";
import { Search } from "lucide-react";
import FadeUp from "@/components/FadeUp";

type SearchTab = "advance" | "rma" | "production";

const SEARCH_TABS: { key: SearchTab; label: string }[] = [
  { key: "advance", label: "Advance Search" },
  { key: "rma", label: "RMA Search" },
  { key: "production", label: "Production Search" },
];

type ResultSection = {
  title: string;
  columns: string[];
  rows: string[][];
};

const ADVANCE_RESULTS: ResultSection[] = [
  {
    title: "Import Product",
    columns: ["Import Product Inv", "Date", "Product Title", "Serial", "Importer Name"],
    rows: [
      ["IMP-2026-001", "2026-01-15", "iPhone 15 Pro Max", "SN-10001", "Rahim Uddin"],
      ["IMP-2026-002", "2026-02-20", "Samsung Galaxy S24", "SN-10002", "Karim Ahmed"],
    ],
  },
  {
    title: "Purchase",
    columns: ["Purchase Inv", "Date", "Product Title", "Serial", "Supplier Name"],
    rows: [
      ["PUR-2026-001", "2026-03-10", "MacBook Air M3", "SN-20001", "Tech Distributors Ltd"],
      ["PUR-2026-002", "2026-04-05", "Dell XPS 15", "SN-20002", "Global IT Supply"],
    ],
  },
  {
    title: "Customer",
    columns: ["Customer Inv", "Date", "Product Title", "Serial", "Warranty Days"],
    rows: [
      ["CUS-2026-001", "2026-05-12", "iPad Air", "SN-30001", "365"],
      ["CUS-2026-002", "2026-06-18", "HP Pavilion 15", "SN-30002", "730"],
    ],
  },
  {
    title: "Sales Return",
    columns: ["Sales Return Inv", "Date", "Product Title", "Serial", "Reason"],
    rows: [
      ["RET-2026-001", "2026-07-01", "Lenovo ThinkPad X1", "SN-40001", "Screen defect"],
      ["RET-2026-002", "2026-07-15", "ASUS ROG Strix", "SN-40002", "Battery issue"],
    ],
  },
];

const RMA_RESULTS: ResultSection[] = [
  {
    title: "Import Product",
    columns: ["Import Product Inv", "Date", "Product Title", "Serial", "Importer Name"],
    rows: [
      ["IMP-2026-010", "2026-01-20", "iPhone 14", "SN-50001", "Sakib Hasan"],
    ],
  },
  {
    title: "Purchase",
    columns: ["Purchase Inv", "Date", "Product Title", "Serial", "Supplier Name"],
    rows: [
      ["PUR-2026-010", "2026-02-25", "Sony WH-1000XM5", "SN-60001", "Audio Tech BD"],
    ],
  },
  {
    title: "Customer",
    columns: ["Customer Inv", "Date", "Product Title", "Serial", "Warranty Days"],
    rows: [
      ["CUS-2026-010", "2026-03-30", "Google Pixel 8", "SN-70001", "180"],
    ],
  },
  {
    title: "Complain Received",
    columns: ["Complain Received Inv", "Date", "Product Title", "Serial", "Product Problem/Remarks"],
    rows: [
      ["CMP-2026-001", "2026-04-10", "OnePlus 12", "SN-80001", "Display flickering issue"],
      ["CMP-2026-002", "2026-05-22", "Xiaomi 14", "SN-80002", "Charging port not working"],
    ],
  },
  {
    title: "Delivery Info",
    columns: ["Delivery Inv", "Date", "Product Title", "Old Serial", "New Serial"],
    rows: [
      ["DLV-2026-001", "2026-05-01", "OnePlus 12", "SN-80001", "SN-80101"],
    ],
  },
  {
    title: "Replacement Out to Supplier",
    columns: ["Replacement Out Inv", "Date", "Product Title", "Serial", "Supplier Name"],
    rows: [
      ["RPO-2026-001", "2026-05-05", "OnePlus 12", "SN-80001", "OnePlus Service BD"],
    ],
  },
  {
    title: "Replacement In",
    columns: ["Replacement In Inv", "Date", "Product Title", "Old SN", "New SN"],
    rows: [
      ["RPI-2026-001", "2026-05-15", "OnePlus 12", "SN-80001", "SN-80201"],
    ],
  },
];

const PRODUCTION_RESULTS: ResultSection[] = [
  {
    title: "Import Product",
    columns: ["Import Product Inv", "Date", "Product Title", "Serial", "Importer Name", "Country", "Quantity"],
    rows: [
      ["IMP-2026-020", "2026-01-10", "iPhone 15", "SN-90001", "Nabil Imports", "USA", "50"],
      ["IMP-2026-021", "2026-02-14", "Galaxy Watch 6", "SN-90002", "Trade Corp", "Korea", "120"],
    ],
  },
  {
    title: "International Warranty",
    columns: ["Warranty Inv", "Date", "Product Title", "Serial", "Warranty Provider", "Expiry Date", "Status"],
    rows: [
      ["WRN-2026-001", "2026-03-01", "iPhone 15", "SN-90001", "Apple Global", "2027-03-01", "Active"],
      ["WRN-2026-002", "2026-04-20", "Galaxy Watch 6", "SN-90002", "Samsung Warranty", "2027-04-20", "Active"],
    ],
  },
];

const RESULTS_MAP: Record<SearchTab, ResultSection[]> = {
  advance: ADVANCE_RESULTS,
  rma: RMA_RESULTS,
  production: PRODUCTION_RESULTS,
};

/* =====================================================
   RESIZABLE TABLE COMPONENT
===================================================== */

function ResizableTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: string[][];
}) {
  const [colWidths, setColWidths] = useState<number[]>(
    () => columns.map(() => 150),
  );
  const [bodyHeight, setBodyHeight] = useState(48);
  const resizingCol = useRef<{ index: number; startX: number; startWidth: number } | null>(null);
  const resizingRow = useRef<{ startY: number; startHeight: number } | null>(null);

  const onColResizeStart = useCallback(
    (index: number, e: React.MouseEvent) => {
      e.preventDefault();
      resizingCol.current = { index, startX: e.clientX, startWidth: colWidths[index] };

      const onMouseMove = (ev: MouseEvent) => {
        if (!resizingCol.current) return;
        const diff = ev.clientX - resizingCol.current.startX;
        const newWidth = Math.max(80, resizingCol.current.startWidth + diff);
        setColWidths((prev) => {
          const next = [...prev];
          next[resizingCol.current!.index] = newWidth;
          return next;
        });
      };

      const onMouseUp = () => {
        resizingCol.current = null;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [colWidths],
  );

  const onRowResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      resizingRow.current = { startY: e.clientY, startHeight: bodyHeight };

      const onMouseMove = (ev: MouseEvent) => {
        if (!resizingRow.current) return;
        const diff = ev.clientY - resizingRow.current.startY;
        const newHeight = Math.max(48, Math.min(600, resizingRow.current.startHeight + diff));
        setBodyHeight(newHeight);
      };

      const onMouseUp = () => {
        resizingRow.current = null;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [bodyHeight],
  );

  return (
    <div className="overflow-x-auto">
      {/* Header table - fixed */}
      <table className="w-full text-center" style={{ tableLayout: "fixed" }}>
        <colgroup>
          {colWidths.map((w, i) => (
            <col key={i} style={{ width: w }} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80">
            {columns.map((col, i) => (
              <th
                key={col}
                className="group relative whitespace-nowrap px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                <span className="pr-3">{col}</span>
                <span
                  onMouseDown={(e) => onColResizeStart(i, e)}
                  className="absolute right-0 top-0 z-10 h-full w-1.5 cursor-col-resize bg-transparent transition hover:bg-blue-400"
                />
              </th>
            ))}
          </tr>
        </thead>
      </table>

      {/* Body table - scrollable with Y resize */}
      <div className="relative overflow-y-auto" style={{ maxHeight: bodyHeight }}>
        <table className="w-full text-center" style={{ tableLayout: "fixed" }}>
          <colgroup>
            {colWidths.map((w, i) => (
              <col key={i} style={{ width: w }} />
            ))}
          </colgroup>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-50/60">
                {row.map((cell, cellIndex) => {
                  const colName = columns[cellIndex];
                  const isInvField = colName?.includes("Inv");

                  return (
                    <td
                      key={cellIndex}
                      className="whitespace-nowrap px-5 py-3 text-sm text-slate-700"
                    >
                      {isInvField ? (
                        <a
                          href={`/search/${cell}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 underline decoration-blue-300 underline-offset-2 transition hover:text-blue-800 hover:decoration-blue-500"
                        >
                          {cell}
                        </a>
                      ) : (
                        cell
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Y-axis resize handle */}
        <span
          onMouseDown={onRowResizeStart}
          className="sticky bottom-0 left-0 block h-1.5 w-full cursor-row-resize bg-slate-200 transition hover:bg-blue-400"
        />
      </div>
    </div>
  );
}

/* =====================================================
   HOME PAGE
===================================================== */

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<SearchTab>("advance");
  const [serial, setSerial] = useState("");
  const [phone, setPhone] = useState("");

  const results = RESULTS_MAP[activeTab];

  return (
    <div className="space-y-6 p-6">
      {/* Search Card */}
      <FadeUp>
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 shadow-sm">
          {/* Tabs */}
          <div className="mb-6 flex gap-1 border-b border-slate-200">
            {SEARCH_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "border-b-2 border-[#00175c] text-[#00175c]"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Inputs */}
          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Serial Number
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                  placeholder="Enter serial number"
                  className="w-full rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            {activeTab === "rma" && (
              <div className="flex-1 space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Phone Number
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>
            )}

            <button
              type="button"
              className="flex h-[42px] items-center justify-center gap-2 rounded-xl bg-[#00175c] px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#000f3d] hover:shadow active:scale-[0.98]"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>
        </div>
      </FadeUp>

      {/* Results */}
      {results.map((section) => (
        <FadeUp key={section.title}>
          <div className="overflow-hidden rounded-xl border border-dashed border-slate-200/80 bg-white shadow-sm">
            <div className="border-b border-dashed border-slate-100 bg-slate-100/60 px-6 py-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                {section.title}
              </span>
            </div>

            <ResizableTable columns={section.columns} rows={section.rows} />
          </div>
        </FadeUp>
      ))}
    </div>
  );
}
