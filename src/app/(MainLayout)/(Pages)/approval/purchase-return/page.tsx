"use client";

import { Check, FileBarChart, X } from "lucide-react";
import { useState } from "react";

const requests = [
  { id: "PR-2026-00018", purchaseId: "PUR-000342", supplier: "Global Tech Suppliers", date: "2026-08-25", requestedBy: "Store Manager", amount: "৳ 1,300" },
  { id: "PR-2026-00017", purchaseId: "PUR-000341", supplier: "ABC Distribution", date: "2026-08-24", requestedBy: "Branch Manager", amount: "৳ 650" },
];

export default function PurchaseReturnApprovalPage() {
  const [selectedId, setSelectedId] = useState("");
  const [message, setMessage] = useState("");

  const clearSelection = () => {
    setSelectedId("");
    setMessage("");
  };

  return (
    <section className="flex min-h-[calc(100vh-72px)] w-full flex-col bg-[#f8fafc] px-4 py-8 text-[#20262d] sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-360 flex-1 flex-col">
        <header className="mb-6">
          <h1 className="text-2xl font-extrabold tracking-[-0.04em] text-[#17202a]">PURCHASE RETURN APPROVAL</h1>
          <p className="mt-1 text-sm font-semibold text-slate-600">Select a pending purchase return to approve or reject it.</p>
        </header>

        <div className="overflow-hidden rounded-md border border-slate-300 bg-white shadow-sm">
          <div className="flex items-center justify-between bg-[#eef1f6] px-4 py-3">
            <h2 className="text-sm font-extrabold uppercase text-slate-700">Pending Purchase Returns for Approval</h2>
            <span className="rounded-full bg-[#dbe5ff] px-3 py-1 text-xs font-bold text-blue-900">{requests.length} Records Found</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-200 text-left text-sm">
              <thead className="border-t border-slate-300 bg-white text-xs font-extrabold text-slate-600">
                <tr>
                  <th className="px-4 py-3">Select</th><th>Return ID</th><th>Purchase ID</th><th>Supplier</th><th>Return Date</th><th>Requested By</th><th>Total Amount</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => {
                  const selected = selectedId === request.id;
                  return (
                    <tr key={request.id} className={`border-t border-slate-200 ${selected ? "bg-[#dce3ff]" : "hover:bg-slate-50"}`}>
                      <td className="px-4 py-4">
                        <button type="button" aria-label={`Select ${request.id}`} onClick={() => setSelectedId(request.id)} className={`flex h-4 w-4 items-center justify-center rounded-full border ${selected ? "border-blue-900 bg-blue-900" : "border-slate-400"}`}>
                          {selected && <Check className="h-3 w-3 text-white" />}
                        </button>
                      </td>
                      <td className="font-mono text-xs font-bold text-blue-900">{request.id}</td>
                      <td className="font-mono text-xs">{request.purchaseId}</td><td>{request.supplier}</td><td>{request.date}</td><td>{request.requestedBy}</td><td className="font-semibold">{request.amount}</td>
                      <td><span className="rounded-full bg-[#dbe8ff] px-3 py-1 text-[10px] font-bold text-blue-900">PENDING</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {message && <p className="mt-4 text-center text-sm font-bold text-blue-800">{message}</p>}
        <div className="mt-auto flex flex-wrap items-center justify-end gap-4 border-t border-slate-300 pt-8">
          <button type="button" onClick={clearSelection} className="h-11 border border-slate-300 bg-white px-8 text-sm font-bold text-slate-700 hover:bg-slate-50"><X className="mr-2 inline h-4 w-4" />Clear</button>
          <button type="button" onClick={() => setMessage("Report is ready to download.")} className="h-11 bg-slate-200 px-8 text-sm font-bold text-slate-500 hover:bg-slate-300"><FileBarChart className="mr-2 inline h-4 w-4" />Report</button>
          <button type="button" disabled={!selectedId} onClick={() => setMessage(`${selectedId} approved successfully.`)} className="h-11 bg-[#2455db] px-10 text-sm font-bold text-white hover:bg-[#0d47da] disabled:opacity-50"><Check className="mr-2 inline h-4 w-4" />Save (Approve)</button>
        </div>
      </div>
    </section>
  );
}