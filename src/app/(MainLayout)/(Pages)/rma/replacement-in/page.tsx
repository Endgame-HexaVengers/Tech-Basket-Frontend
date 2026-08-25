"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  PackageCheck,
  RefreshCw,
  Search,
  Truck,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

interface ReplacementInItem {
  id: string;
  ticketNo: string;
  customerName: string;
  customerPhone: string;
  product: string;
  sku: string;
  brand: string;
  replacementOutDate: string;
  expectedReturnDate: string;
  receivedDate: string | null;
  status: "Pending" | "Received" | "Overdue" | "Cancelled";
  branch: string;
  serialNo: string;
  remarks: string;
}

const initialData: ReplacementInItem[] = [
  {
    id: "1",
    ticketNo: "RMA-2026-0041",
    customerName: "Rahim Ahmed",
    customerPhone: "+880 1712-345678",
    product: "Logitech B175 Wireless Mouse",
    sku: "SKU-LOG-B175",
    brand: "Logitech",
    replacementOutDate: "2026-07-20",
    expectedReturnDate: "2026-08-05",
    receivedDate: null,
    status: "Pending",
    branch: "Dhaka Main",
    serialNo: "SN-LOG-44201",
    remarks: "Customer requested wireless mouse replacement",
  },
  {
    id: "2",
    ticketNo: "RMA-2026-0042",
    customerName: "Sara Karim",
    customerPhone: "+880 1812-987654",
    product: "Dell KM117 Wireless Keyboard & Mouse",
    sku: "SKU-DELL-KM117",
    brand: "Dell",
    replacementOutDate: "2026-07-18",
    expectedReturnDate: "2026-08-01",
    receivedDate: "2026-07-30",
    status: "Received",
    branch: "Tangail",
    serialNo: "SN-DELL-88102",
    remarks: "Defective unit returned",
  },
  {
    id: "3",
    ticketNo: "RMA-2026-0043",
    customerName: "Tanvir Hasan",
    customerPhone: "+880 1912-555123",
    product: "Logitech K120 Wired Keyboard",
    sku: "SKU-LOG-K120",
    brand: "Logitech",
    replacementOutDate: "2026-07-10",
    expectedReturnDate: "2026-07-25",
    receivedDate: null,
    status: "Overdue",
    branch: "Chittagong",
    serialNo: "SN-LOG-33019",
    remarks: "Keyboard keys not responding",
  },
  {
    id: "4",
    ticketNo: "RMA-2026-0044",
    customerName: "Nusrat Jahan",
    customerPhone: "+880 1612-444789",
    product: "Dell MS116 Wired Mouse",
    sku: "SKU-DELL-MS116",
    brand: "Dell",
    replacementOutDate: "2026-07-22",
    expectedReturnDate: "2026-08-06",
    receivedDate: null,
    status: "Pending",
    branch: "Gazipur",
    serialNo: "SN-DELL-77205",
    remarks: "Scroll wheel malfunction",
  },
  {
    id: "5",
    ticketNo: "RMA-2026-0045",
    customerName: "Ariful Islam",
    customerPhone: "+880 1512-222345",
    product: "Logitech G102 Gaming Mouse",
    sku: "SKU-LOG-G102",
    brand: "Logitech",
    replacementOutDate: "2026-07-15",
    expectedReturnDate: "2026-07-30",
    receivedDate: "2026-07-28",
    status: "Received",
    branch: "Sylhet",
    serialNo: "SN-LOG-55108",
    remarks: "Double-click issue resolved",
  },
  {
    id: "6",
    ticketNo: "RMA-2026-0046",
    customerName: "Farhana Akter",
    customerPhone: "+880 1712-888901",
    product: "Dell KM117 Wireless Keyboard & Mouse",
    sku: "SKU-DELL-KM117",
    brand: "Dell",
    replacementOutDate: "2026-07-25",
    expectedReturnDate: "2026-08-10",
    receivedDate: null,
    status: "Pending",
    branch: "Rajshahi",
    serialNo: "SN-DELL-99307",
    remarks: "Wireless connectivity issues",
  },
];

