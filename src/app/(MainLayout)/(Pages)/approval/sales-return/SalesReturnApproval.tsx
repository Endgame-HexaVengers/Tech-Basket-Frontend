"use client";

import {
  CalendarDays,
  Check,
  FileBarChart,
  LoaderCircle,
  X,
} from "lucide-react";
import { useState } from "react";

type ReturnRequest = {
  id: string;
  invoice: string;
  customer: string;
  date: string;
  requestedBy: string;
  amount: string;
};

const branches = [
  "Dhaka Main Branch",
  "Chittagong Hub",
  "Sylhet Outlet",
  "Rajshahi Center",
];
const requests: ReturnRequest[] = [
  {
    id: "RTN-2023-10-045",
    invoice: "INV-9012-B",
    customer: "Acme Corp Logistics",
    date: "2023-10-22",
    requestedBy: "J. Smith",
    amount: "$1,250.00",
  },
  {
    id: "RTN-2023-10-048",
    invoice: "INV-9104-C",
    customer: "Global Tech Supplies",
    date: "2023-10-23",
    requestedBy: "M. Doe",
    amount: "$845.50",
  },
  {
    id: "RTN-2023-10-051",
    invoice: "INV-9112-A",
    customer: "Stark Industries",
    date: "2023-10-24",
    requestedBy: "T. Stark",
    amount: "$4,120.00",
  },
];

export default function SalesReturnApproval() {
  const [branch, setBranch] = useState("");
  const [fromDate, setFromDate] = useState("2023-10-01");
  const [toDate, setToDate] = useState("2023-10-24");
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadRequests = () => {
    setLoading(true);
    setMessage("");
    window.setTimeout(() => setLoading(false), 500);
  };

  const clearFilters = () => {
    setBranch("");
    setFromDate("");
    setToDate("");
    setSelectedId("");
    setMessage("");
  };

  return (
    <section className="flex min-h-[calc(100vh-72px)] w-full flex-col bg-[#f8fafc] px-4 py-8 text-[#20262d] sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-360 flex-1 flex-col">
        <header className="mb-6">
          <h1 className="text-2xl font-extrabold tracking-[-0.04em] text-[#17202a]">
            SALES RETURN APPROVAL
          </h1>
          <p className="mt-1 text-sm font-semibold text-slate-600">
            Load pending sales returns and select one for approval.
          </p>
        </header>

        <div className="rounded-md border border-slate-300 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1.25fr_1fr_1fr_auto] md:items-end">
            <label className="text-sm font-bold text-slate-700">
              Branch Name
              <div className="relative mt-2">
                <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <select
                  value={branch}
                  onChange={(event) => setBranch(event.target.value)}
                  className="h-11 w-full appearance-none rounded-sm border border-slate-300 bg-white px-10 text-sm font-semibold outline-none focus:border-blue-700"
                >
                  <option value="">Select Branch</option>
                  {branches.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                  ⌄
                </span>
              </div>
            </label>
            <DateField
              label="Date From"
              value={fromDate}
              onChange={setFromDate}
            />
            <DateField label="Date To" value={toDate} onChange={setToDate} />
            <button
              type="button"
              onClick={loadRequests}
              disabled={loading}
              className="h-11 rounded-sm bg-[#06369f] px-8 text-sm font-bold text-white hover:bg-[#052879] disabled:opacity-70"
            >
              {loading ? (
                <LoaderCircle className="mx-auto h-4 w-4 animate-spin" />
              ) : (
                "↻ Load"
              )}
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-md border border-slate-300 bg-white shadow-sm">
          <div className="flex items-center justify-between bg-[#eef1f6] px-4 py-3">
            <h2 className="text-sm font-extrabold uppercase text-slate-700">
              Pending Sales Returns for Approval
            </h2>
            <span className="rounded-full bg-[#dbe5ff] px-3 py-1 text-xs font-bold text-blue-900">
              {requests.length} Records Found
            </span>
          </div>
          <div className="grid grid-cols-[48px_1.4fr_1.25fr_1.8fr_1.1fr_1.2fr_1.1fr_1fr] items-center gap-2 border-t border-slate-300 bg-white px-4 py-3 text-xs font-extrabold text-slate-600">
            <span>Sel</span>
            <span>Return ID</span>
            <span>Original Invoice</span>
            <span>Customer</span>
            <span>Return Date</span>
            <span>Requested By</span>
            <span>Total Amount</span>
            <span>Status</span>
          </div>
          {requests.map((item) => {
            const selected = selectedId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`grid w-full grid-cols-[48px_1.4fr_1.25fr_1.8fr_1.1fr_1.2fr_1.1fr_1fr] items-center gap-2 border-t border-slate-200 px-4 py-4 text-left text-sm font-semibold ${selected ? "bg-[#dce3ff]" : "hover:bg-slate-50"}`}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full border ${selected ? "border-blue-900 bg-blue-900" : "border-slate-400"}`}
                >
                  {selected && <Check className="h-3 w-3 text-white" />}
                </span>
                <span className="font-mono text-xs font-bold text-blue-900">
                  {item.id}
                </span>
                <span className="font-mono text-xs">{item.invoice}</span>
                <span>{item.customer}</span>
                <span>{item.date}</span>
                <span>{item.requestedBy}</span>
                <span className="font-mono text-xs">{item.amount}</span>
                <span>
                  <em className="rounded-full bg-[#dbe8ff] px-3 py-1 text-[10px] font-bold not-italic text-blue-900">
                    PENDING
                  </em>
                </span>
              </button>
            );
          })}
        </div>

        {message && (
          <p className="mt-4 text-center text-sm font-bold text-blue-800">
            {message}
          </p>
        )}
        <div className="mt-auto flex flex-wrap items-center justify-end gap-4 border-t border-slate-300 pt-8">
          <button
            type="button"
            onClick={() => setMessage("Approval cancelled.")}
            className="h-11 border border-slate-300 bg-white px-8 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            <X className="mr-2 inline h-4 w-4" />
            Cancel
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="h-11 border border-slate-300 bg-white px-8 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => setMessage("Report is ready to download.")}
            className="h-11 bg-slate-200 px-8 text-sm font-bold text-slate-500 hover:bg-slate-300"
          >
            <FileBarChart className="mr-2 inline h-4 w-4" />
            Report
          </button>
          <button
            type="button"
            disabled={!selectedId}
            onClick={() => setMessage(`${selectedId} approved successfully.`)}
            className="h-11 bg-[#2455db] px-10 text-sm font-bold text-white hover:bg-[#0d47da] "
          >
            <Check className="mr-2 inline h-4 w-4" />
            Save (Approve)
          </button>
        </div>
      </div>
    </section>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="text-sm font-bold text-slate-700">
      {label}
      <div className="relative mt-2">
        <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full rounded-sm border border-slate-300 bg-white px-10 text-sm font-semibold outline-none focus:border-blue-700"
        />
      </div>
    </label>
  );
}
