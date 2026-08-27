"use client";

import { useState } from "react";
import {
  ChevronDown,
  FileText,
  Package,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

const inputClass =
  "h-11 w-full rounded-sm border border-slate-200 bg-white px-3 text-[14px] text-slate-700 outline-none focus:border-[#123b9c] focus:ring-2 focus:ring-blue-100";

function Accordion({
  number,
  title,
  children,
  defaultOpen = false,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="overflow-hidden rounded-sm border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex min-h-14 w-full items-center justify-between bg-slate-50 px-4 text-left hover:bg-slate-100"
      >
        <span className="flex items-center gap-3">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full text-[14px] font-semibold ${open ? "bg-[#123b9c] text-white" : "bg-slate-200 text-slate-600"}`}
          >
            {number}
          </span>
          <span className="text-[16px] font-semibold">{title}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="border-t border-slate-200 p-4">{children}</div>}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[14px] font-medium text-slate-600">
        {label}
      </span>
      {children}
    </label>
  );
}

export default function PurchaseReturnPage() {
  const [selected, setSelected] = useState("PUR-000342");
  const [quantity, setQuantity] = useState("2");
  const [message, setMessage] = useState("");
  const purchases = [
    {
      id: "PUR-000342",
      invoice: "SUP-INV-8821",
      supplier: "Global Tech Suppliers",
      date: "25 Aug 2026",
      amount: "৳ 18,500",
    },
    {
      id: "PUR-000341",
      invoice: "SUP-INV-8819",
      supplier: "ABC Distribution",
      date: "24 Aug 2026",
      amount: "৳ 12,300",
    },
  ];
  const returnAmount = Number(quantity) * 650;

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#f6f8fa] px-5 py-6 text-slate-900 sm:px-8 lg:px-10">
      <div className="w-full">
        <header className="mb-4">
          <h1 className="text-[28px] font-semibold tracking-tight">
            Purchase Return
          </h1>
          <p className="mt-1 text-[14px] text-slate-500">
            Return received products to a supplier and record the credit.
          </p>
        </header>
        <div className="rounded-sm border border-slate-200 bg-white p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
            <Field label="Search Supplier by Phone or Name">
              <div className="relative">
                <Search className="absolute left-2.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  className={`${inputClass} pl-9`}
                  placeholder="Search supplier..."
                />
              </div>
            </Field>
            <Field label="Purchase Invoice Number">
              <div className="relative">
                <FileText className="absolute left-2.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  className={`${inputClass} pl-9`}
                  placeholder="Enter invoice number..."
                />
              </div>
            </Field>
            <button
              type="button"
              onClick={() => setMessage("Purchase records loaded.")}
              className="h-11 rounded-sm bg-[#123b9c] px-5 text-[14px] font-semibold text-white"
            >
              <Search className="mr-2 inline h-4 w-4" />
              Load Purchases
            </button>
          </div>
        </div>
        <form
          className="mt-3 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            setMessage("Purchase return saved successfully.");
          }}
        >
          <Accordion
            number={1}
            title="Eligible Purchases for Return"
            defaultOpen
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-180 text-left text-[14px]">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-3 py-3">Select</th>
                    <th>Purchase ID</th>
                    <th>Supplier Invoice</th>
                    <th>Supplier</th>
                    <th>Purchase Date</th>
                    <th>Total Amount</th>
                    <th>Return Status</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((purchase) => (
                    <tr
                      key={purchase.id}
                      className={`border-t border-slate-200 ${selected === purchase.id ? "bg-blue-50" : ""}`}
                    >
                      <td className="px-3 py-3">
                        <input
                          type="radio"
                          name="purchase"
                          checked={selected === purchase.id}
                          onChange={() => setSelected(purchase.id)}
                          className="h-4 w-4 accent-[#123b9c]"
                        />
                      </td>
                      <td className="font-mono font-semibold text-blue-900">
                        {purchase.id}
                      </td>
                      <td className="font-mono">{purchase.invoice}</td>
                      <td>{purchase.supplier}</td>
                      <td>{purchase.date}</td>
                      <td className="font-semibold">{purchase.amount}</td>
                      <td>
                        <span className="rounded-full bg-amber-100 px-2 py-1 text-[14px] text-amber-700">
                          PARTIAL
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Accordion>
          <Accordion
            number={2}
            title="Purchase & Supplier Information"
            defaultOpen
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Purchase ID">
                <input className={inputClass} value={selected} readOnly />
              </Field>
              <Field label="Supplier Invoice No.">
                <input className={inputClass} defaultValue="SUP-INV-8821" />
              </Field>
              <Field label="Supplier Name">
                <input
                  className={inputClass}
                  defaultValue="Global Tech Suppliers"
                />
              </Field>
              <Field label="Supplier Phone">
                <input className={inputClass} defaultValue="01711002233" />
              </Field>
            </div>
            <Field label="Supplier Address">
              <input
                className="mt-3 h-11 w-full rounded-sm border border-slate-200 px-3 text-[14px]"
                defaultValue="23 Motijheel Commercial Area, Dhaka"
              />
            </Field>
          </Accordion>
          <Accordion number={3} title="Product & Serial Assignment" defaultOpen>
            <div className="grid gap-3 lg:grid-cols-3">
              <Field label="Select Product">
                <select
                  className={`${inputClass} appearance-none`}
                  defaultValue="Logitech B175 Wireless Mouse"
                >
                  <option>Logitech B175 Wireless Mouse</option>
                  <option>A4Tech Keyboard</option>
                </select>
              </Field>
              <Field label="Purchased Quantity">
                <input className={inputClass} value="20" readOnly />
              </Field>
              <Field label="Already Returned">
                <input className={inputClass} value="0" readOnly />
              </Field>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label="Return Quantity">
                <select
                  className={inputClass}
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                </select>
              </Field>
              <Field label="Search Serial Number">
                <input
                  className={inputClass}
                  placeholder="Scan or type serial..."
                />
              </Field>
            </div>
            <div className="mt-3 rounded-sm border border-slate-200 bg-slate-50 p-3 text-[14px]">
              <p className="mb-2 font-semibold text-slate-700">
                Available Sold Serial Numbers
              </p>
              <label className="mr-5">
                <input type="checkbox" className="mr-2 accent-[#123b9c]" />
                SN-LOT-001928
              </label>
              <label>
                <input type="checkbox" className="mr-2 accent-[#123b9c]" />
                SN-LOT-001929
              </label>
            </div>
          </Accordion>
          <Accordion number={4} title="Return Items & Summary" defaultOpen>
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-150 text-left text-[14px]">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-3 py-3">Product</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Credit Amount</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-slate-200">
                      <td className="px-3 py-3 font-medium">
                        Logitech B175 Wireless Mouse
                      </td>
                      <td>{quantity}</td>
                      <td>৳ 650</td>
                      <td className="font-semibold">
                        ৳ {returnAmount.toLocaleString()}
                      </td>
                      <td>
                        <button type="button" aria-label="Remove return item">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="space-y-3 text-[14px]">
                <h2 className="text-[16px] font-semibold">Return Summary</h2>
                <div className="flex justify-between">
                  <span>Items Returned</span>
                  <span>{quantity}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-3 text-[16px] font-semibold text-blue-900">
                  <span>Supplier Credit</span>
                  <span>৳ {returnAmount.toLocaleString()}</span>
                </div>
                <Field label="Return Reason">
                  <textarea
                    className="mt-1 h-20 w-full resize-none rounded-sm border border-slate-200 p-2 text-[14px]"
                    placeholder="Describe the return reason..."
                  />
                </Field>
              </div>
            </div>
          </Accordion>
          {message && (
            <p className="text-center text-[14px] font-semibold text-emerald-600">
              {message}
            </p>
          )}
          <div className="flex justify-end gap-2 border-t border-slate-200 pt-3">
            <button
              type="button"
              onClick={() => setMessage("")}
              className="h-11 rounded-sm border border-slate-200 bg-slate-100 px-5 text-[14px] font-semibold text-slate-600"
            >
              <X className="mr-2 inline h-4 w-4" />
              Clear
            </button>
            <button
              type="submit"
              className="h-11 rounded-sm bg-[#123b9c] px-5 text-[14px] font-semibold text-white"
            >
              <Plus className="mr-2 inline h-4 w-4" />
              Save Return
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