const PAGE_SIZE = 5;

export default function ReplacementInPage() {
  const [data, setData] = useState<ReplacementInItem[]>(initialData);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [brandFilter, setBrandFilter] = useState("All");
  const [branchFilter, setBranchFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return data.filter((item) => {
      const matchesQuery = `${item.ticketNo} ${item.product} ${item.customerName} ${item.sku}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      const matchesBrand = brandFilter === "All" || item.brand === brandFilter;
      const matchesBranch = branchFilter === "All" || item.branch === branchFilter;
      const matchesFrom = !fromDate || item.replacementOutDate >= fromDate;
      const matchesTo = !toDate || item.replacementOutDate <= toDate;
      return matchesQuery && matchesStatus && matchesBrand && matchesBranch && matchesFrom && matchesTo;
    });
  }, [data, query, statusFilter, brandFilter, branchFilter, fromDate, toDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const allSelected =
    paged.length > 0 && paged.every((item) => selected.includes(item.id));

  const toggleAll = () =>
    setSelected(allSelected ? [] : paged.map((item) => item.id));

  const toggleOne = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );

  const handleReceive = (ids: string[]) => {
    if (!ids.length) return;
    setData((prev) =>
      prev.map((item) =>
        ids.includes(item.id)
          ? { ...item, status: "Received" as const, receivedDate: new Date().toISOString().slice(0, 10) }
          : item,
      ),
    );
    setSelected([]);
    toast.success(`${ids.length} item${ids.length > 1 ? "s" : ""} marked as received.`);
  };

  const handleCancel = (ids: string[]) => {
    if (!ids.length) return;
    setData((prev) =>
      prev.map((item) =>
        ids.includes(item.id) ? { ...item, status: "Cancelled" as const } : item,
      ),
    );
    setSelected([]);
    toast.success(`${ids.length} item${ids.length > 1 ? "s" : ""} cancelled.`);
  };

  const handleReset = () => {
    setQuery("");
    setStatusFilter("All");
    setBrandFilter("All");
    setBranchFilter("All");
    setFromDate("");
    setToDate("");
    setSelected([]);
    setPage(1);
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "Received":
        return "border-[#a7e4c4] bg-[#e9faf2] text-[#1a7a52]";
      case "Pending":
        return "border-[#ffd8b4] bg-[#fff6ed] text-[#b86e1d]";
      case "Overdue":
        return "border-[#ffcbbd] bg-[#fff0eb] text-[#c35b42]";
      case "Cancelled":
        return "border-[#d6dce6] bg-[#f1f3f6] text-[#718096]";
      default:
        return "border-[#d6dce6] bg-[#f1f3f6] text-[#718096]";
    }
  };

  return (
    <main className="min-h-[calc(100vh-108px)] bg-[#f8fafc] px-5 py-5 text-[#172235] sm:px-6 lg:px-7">
      <div className="mx-auto max-w-[1500px]">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[29px] font-bold tracking-tight text-[#111827]">
              Replacement In
            </h1>
            <p className="mt-1 text-[13px] text-[#526079]">
              Track and manage incoming product replacements from customers under
              RMA warranty.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-[#d3dbe7] bg-white px-4 text-[12px] font-semibold text-[#344054] shadow-sm hover:bg-[#f1f5f9]"
            >
              <RefreshCw size={13} /> Reset Filters
            </button>
          </div>
        </div>

        {/* Filters */}
        <section className="mb-5 rounded-md border border-[#d6dce6] bg-white p-4 shadow-[0_2px_5px_rgba(15,23,42,0.05)]">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
            <label className="block text-[11px] font-semibold text-[#344054]">
              Search
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#718096]"
                />
                <input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                  placeholder="Ticket, Product, Customer..."
                  className="mt-1.5 h-10 w-full rounded-md border border-[#d6dce6] pl-8 pr-2 text-[12px] outline-none transition focus:border-[#2949a8] focus:ring-2 focus:ring-[#dbe5ff]"
                />
              </div>
            </label>
            <FilterSelect
              label="Status"
              value={statusFilter}
              options={["All", "Pending", "Received", "Overdue", "Cancelled"]}
              onChange={(v) => { setStatusFilter(v); setPage(1); }}
            />
            <FilterSelect
              label="Brand"
              value={brandFilter}
              options={["All", "Logitech", "Dell"]}
              onChange={(v) => { setBrandFilter(v); setPage(1); }}
            />
            <FilterSelect
              label="Branch"
              value={branchFilter}
              options={["All", "Dhaka Main", "Tangail", "Chittagong", "Gazipur", "Sylhet", "Rajshahi"]}
              onChange={(v) => { setBranchFilter(v); setPage(1); }}
            />
            <label className="block text-[11px] font-semibold text-[#344054]">
              From Date
              <input
                type="date"
                value={fromDate}
                onChange={(e) => { setFromDate(e.target.value); setPage(1); }}
                className="mt-1.5 h-10 w-full rounded-md border border-[#d6dce6] bg-white px-2 text-[11px] text-[#718096] outline-none transition focus:border-[#2949a8] focus:ring-2 focus:ring-[#dbe5ff]"
              />
            </label>
            <label className="block text-[11px] font-semibold text-[#344054]">
              To Date
              <input
                type="date"
                value={toDate}
                onChange={(e) => { setToDate(e.target.value); setPage(1); }}
                className="mt-1.5 h-10 w-full rounded-md border border-[#d6dce6] bg-white px-2 text-[11px] text-[#718096] outline-none transition focus:border-[#2949a8] focus:ring-2 focus:ring-[#dbe5ff]"
              />
            </label>
          </div>
        </section>

        {/* Bulk Actions Bar */}
        {selected.length > 0 && (
          <div className="mb-3 flex items-center gap-3 rounded-md border border-[#c8d7f4] bg-[#eef4ff] px-4 py-2.5 text-[12px] text-[#2949a8]">
            <span className="font-semibold">{selected.length} item{selected.length > 1 ? "s" : ""} selected</span>
            <button
              type="button"
              onClick={() => handleReceive(selected)}
              className="inline-flex h-7 items-center gap-1 rounded-md border border-[#a7e4c4] bg-[#e9faf2] px-2.5 text-[10px] font-semibold text-[#1a7a52] hover:bg-[#d4f2e4]"
            >
              <Truck size={11} /> Mark Received
            </button>
            <button
              type="button"
              onClick={() => handleCancel(selected)}
              className="inline-flex h-7 items-center gap-1 rounded-md border border-[#ffcbbd] bg-[#fff0eb] px-2.5 text-[10px] font-semibold text-[#c35b42] hover:bg-[#ffe4dd]"
            >
              <X size={11} /> Cancel
            </button>
            <button
              type="button"
              onClick={() => setSelected([])}
              className="ml-auto text-[10px] font-medium text-[#718096] underline hover:text-[#344054]"
            >
              Clear selection
            </button>
          </div>
        )}

        {/* Table */}
        <section className="overflow-hidden rounded-md border border-[#d6dce6] bg-white shadow-[0_2px_5px_rgba(15,23,42,0.05)]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#d6dce6] bg-[#fbfcfe] px-3 py-2">
            <span className="text-[12px] font-semibold text-[#344054]">
              {filtered.length} replacement-in record{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] border-collapse text-left">
              <thead className="bg-[#f1f3f6] text-[10px] font-bold uppercase tracking-[0.04em] text-[#43516a]">
                <tr>
                  <th className="h-9 border-b border-[#d9dee7] px-3 font-bold">
                    <input
                      type="checkbox"
                      aria-label="Select all"
                      checked={allSelected}
                      onChange={toggleAll}
                      className="accent-[#2949a8]"
                    />
                  </th>
                  {[
                    ["ticketNo", "Ticket #"],
                    ["product", "Product"],
                    ["customer", "Customer"],
                    ["branch", "Branch"],
                    ["outDate", "Replacement Out"],
                    ["returnDate", "Expected Return"],
                    ["receivedDate", "Received Date"],
                    ["status", "Status"],
                    ["action", "Action"],
                  ].map(([key, label]) => (
                    <th
                      key={key}
                      className="h-9 border-b border-[#d9dee7] px-3 font-bold"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-[11px] text-[#344054]">
                {paged.map((item) => (
                  <tr
                    key={item.id}
                    className="h-12 border-b border-[#e5e9ef] last:border-0 hover:bg-[#fbfcff]"
                  >
                    <td className="px-3">
                      <input
                        type="checkbox"
                        aria-label={`Select ${item.ticketNo}`}
                        checked={selected.includes(item.id)}
                        onChange={() => toggleOne(item.id)}
                        className="accent-[#2949a8]"
                      />
                    </td>
                    <td className="px-3 text-[10px] font-semibold text-[#163c7a]">
                      {item.ticketNo}
                    </td>
                    <td className="px-3">
                      <div className="font-medium text-[#163c7a]">{item.product}</div>
                      <div className="text-[9px] text-[#718096]">{item.sku} &middot; SN: {item.serialNo}</div>
                    </td>
                    <td className="px-3">
                      <div>{item.customerName}</div>
                      <div className="text-[9px] text-[#718096]">{item.customerPhone}</div>
                    </td>
                    <td className="px-3 text-[11px]">{item.branch}</td>
                    <td className="px-3 text-[10px]">{item.replacementOutDate}</td>
                    <td className="px-3 text-[10px]">{item.expectedReturnDate}</td>
                    <td className="px-3 text-[10px]">
                      {item.receivedDate ?? <span className="text-[#b0b8c5]">-</span>}
                    </td>
                    <td className="px-3">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[9px] font-medium uppercase ${statusColor(item.status)}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-3">
                      {item.status === "Pending" || item.status === "Overdue" ? (
                        <button
                          type="button"
                          onClick={() => handleReceive([item.id])}
                          className="inline-flex h-7 items-center gap-1 rounded-md border border-[#b9c8e6] bg-[#f5f8ff] px-2.5 text-[10px] font-semibold text-[#2949a8] hover:bg-[#e8efff]"
                        >
                          <PackageCheck size={12} /> Receive
                        </button>
                      ) : item.status === "Received" ? (
                        <span className="text-[10px] text-[#1a7a52] font-medium">
                          Completed
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#718096]">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {paged.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-[12px] text-[#718096]">
                <Truck size={40} className="mb-3 text-[#c5cdd8]" />
                <p className="font-medium">No replacement-in records found.</p>
                <p className="mt-1 text-[11px]">Try adjusting your filters.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-[#d9dee7] bg-[#fbfcfe] px-3 py-2 text-[10px] text-[#536174]">
            <span>
              Showing{" "}
              {filtered.length
                ? `${(safePage - 1) * PAGE_SIZE + 1}-${Math.min(safePage * PAGE_SIZE, filtered.length)}`
                : 0}{" "}
              of {filtered.length} records
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous page"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="text-[#9aa5b5] disabled:opacity-40"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-[#153fa4] text-white">
                {safePage}
              </span>
              <button
                type="button"
                aria-label="Next page"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="text-[#9aa5b5] disabled:opacity-40"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-[11px] font-semibold text-[#344054]">
      {label}
      <span className="relative block">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1.5 h-10 w-full appearance-none rounded-md border border-[#d6dce6] bg-white px-2.5 pr-7 text-[12px] outline-none transition focus:border-[#2949a8] focus:ring-2 focus:ring-[#dbe5ff]"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          size={13}
          className="pointer-events-none absolute right-2 top-1/2 mt-0.5 -translate-y-1/2 text-[#718096]"
        />
      </span>
    </label>
  );
}
