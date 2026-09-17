"use client";

import React from "react";
import { X, Printer, CheckCircle, ArrowDownLeft, Building2, User, Phone } from "lucide-react";
import { SalesReturn } from "@/types/sale";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  returnData: SalesReturn | null;
}

export default function SalesCreditNoteModal({ isOpen, onClose, returnData }: Props) {
  if (!isOpen || !returnData) return null;

  const handlePrint = () => {
    window.print();
  };

  const getSettlementLabel = (type?: string) => {
    switch (type) {
      case "adjust_due":
        return "Adjusted with Customer Due Balance";
      case "customer_credit":
        return "Store Credit Voucher (Future Purchase)";
      case "cash_refund":
        return "Direct Cash / Mobile Banking Refund Paid";
      default:
        return "Sales Return Settlement";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm print:p-0 print:bg-white animate-in fade-in overflow-y-auto">
      <div className="relative my-6 flex w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 print:border-none print:shadow-none print:my-0 overflow-hidden">
        {/* Actions Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-3.5 print:hidden">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <CheckCircle className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Credit Note Generated</h2>
              <p className="text-xs text-slate-500">Official customer sales return voucher</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl bg-[#123b9c] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-800 transition cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              Print Credit Note
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="p-8 print:p-6 text-slate-800 bg-white" id="credit-note-print-area">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#123b9c] text-white font-extrabold text-xl shadow-md">
                  TB
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight text-slate-900">TECH BASKET</h1>
                  <p className="text-xs text-slate-500 font-medium">Retail POS & Customer Care</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Customer Care & Returns: Level 4, Tech Plaza, Dhaka<br />
                Phone: +880 1700-000000 | Email: returns@techbasket.com
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block rounded bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
                CREDIT NOTE / RETURN SLIP
              </span>
              <p className="font-mono text-base font-bold text-slate-900 mt-1">
                {returnData.returnId}
              </p>
              <p className="text-xs text-slate-500">
                Date: {new Date(returnData.returnDate || returnData.createdAt).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Customer & Sale Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b border-slate-200 text-xs">
            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
              <span className="font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Customer Details:
              </span>
              <p className="text-sm font-bold text-slate-900">{returnData.customerName || "Customer"}</p>
              <p className="text-slate-600 mt-0.5 flex items-center gap-1">
                <Phone className="h-3 w-3 text-slate-400" /> {returnData.customerPhone}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Original Sale ID:</span>
                <span className="font-mono font-bold text-blue-900">{returnData.saleId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Invoice Number:</span>
                <span className="font-mono text-slate-700">{returnData.invoiceNo || returnData.saleId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Settlement Method:</span>
                <span className="font-semibold text-slate-800">{getSettlementLabel(returnData.settlementType)}</span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 w-8 text-center">#</th>
                  <th className="py-2.5 px-3">Item Name</th>
                  <th className="py-2.5 px-3">Return Reason</th>
                  <th className="py-2.5 px-3 text-center">Returned Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Refund Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {returnData.items?.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 text-center text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{item.productName}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.returnReason || returnData.returnReason}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-800">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-right text-slate-600">
                      ৳ {Number(item.unitPrice).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                      ৳ {Number(item.refundAmount).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-slate-300 bg-slate-50 font-bold">
                <tr>
                  <td colSpan={3} className="py-2.5 px-3 text-slate-600">Total Returned Units</td>
                  <td className="py-2.5 px-3 text-center text-slate-900">{returnData.totalReturnedQty}</td>
                  <td className="py-2.5 px-3 text-right text-slate-600">Total Refund:</td>
                  <td className="py-2.5 px-3 text-right text-sm text-[#123b9c]">
                    ৳ {Number(returnData.totalRefundAmount).toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {returnData.notes && (
            <div className="mt-4 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600 border border-slate-200">
              <span className="font-bold">Remarks:</span> {returnData.notes}
            </div>
          )}

          {/* Signatures */}
          <div className="mt-12 grid grid-cols-2 gap-12 text-center text-xs text-slate-500 pt-6">
            <div className="border-t border-slate-300 pt-1.5">
              <p className="font-semibold text-slate-700">Customer Signature</p>
            </div>
            <div className="border-t border-slate-300 pt-1.5">
              <p className="font-semibold text-slate-700">Authorized Officer</p>
              <p className="text-[10px] text-slate-400">TechBasket Returns</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-6 py-3.5 print:hidden">
          <p className="text-xs text-slate-400">This credit note confirms goods returned to inventory.</p>
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
