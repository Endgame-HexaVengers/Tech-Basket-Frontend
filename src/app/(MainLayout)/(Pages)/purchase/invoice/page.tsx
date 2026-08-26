"use client";

import { useState } from "react";
import { ChevronDown, Printer, Search, Eye, Save } from "lucide-react";

const fieldClass =
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

export default function PurchaseInvoicePage() {
  const [selected, setSelected] = useState("PUR-000342");
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
  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#f6f8fa] px-5 py-6 text-slate-900 sm:px-8 lg:px-10">
      <div className="w-full">
        <header className="mb-4">
          <h1 className="text-[28px] font-semibold tracking-tight">
            Purchase Invoice
          </h1>
          <p className="mt-1 text-[14px] text-slate-500">
            Select an approved purchase and finalize its invoice.
          </p>
        </header>
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            setMessage("Purchase invoice finalized successfully.");
          }}
        >
          <section className="rounded-sm border border-slate-200 bg-white p-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
              <Field label="Branch">
                <select
                  className={`${fieldClass} appearance-none`}
                  defaultValue="Dhaka Main Branch"
                >
                  <option>Dhaka Main Branch</option>
                  <option>Chittagong Hub</option>
                </select>
              </Field>
              <Field label="Date From">
                <input
                  className={fieldClass}
                  type="date"
                  defaultValue="2026-08-01"
                />
              </Field>
              <Field label="Date To">
                <input
                  className={fieldClass}
                  type="date"
                  defaultValue="2026-08-27"
                />
              </Field>
              <button
                type="button"
                onClick={() => setMessage("Purchase entries loaded.")}
                className="h-11 rounded-sm bg-[#123b9c] px-5 text-[14px] font-semibold text-white"
              >
                <Search className="mr-2 inline h-4 w-4" />
                Load Purchases
              </button>
            </div>
          </section>
          <Accordion number={1} title="Approved Purchases" defaultOpen>
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
                    <th>Status</th>
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
                        <span className="rounded-full bg-emerald-100 px-2 py-1 text-[14px] text-emerald-700">
                          APPROVED
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
                <input className={fieldClass} value={selected} readOnly />
              </Field>
              <Field label="Supplier Invoice No.">
                <input className={fieldClass} defaultValue="SUP-INV-8821" />
              </Field>
              <Field label="Supplier Name">
                <input
                  className={fieldClass}
                  defaultValue="Global Tech Suppliers"
                />
              </Field>
              <Field label="Branch">
                <input
                  className={fieldClass}
                  defaultValue="Dhaka Main Branch"
                  readOnly
                />
              </Field>
            </div>
          </Accordion>
          <Accordion number={3} title="Purchase Line Items" defaultOpen>
            <div className="overflow-x-auto">
              <table className="w-full min-w-180 text-left text-[14px]">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-3 py-3">Product &amp; SKU</th>
                    <th>Qty</th>
                    <th>Purchase Price</th>
                    <th>Discount</th>
                    <th>Tax</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-200">
                    <td className="px-3 py-3 font-medium">
                      Logitech B175 Wireless Mouse
                      <span className="block font-mono text-[12px] text-slate-400">
                        SKU: LOG-B175-BLK
                      </span>
                    </td>
                    <td>20</td>
                    <td>৳ 650</td>
                    <td>৳ 500</td>
                    <td>৳ 0</td>
                    <td className="font-semibold">৳ 12,500</td>
                  </tr>
                  <tr className="border-t border-slate-200">
                    <td className="px-3 py-3 font-medium">
                      A4Tech Keyboard
                      <span className="block font-mono text-[12px] text-slate-400">
                        SKU: A4T-KV300-01K
                      </span>
                    </td>
                    <td>10</td>
                    <td>৳ 600</td>
                    <td>৳ 0</td>
                    <td>৳ 0</td>
                    <td className="font-semibold">৳ 6,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Accordion>
          <Accordion number={4} title="Financial Summary" defaultOpen>
            <div className="w-full max-w-2xl space-y-3 text-[14px]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳ 18,500</span>
              </div>
              <div className="flex justify-between">
                <span>Total Discount</span>
                <span>৳ 500</span>
              </div>
              <div className="flex justify-between">
                <span>VAT / Tax</span>
                <span>৳ 0</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3 text-[16px] font-semibold">
                <span>Grand Total</span>
                <span>৳ 18,000</span>
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
              onClick={() => setMessage("Invoice preview opened.")}
              className="h-11 border border-slate-200 bg-white px-4 text-[14px] font-semibold"
            >
              <Eye className="mr-2 inline h-4 w-4" />
              Preview
            </button>
            <button
              type="button"
              onClick={() => setMessage("Report generated.")}
              className="h-11 border border-slate-200 bg-white px-4 text-[14px] font-semibold"
            >
              <Printer className="mr-2 inline h-4 w-4" />
              Report
            </button>
            <button
              type="submit"
              className="h-11 bg-[#123b9c] px-5 text-[14px] font-semibold text-white"
            >
              <Save className="mr-2 inline h-4 w-4" />
              Finalize Invoice
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
