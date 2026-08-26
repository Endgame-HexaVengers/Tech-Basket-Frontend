

import React from "react";
import { Button } from "@heroui/react";
import { FiAlertTriangle } from "react-icons/fi";

interface SummaryProps {
  totalProducts: number;
  totalQuantity: number;
  subtotal: number;
  grandTotal: number;
  completedSerials: number;
  totalSerials: number;
  onCancel?: () => void;
  onGenerate?: () => void;
}

export const PurchaseSummary: React.FC<SummaryProps> = ({
  totalProducts,
  totalQuantity,
  subtotal,
  grandTotal,
  completedSerials,
  totalSerials,
  onCancel,
  onGenerate,
}) => {
  const isIncomplete = completedSerials < totalSerials;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      {/* Summary Box */}
      <div className="md:col-span-2 p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-3">Purchase Summary</h3>
        <div className="grid grid-cols-4 gap-4 pt-4">
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Products</p>
            <p className="text-base font-bold text-gray-800">{totalProducts}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Quantity</p>
            <p className="text-base font-bold text-gray-800">{totalQuantity}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Subtotal</p>
            <p className="text-base font-bold text-gray-400 line-through">
              ৳{subtotal.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Grand Total</p>
            <p className="text-xl font-extrabold text-[#001f54]">
              ৳{grandTotal.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Action Box */}
      <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
        {isIncomplete && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-red-600">
            <FiAlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold">Serial numbers incomplete</p>
              <p className="text-[11px] font-medium">
                {completedSerials} / {totalSerials} serial numbers verified
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            className="w-1/2 border-gray-300 font-semibold"
            onPress={onCancel}
          >
            Cancel
          </Button>
          <Button
            isDisabled={isIncomplete}
            className={`w-1/2 font-semibold ${
              isIncomplete ? "bg-gray-200 text-gray-400" : "bg-[#001f54] text-white"
            }`}
            onPress={onGenerate}
          >
            Generate Invoice
          </Button>
        </div>
      </div>
    </div>
  );
};