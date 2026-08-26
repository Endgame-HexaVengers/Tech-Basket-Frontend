"use client";

import {
  Check,
  ChevronDown,
  FileText,
  Phone,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";

type Sale = {
  id: string;
  invoice: string;
  customer: string;
  date: string;
  person: string;
  amount: string;
};

const sales: Sale[] = [
  {
    id: "SALE-000242",
    invoice: "INV-001242",
    customer: "Karim Traders",
    date: "25 Aug 2026",
    person: "-",
    amount: "৳1,200",
  },
];

const products = [
  {
    name: "Logitech B175 Wireless Mouse (Returnable)",
    sold: 2,
    returned: 0,
    returnable: 2,
    price: "৳650",
  },
];

export default function SalesReturn() {
  const [phone, setPhone] = useState("");
  const [invoice, setInvoice] = useState("");
  const [selectedSale, setSelectedSale] = useState(sales[0].id);
  const [quantity, setQuantity] = useState("2");
  const [serialSearch, setSerialSearch] = useState("");
  const [message, setMessage] = useState("");

  const sale = sales.find((item) => item.id === selectedSale) ?? sales[0];

  return (
    <section className="min-h-[calc(100vh-72px)] w-full bg-[#f8fafc] px-4 py-8 text-[#1f2937] sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-360">
        <header className="mb-3">
          <h1 className="text-2xl font-extrabold tracking-[-0.04em] text-[#092353]">
            SALES RETURN
          </h1>
          <p className="text-sm font-semibold text-slate-500">
            Search for a completed sale by phone or invoice number to create a
            return.
          </p>
        </header>

        <div className="rounded-md border border-[#d5dce6] bg-white p-3 shadow-sm">
          <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <label className="text-sm font-bold text-slate-700">
              Search by Phone Number
              <div className="relative mt-1">
                <Phone className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Enter phone number..."
                  className="h-10 w-full rounded-sm border border-slate-300 pl-7 pr-2 text-sm font-semibold outline-none focus:border-blue-700"
                />
              </div>
            </label>
            <label className="text-sm font-bold text-slate-700">
              Search by Invoice Number
              <div className="relative mt-1">
                <FileText className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                <input
                  value={invoice}
                  onChange={(event) => setInvoice(event.target.value)}
                  placeholder="Enter invoice number..."
                  className="h-10 w-full rounded-sm border border-slate-300 pl-7 pr-2 text-sm font-semibold outline-none focus:border-blue-700"
                />
              </div>
            </label>
            <button
              type="button"
              onClick={() => setMessage("Sale search completed.")}
              className="h-10 rounded-sm bg-[#06369f] px-7 text-sm font-bold text-white hover:bg-[#052879]"
            >
              <Search className="mr-1 inline h-4 w-4" />
              Load Sale
            </button>
          </div>
        </div>

        <div className="mt-3 overflow-hidden rounded-md border border-[#cbd4df] bg-white">
          <div className="bg-[#f1f3f7] px-3 py-2 text-sm font-bold uppercase text-slate-700">
            Eligible Sales for Return
          </div>
          <div className="grid grid-cols-[50px_1.2fr_1.3fr_1.5fr_1.1fr_1.1fr_1fr_1fr] items-center gap-2 border-t border-slate-200 px-3 py-3 text-sm font-bold text-slate-700">
            <span>Select</span>
            <span>Sale ID</span>
            <span>Invoice No</span>
            <span>Customer</span>
            <span>Sale Date</span>
            <span>Sales Person</span>
            <span>Total Amount</span>
            <span>Return Status</span>
          </div>
          {sales.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedSale(item.id)}
              className={`grid w-full grid-cols-[50px_1.2fr_1.3fr_1.5fr_1.1fr_1.1fr_1fr_1fr] items-center gap-2 border-t border-slate-200 px-3 py-4 text-left text-sm font-semibold ${selectedSale === item.id ? "bg-[#dce3ff]" : "hover:bg-slate-50"}`}
            >
              <span
                className={`flex h-3 w-3 items-center justify-center rounded-full border ${selectedSale === item.id ? "border-blue-900 bg-blue-900" : "border-slate-400"}`}
              >
                {selectedSale === item.id && (
                  <Check className="h-2 w-2 text-white" />
                )}
              </span>
              <span className="font-mono font-bold text-blue-900">
                {item.id}
              </span>
              <span className="font-mono">{item.invoice}</span>
              <span>{item.customer}</span>
              <span>{item.date}</span>
              <span>{item.person}</span>
              <span>{item.amount}</span>
              <span>
                <em className="rounded-full bg-[#ffe0d8] px-2 py-1 text-[9px] font-bold not-italic text-[#a6361d]">
                  Partial
                </em>
              </span>
            </button>
          ))}
          <div className="flex items-center justify-between border-t border-slate-200 bg-[#f1f3f7] px-3 py-3 text-sm font-bold">
            <span>Selected Sale: {sale.id}</span>
            <button
              type="button"
              onClick={() => setMessage("Selected sale loaded.")}
              className="rounded-sm bg-[#06369f] px-4 py-2 text-sm font-bold text-white"
            >
              Load Selected Sale
            </button>
          </div>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <InfoPanel
            title="Selected Sale Information"
            rows={[
              ["Sale ID", sale.id],
              ["Invoice Number", sale.invoice],
              ["Sale Date", sale.date],
              ["Branch", "Dhaka Branch"],
            ]}
          />
          <InfoPanel
            title="Customer Information"
            rows={[
              ["Customer Name", sale.customer],
              ["Phone", "01712345678"],
              ["Customer ID", "CUST-892"],
              ["Address", "123 Trading Ave, Dhaka"],
            ]}
          />
        </div>

        <div className="mt-3 border-l-2 border-[#0a2c84] bg-white p-3 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1.7fr_2.2fr]">
            <div>
              <label className="mb-1 block text-[10px] font-bold text-blue-900">
                Select Product to Return
              </label>
              <div className="flex items-center gap-2 rounded-sm border border-slate-300 p-1.5 text-[10px] font-semibold">
                <span className="flex-1">{products[0].name}</span>
                <ChevronDown className="h-3 w-3 text-slate-500" />
              </div>
              <div className="mt-2 grid grid-cols-4 gap-1 text-center text-[9px]">
                <Metric label="SOLD" value="2" />
                <Metric label="RETURNED" value="0" />
                <Metric label="RETURNABLE" value="2" active />
                <select
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  className="rounded-sm border border-slate-300 bg-white text-center"
                >
                  <option>2</option>
                  <option>1</option>
                </select>
              </div>
            </div>
            <div className="hidden md:block" />
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <SerialPanel
              title="Search Serial Number"
              value={serialSearch}
              onChange={setSerialSearch}
              selected
            />
            <SerialPanel title="Available Sold Serial Numbers" available />
          </div>
          <button
            type="button"
            onClick={() => setMessage("Return product added.")}
            className="mt-3 ml-auto block bg-[#00175c] px-3 py-2 text-[10px] font-semibold text-white"
          >
            <Plus className="mr-1 inline h-3 w-3" />
            Add Return Product
          </button>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-[1fr_260px]">
          <div className="overflow-hidden border border-slate-300 bg-white">
            <div className="bg-[#f1f3f7] px-2 py-2 text-[10px] font-bold uppercase text-slate-600">
              Return Items
            </div>
            <div className="grid grid-cols-[30px_1.8fr_1.3fr_1fr_0.6fr_0.8fr] p-2 text-[9px] font-bold text-slate-500">
              <span>#</span>
              <span>Product</span>
              <span>Serials</span>
              <span>Unit Price</span>
              <span>Qty</span>
              <span>Total</span>
            </div>
            <div className="grid grid-cols-[30px_1.8fr_1.3fr_1fr_0.6fr_0.8fr] border-t border-slate-200 p-2 text-[10px]">
              <span>1</span>
              <b>
                {products[0].name}
                <small className="block text-[8px] font-normal text-slate-500">
                  LOGI-B175-WL
                </small>
              </b>
              <span className="text-[8px]">
                SN-LOG-10129
                <br />
                SN-LOG-10130
              </span>
              <span>৳650</span>
              <b>2</b>
              <b>৳1,300</b>
            </div>
          </div>
          <div className="border border-slate-300 bg-white">
            <div className="bg-[#f1f3f7] px-2 py-2 text-[10px] font-bold uppercase text-slate-600">
              Return Summary
            </div>
            <div className="space-y-2 p-3 text-xs">
              <div className="flex justify-between">
                <span>Items Returned</span>
                <b>2</b>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳1,300</span>
              </div>
              <div className="flex justify-between font-bold text-blue-900">
                <span>Return Amount</span>
                <b>৳1,300</b>
              </div>
              <label className="block pt-1 text-[9px]">
                Return Note / Reason
                <textarea
                  placeholder="Optional notes..."
                  className="mt-1 h-12 w-full resize-none border border-slate-300 p-2 text-[10px]"
                />
              </label>
            </div>
          </div>
        </div>

        {message && (
          <p className="py-3 text-center text-sm font-bold text-blue-800">
            {message}
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={() => setMessage("Sales return saved.")}
            className="bg-[#00175c] px-8 py-3 text-sm font-bold text-white"
          >
            <Check className="mr-1 inline h-4 w-4" />
            Save Return
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setPhone("");
                setInvoice("");
                setMessage("");
              }}
              className="border border-red-300 px-8 py-3 text-sm font-bold text-red-600"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={() => setMessage("Return cancelled.")}
              className="border border-slate-300 px-8 py-3 text-sm font-bold text-slate-700"
            >
              <X className="mr-1 inline h-4 w-4" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoPanel({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <div className="overflow-hidden rounded-sm border border-slate-300 bg-white">
      <div className="bg-[#f1f3f7] px-2 py-2 text-[10px] font-bold uppercase text-slate-600">
        {title}
      </div>
      <div className="grid grid-cols-2 gap-y-2 p-2 text-[10px]">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <span className="text-slate-500">{label}</span>
            <b>{value}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  active = false,
}: {
  label: string;
  value: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-sm px-1 py-2 ${active ? "bg-blue-100 text-blue-900" : "bg-slate-50"}`}
    >
      <small className="block text-[7px]">{label}</small>
      <b>{value}</b>
    </div>
  );
}

function SerialPanel({
  title,
  value = "",
  onChange,
  selected = false,
  available = false,
}: {
  title: string;
  value?: string;
  onChange?: (value: string) => void;
  selected?: boolean;
  available?: boolean;
}) {
  return (
    <div className="border border-slate-300 p-2">
      <div className="text-[10px] font-bold uppercase text-slate-600">
        {title}
      </div>
      {onChange && (
        <div className="relative mt-2">
          <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Scan or type serial..."
            className="h-7 w-full border border-slate-300 pl-7 text-[10px]"
          />
        </div>
      )}
      {selected && (
        <div className="mt-2">
          <small className="text-[9px]">Assigned Serials</small>
          <div className="mt-1 flex gap-1">
            <span className="rounded-sm bg-blue-900 px-2 py-1 text-[8px] text-white">
              SN-LOG-10129 ×
            </span>
            <span className="rounded-sm bg-blue-900 px-2 py-1 text-[8px] text-white">
              SN-LOG-10130 ×
            </span>
          </div>
        </div>
      )}
      {available && (
        <div className="mt-2 space-y-2 text-[9px] text-slate-500">
          <label>
            <input type="checkbox" defaultChecked className="mr-2" />
            SN-LOG-10129 <span className="float-right">Assigned</span>
          </label>
          <label>
            <input type="checkbox" defaultChecked className="mr-2" />
            SN-LOG-10130 <span className="float-right">Assigned</span>
          </label>
        </div>
      )}
    </div>
  );
}
