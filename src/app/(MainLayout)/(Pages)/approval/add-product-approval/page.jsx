"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import ApproveProduct from "./ApproveProduct";

const initialRequests = [
  {
    id: "001",
    product: "Logitech B175 Wireless Mouse - White",
    sku: "SKU-LOG-B175-W",
    brand: "Logitech",
    category: "Peripherals",
    requestedBy: "John Doe",
    initials: "JD",
  },
  {
    id: "002",
    product: "Logitech B175 Wireless Mouse - Black",
    sku: "SKU-LOG-B175-B",
    brand: "Logitech",
    category: "Peripherals",
    requestedBy: "John Doe",
    initials: "JD",
  },
  {
    id: "003",
    product: "Logitech K120 Wired Keyboard",
    sku: "SKU-LOG-K120",
    brand: "Logitech",
    category: "Peripherals",
    requestedBy: "Alice Smith",
    initials: "AS",
  },
];

const AddProductApproval = () => {
  const [requests, setRequests] = useState(initialRequests);
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("All Brands");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("Pending Approval");
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState("");
  const [approvalRequest, setApprovalRequest] = useState(null);

  const filteredRequests = useMemo(
    () =>
      requests.filter((request) => {
        const matchesQuery = `${request.product} ${request.sku}`
          .toLowerCase()
          .includes(query.toLowerCase());
        return (
          matchesQuery &&
          (brand === "All Brands" || request.brand === brand) &&
          (category === "All Categories" || request.category === category)
        );
      }),
    [brand, category, query, requests],
  );
  const allSelected =
    filteredRequests.length > 0 &&
    filteredRequests.every((request) => selected.includes(request.id));

  const toggleAll = () =>
    setSelected(
      allSelected ? [] : filteredRequests.map((request) => request.id),
    );
  const toggleOne = (id) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  const processSelected = (action) => {
    if (!selected.length) return;
    setRequests((current) =>
      current.filter((request) => !selected.includes(request.id)),
    );
    setSelected([]);
    setMessage(
      `${selected.length} request${selected.length > 1 ? "s" : ""} ${action}.`,
    );
    window.setTimeout(() => setMessage(""), 2500);
  };

  const approveRequest = () => {
    if (!approvalRequest) return;
    setRequests((current) => current.filter((request) => request.id !== approvalRequest.id));
    setApprovalRequest(null);
    setMessage("Product approved successfully.");
    window.setTimeout(() => setMessage(""), 2500);
  };

  return (
    <main className="min-h-[calc(100vh-108px)] bg-[#f8fafc] px-5 py-5 text-[#172235] sm:px-6 lg:px-7">
      <div className="mx-auto max-w-362.5">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
                <h1 className="text-[29px] font-bold tracking-tight text-[#111827]">
              Product Approval
            </h1>
                <p className="mt-1 text-[13px] text-[#526079]">
              Review and approve newly created products before they become
              available for business operations.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setRequests(initialRequests);
              setSelected([]);
            }}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-[#d3dbe7] bg-white px-4 text-[12px] font-semibold text-[#344054] shadow-sm hover:bg-[#f1f5f9]"
          >
            <RefreshCw size={13} /> Refresh List
          </button>
        </div>
        <section className="mb-5 rounded-md border border-[#d6dce6] bg-white p-4 shadow-[0_2px_5px_rgba(15,23,42,0.05)]">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <label className="block text-[11px] font-semibold text-[#344054]">
              Search
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#718096]"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="SKU, Name..."
                  className="mt-1.5 h-10 w-full rounded-md border border-[#d6dce6] pl-8 pr-2 text-[12px] outline-none transition focus:border-[#2949a8] focus:ring-2 focus:ring-[#dbe5ff]"
                />
              </div>
            </label>
            <FilterSelect
              label="Status"
              value={status}
              options={["Pending Approval", "All Statuses"]}
              onChange={setStatus}
            />
            <FilterSelect
              label="Brand"
              value={brand}
              options={["All Brands", "Logitech", "Dell"]}
              onChange={setBrand}
            />
            <FilterSelect
              label="Category"
              value={category}
              options={["All Categories", "Peripherals", "Monitor"]}
              onChange={setCategory}
            />
            <label className="block text-[11px] font-semibold text-[#344054]">
              Date Range
              <div className="mt-1.5 flex h-10 items-center gap-2">
                <span className="relative block flex-1">
                  <input
                    type="date"
                    aria-label="From date"
                    className="h-10 w-full rounded-md border border-[#d6dce6] bg-white px-2 text-[11px] text-[#718096] outline-none transition focus:border-[#2949a8] focus:ring-2 focus:ring-[#dbe5ff]"
                  />
                </span>
                <span className="text-[12px] text-[#718096]">-</span>
                <span className="relative block flex-1">
                  <input
                    type="date"
                    aria-label="To date"
                    className="h-10 w-full rounded-md border border-[#d6dce6] bg-white px-2 text-[11px] text-[#718096] outline-none transition focus:border-[#2949a8] focus:ring-2 focus:ring-[#dbe5ff]"
                  />
                </span>
              </div>
            </label>
          </div>
        </section>
        {message && (
          <div
            role="status"
            className="mb-3 rounded-md border border-[#c8d7f4] bg-[#eef4ff] px-3 py-2 text-[12px] text-[#2949a8]"
          >
            {message}
          </div>
        )}
        <section className="overflow-hidden rounded-md border border-[#d6dce6] bg-white shadow-[0_2px_5px_rgba(15,23,42,0.05)]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#d6dce6] bg-[#fbfcfe] px-3 py-2">
            <span className="text-[12px] font-semibold text-[#344054]">
              {filteredRequests.length} items pending approval
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={!selected.length}
                onClick={() => processSelected("approved")}
                className="inline-flex h-7 items-center gap-1 rounded-md border border-[#dfe5ed] px-2 text-[10px] text-[#718096] disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#eefaf5]"
              >
                <Check size={11} /> Bulk Approve
              </button>
              <button
                type="button"
                disabled={!selected.length}
                onClick={() => processSelected("rejected")}
                className="inline-flex h-7 items-center gap-1 rounded-md border border-[#dfe5ed] px-2 text-[10px] text-[#718096] disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#fff3f1]"
              >
                <X size={11} /> Bulk Reject
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-250 border-collapse text-left">
              <thead className="bg-[#f1f3f6] text-[10px] font-bold uppercase tracking-[0.04em] text-[#43516a]">
                <tr>
                  {[
                    ["check", ""],
                    ["id", "#"],
                    ["product", "Product"],
                    ["sku", "SKU"],
                    ["brand", "Brand"],
                    ["category", "Category"],
                    ["requested", "Requested By"],
                    ["status", "Status"],
                    ["action", "Action"],
                  ].map(([key, heading]) => (
                    <th
                      key={key}
                      className="h-9 border-b border-[#d9dee7] px-3 font-bold"
                    >
                      {key === "check" ? (
                        <input
                          type="checkbox"
                          aria-label="Select all requests"
                          checked={allSelected}
                          onChange={toggleAll}
                          className="accent-[#2949a8]"
                        />
                      ) : (
                        heading
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-[11px] text-[#344054]">
                {filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="h-12 border-b border-[#e5e9ef] last:border-0 hover:bg-[#fbfcff]"
                  >
                    <td className="px-3">
                      <input
                        type="checkbox"
                        aria-label={`Select ${request.product}`}
                        checked={selected.includes(request.id)}
                        onChange={() => toggleOne(request.id)}
                        className="accent-[#2949a8]"
                      />
                    </td>
                    <td className="px-3 text-[10px]">{request.id}</td>
                    <td className="px-3">
                      <button
                        type="button"
                        onClick={() => setApprovalRequest(request)}
                        className="text-left font-semibold text-[#163c7a] hover:text-[#2949a8] hover:underline"
                      >
                        {request.product}
                      </button>
                    </td>
                    <td className="px-3 text-[10px]">{request.sku}</td>
                    <td className="px-3">{request.brand}</td>
                    <td className="px-3">{request.category}</td>
                    <td className="px-3">
                      <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#e9edf2] text-[8px] font-semibold text-[#526079]">
                        {request.initials}
                      </span>
                      {request.requestedBy}
                    </td>
                    <td className="px-3">
                      <span className="rounded-full border border-[#ffcbbd] bg-[#fff0eb] px-2 py-1 text-[9px] font-medium uppercase text-[#c35b42]">
                        Pending
                      </span>
                    </td>
                    <td className="px-3">
                      <button
                        type="button"
                        aria-label={`Open ${request.product}`}
                        onClick={() => setApprovalRequest(request)}
                        className="inline-flex h-7 items-center gap-1 rounded-md border border-[#b9c8e6] bg-[#f5f8ff] px-2.5 text-[10px] font-semibold text-[#2949a8] hover:bg-[#e8efff]"
                      >
                        <Check size={12} /> Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredRequests.length === 0 && (
              <div className="py-10 text-center text-[12px] text-[#718096]">
                No pending product approvals found.
              </div>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-[#d9dee7] bg-[#fbfcfe] px-3 py-2 text-[10px] text-[#536174]">
            <span>
              Showing{" "}
              {filteredRequests.length ? `1-${filteredRequests.length}` : 0} of{" "}
              {filteredRequests.length} requests
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous page"
                className="text-[#9aa5b5]"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-[#153fa4] text-white">
                1
              </span>
              <button
                type="button"
                aria-label="Next page"
                className="text-[#9aa5b5]"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </section>
      </div>
      {approvalRequest && <ApproveProduct productName={approvalRequest.product} onClose={() => setApprovalRequest(null)} onApprove={approveRequest} />}
    </main>
  );
};

function FilterSelect({ label, value, options, onChange }) {
  return (
    <label className="block text-[11px] font-semibold text-[#344054]">
      {label}
      <span className="relative block">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mt-1.5 h-10 w-full appearance-none rounded-md border border-[#d6dce6] bg-white px-2.5 pr-7 text-[12px] outline-none transition focus:border-[#2949a8] focus:ring-2 focus:ring-[#dbe5ff]"
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
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

export default AddProductApproval;
