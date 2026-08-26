"use client";

import { PurchaseOrder } from "@/types/types";



interface PurchaseOrderTableProps {
  orders: PurchaseOrder[];
  selectedOrderIds: string[];
  onSelectAll: (checked: boolean) => void;
  onToggleOrder: (id: string) => void;
}

export default function PurchaseOrderTable({
  orders,
  selectedOrderIds,
  onSelectAll,
  onToggleOrder,
}: PurchaseOrderTableProps) {
  const allSelected =
    orders.length > 0 && selectedOrderIds.length === orders.length;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
      
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100/70 px-4 py-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={(e) => onSelectAll(e.target.checked)}
            className="h-4 w-4 cursor-pointer accent-indigo-600"
          />

          Select All
        </label>

        <span className="rounded-full bg-blue-100/80 px-3 py-1 text-xs font-semibold text-slate-700">
          {selectedOrderIds.length} Purchase Orders Selected
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        <div className="bg-slate-50 px-12 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Invoice Number
        </div>

        {orders.map((order) => {
          const isSelected = selectedOrderIds.includes(order.id);

          return (
            <div
              key={order.id}
              onClick={() => onToggleOrder(order.id)}
              className="flex cursor-pointer items-center gap-6 px-4 py-3 transition-colors hover:bg-slate-50/80"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleOrder(order.id)}
                onClick={(e) => e.stopPropagation()}
                className="h-4 w-4 cursor-pointer accent-indigo-900"
              />

              <span className="text-sm font-medium text-slate-700">
                {order.invoiceNumber}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}