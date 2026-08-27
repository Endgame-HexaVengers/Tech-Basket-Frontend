"use client";

import { useState } from "react";
import {
  ChevronDown,
  Package,
  Plus,
  Search,
  Trash2,
  UserPlus,
} from "lucide-react";

type LineItem = {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  discount: number;
};

const inputClass =
  "h-11 w-full rounded-sm border border-slate-200 bg-white px-3 text-[14px] text-slate-700 outline-none transition focus:border-[#123b9c] focus:ring-2 focus:ring-blue-100";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[14px] font-medium text-slate-600">
        {label}
      </span>
      {children}
    </label>
  );
}

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
          <span className="text-[16px] font-semibold text-slate-900">
            {title}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-600 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="border-t border-slate-200 p-4">{children}</div>}
    </section>
  );
}

export default function PurchaseEntryPage() {
  const [items, setItems] = useState<LineItem[]>([
    {
      id: 1,
      name: "Logitech B175 Wireless Mouse",
      sku: "LOG-B175-BLK",
      quantity: 5,
      price: 650,
      discount: 0,
    },
  ]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const subtotal = items.reduce(
    (total, item) => total + item.quantity * item.price,
    0,
  );
  const discount = items.reduce((total, item) => total + item.discount, 0);
  const total = subtotal - discount;

  const addItem = () => {
    if (!search.trim()) return;
    setItems((current) => [
      ...current,
      {
        id: Date.now(),
        name: search,
        sku: "NEW-PRODUCT",
        quantity: 1,
        price: 0,
        discount: 0,
      },
    ]);
    setSearch("");
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#f6f8fa] px-5 py-6 text-slate-900 sm:px-8 lg:px-10">
      <div className="w-full">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-semibold tracking-tight">
              New Purchase Entry
            </h1>
            <p className="mt-1 text-[14px] text-slate-500">
              Create a purchase record and add received products.
            </p>
          </div>
          <span className="text-[14px] font-medium text-slate-500">
            Dhaka Main Branch
          </span>
        </header>

        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            setMessage("Purchase saved successfully.");
          }}
        >
          <Accordion number={1} title="Supplier Information" defaultOpen>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <Field
                label="Search Supplier by Phone or Name"
                className="w-full sm:max-w-105"
              >
                <div className="relative">
                  <Search className="absolute left-2.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    className={`${inputClass} pl-9`}
                    placeholder="Search supplier..."
                  />
                </div>
              </Field>
              <button
                type="button"
                className="flex h-11 items-center gap-2 rounded-sm bg-slate-200 px-4 text-[14px] font-semibold text-slate-700"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Supplier Name *">
                <input
                  className={inputClass}
                  defaultValue="Global Tech Suppliers"
                />
              </Field>
              <Field label="Supplier ID">
                <input
                  className={inputClass}
                  defaultValue="SUP-00124"
                  readOnly
                />
              </Field>
              <Field label="Phone Number">
                <input className={inputClass} defaultValue="01711002233" />
              </Field>
              <Field label="Supplier Type">
                <select
                  className={`${inputClass} appearance-none`}
                  defaultValue="Business"
                >
                  <option>Business</option>
                  <option>Individual</option>
                </select>
              </Field>
            </div>
            <Field label="Address" className="mt-3">
              <input
                className={inputClass}
                defaultValue="23 Motijheel Commercial Area, Dhaka"
              />
            </Field>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="flex h-11 items-center gap-2 rounded-sm bg-[#123b9c] px-5 text-[14px] font-semibold text-white hover:bg-[#0d2f80]"
              >
                <UserPlus className="h-4 w-4" />
                Create Supplier
              </button>
            </div>
          </Accordion>

          <Accordion number={2} title="Purchase Information" defaultOpen>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Purchase Person">
                <input
                  className={inputClass}
                  defaultValue="Rahim Ahmed"
                  readOnly
                />
              </Field>
              <Field label="Employee ID">
                <input
                  className={inputClass}
                  defaultValue="EMP-00125"
                  readOnly
                />
              </Field>
              <Field label="Branch">
                <input
                  className={inputClass}
                  defaultValue="Dhaka Main Branch"
                  readOnly
                />
              </Field>
              <Field label="Purchase Date">
                <input
                  className={inputClass}
                  type="date"
                  defaultValue="2026-08-27"
                />
              </Field>
            </div>
            <Field label="Supplier Invoice / Reference No." className="mt-3">
              <input
                className={inputClass}
                placeholder="Enter supplier invoice number"
              />
            </Field>
          </Accordion>

          <Accordion number={3} title="Product Information" defaultOpen>
            <div className="grid gap-3 rounded-sm border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[minmax(0,1fr)_90px_125px_115px_75px] sm:items-end">
              <Field label="Search Product (Name/SKU)">
                <div className="relative">
                  <Package className="absolute left-2.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    className={`${inputClass} pl-9`}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Type product name or SKU..."
                  />
                </div>
              </Field>
              <Field label="Qty">
                <input
                  className={inputClass}
                  type="number"
                  min="1"
                  defaultValue="1"
                />
              </Field>
              <Field label="Purchase Price">
                <input className={inputClass} defaultValue="৳ 650" />
              </Field>
              <Field label="Discount">
                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  defaultValue="0"
                />
              </Field>
              <button
                type="button"
                onClick={addItem}
                className="flex h-11 items-center justify-center gap-1 rounded-sm bg-[#123b9c] text-[14px] font-semibold text-white hover:bg-[#0d2f80]"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-180 border-collapse text-left text-[14px]">
                <thead className="border-y border-slate-200 bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-3 py-3">Product &amp; SKU</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Discount</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100">
                      <td className="px-3 py-3 font-medium">
                        {item.name}
                        <span className="block font-mono text-[12px] font-normal text-slate-400">
                          SKU: {item.sku}
                        </span>
                      </td>
                      <td>{item.quantity}</td>
                      <td>৳ {item.price.toLocaleString()}</td>
                      <td>৳ {item.discount.toLocaleString()}</td>
                      <td className="font-semibold">
                        ৳{" "}
                        {(
                          item.quantity * item.price -
                          item.discount
                        ).toLocaleString()}
                      </td>
                      <td>
                        <button
                          type="button"
                          aria-label={`Remove ${item.name}`}
                          onClick={() =>
                            setItems((current) =>
                              current.filter((entry) => entry.id !== item.id),
                            )
                          }
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Accordion>

          <Accordion number={4} title="Payment Details">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Payment Method">
                <select
                  className={`${inputClass} appearance-none`}
                  defaultValue="Cash"
                >
                  <option>Cash</option>
                  <option>Bank Transfer</option>
                  <option>Card</option>
                </select>
              </Field>
              <Field label="Payment Status">
                <select
                  className={`${inputClass} appearance-none`}
                  defaultValue="Partial"
                >
                  <option>Partial</option>
                  <option>Paid</option>
                  <option>Due</option>
                </select>
              </Field>
              <Field label="Paid Amount">
                <input className={inputClass} defaultValue="৳ 0" />
              </Field>
              <Field label="Due Amount">
                <input
                  className={inputClass}
                  value={`৳ ${total.toLocaleString()}`}
                  readOnly
                />
              </Field>
            </div>
            <Field label="Remarks / Notes" className="mt-3">
              <textarea
                className={`${inputClass} h-20 resize-none py-2`}
                placeholder="Add internal notes..."
              />
            </Field>
          </Accordion>

          <Accordion number={5} title="Financial Summary" defaultOpen>
            <div className="w-full space-y-3 text-[14px]">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} products)</span>
                <span>৳ {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Discount</span>
                <span className="text-red-500">
                  ৳ {discount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>VAT / Tax (0%)</span>
                <span>৳ 0</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3 text-[16px] font-semibold">
                <span>Grand Total</span>
                <span>৳ {total.toLocaleString()}</span>
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
              type="reset"
              className="h-11 rounded-sm border border-slate-200 bg-slate-100 px-5 text-[14px] font-semibold text-slate-600"
            >
              Clear
            </button>
            <button
              type="submit"
              className="h-11 rounded-sm bg-[#123b9c] px-5 text-[14px] font-semibold text-white hover:bg-[#0d2f80]"
            >
              Save Purchase
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
