"use client";

import React from "react";
import { X, Printer, CheckCircle2, User, Phone, MapPin, Calendar, Building2 } from "lucide-react";
import { Sale } from "@/types/sale";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sale: Sale | null;
}

export default function SaleReceiptModal({ isOpen, onClose, sale }: Props) {
  if (!isOpen || !sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm print:p-0 print:bg-white animate-in fade-in overflow-y-auto">
      <div className="relative my-6 flex w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 print:border-none print:shadow-none print:my-0 overflow-hidden">
        {/* Actions Bar (hidden when printing) */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-3.5 print:hidden">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Sale Completed Successfully</h2>
              <p className="text-xs text-slate-500">Official sales invoice & receipt</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#123b9c] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-800 transition cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              Print Invoice
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Paper */}
        <div className="p-8 print:p-6 text-slate-800 bg-white" id="sale-receipt-area">
          {/* Company Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#123b9c] text-white font-extrabold text-xl shadow-md">
                  TB
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight text-slate-900">TECH BASKET</h1>
                  <p className="text-xs text-slate-500 font-medium">Smart Retail & POS Solutions</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Corporate Office: Level 4, Tech Plaza, Dhaka, Bangladesh<br />
                Phone: +880 1700-000000 | Email: sales@techbasket.com
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block rounded bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">
                SALES INVOICE
              </span>
              <p className="font-mono text-base font-bold text-slate-900 mt-1">
                {sale.invoiceNo || sale.id}
              </p>
              <p className="text-xs text-slate-500">
                Date: {new Date(sale.saleDate || sale.createdAt).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="text-xs text-slate-500">Sale ID: {sale.id}</p>
            </div>
          </div>

          {/* Customer & Branch Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b border-slate-200 text-xs">
            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
              <span className="font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Billed To (Customer):
              </span>
              <p className="text-sm font-bold text-slate-900">{sale.customer?.name}</p>
              <p className="text-slate-600 mt-0.5 flex items-center gap-1">
                <Phone className="h-3 w-3 text-slate-400" /> {sale.customer?.phone}
              </p>
              {sale.customer?.address && (
                <p className="text-slate-600 mt-0.5 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-slate-400" /> {sale.customer?.address}
                </p>
              )}
            </div>

            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Sales Person:</span>
                <span className="font-semibold text-slate-800">{sale.salesPerson?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Branch:</span>
                <span className="font-semibold text-slate-800">{sale.branch?.branchName || "Dhaka Branch"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Payment Method:</span>
                <span className="font-semibold text-slate-800">{sale.paymentMethod || "Cash"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Payment Status:</span>
                <span
                  className={`font-bold ${
                    sale.paymentStatus === "Paid"
                      ? "text-emerald-700"
                      : sale.paymentStatus === "Partial"
                      ? "text-amber-700"
                      : "text-red-600"
                  }`}
                >
                  {sale.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 w-8 text-center">#</th>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Discount</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sale.items?.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 text-center text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      {item.productName}
                      {item.sku && <span className="block text-[10px] text-slate-400 font-mono">SKU: {item.sku}</span>}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-800">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-right text-slate-600">
                      ৳ {Number(item.unitPrice).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500">
                      {Number(item.discount || 0) > 0 ? `৳ ${Number(item.discount).toLocaleString()}` : "—"}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                      ৳ {Number(item.subtotal).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Breakdown */}
          <div className="mt-4 flex justify-end">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>৳ {Number(sale.subTotal).toLocaleString()}</span>
              </div>
              {Number(sale.totalDiscount || 0) > 0 && (
                <div className="flex justify-between text-red-600 font-medium">
                  <span>Total Discount</span>
                  <span>− ৳ {Number(sale.totalDiscount).toLocaleString()}</span>
                </div>
              )}
              {Number(sale.tax || 0) > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Tax / VAT</span>
                  <span>+ ৳ {Number(sale.tax).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-300 pt-1.5 font-black text-sm text-slate-900">
                <span>Grand Total</span>
                <span className="text-[#123b9c]">৳ {Number(sale.grandTotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Paid Amount</span>
                <span>৳ {Number(sale.paidAmount).toLocaleString()}</span>
              </div>
              {Number(sale.dueAmount || 0) > 0 && (
                <div className="flex justify-between text-red-600 font-bold bg-red-50 p-1 rounded">
                  <span>Due Balance</span>
                  <span>৳ {Number(sale.dueAmount).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Remarks */}
          {sale.remarks && (
            <div className="mt-4 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600 border border-slate-200">
              <span className="font-bold">Remarks:</span> {sale.remarks}
            </div>
          )}

          {/* Footer Signatures */}
          <div className="mt-12 grid grid-cols-2 gap-12 text-center text-xs text-slate-500 pt-6">
            <div className="border-t border-slate-300 pt-1.5">
              <p className="font-semibold text-slate-700">Customer Signature</p>
            </div>
            <div className="border-t border-slate-300 pt-1.5">
              <p className="font-semibold text-slate-700">Authorized Signature</p>
              <p className="text-[10px] text-slate-400">TechBasket ERP</p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-6 py-3.5 print:hidden">
          <p className="text-xs text-slate-400">Thank you for your business!</p>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-300 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
