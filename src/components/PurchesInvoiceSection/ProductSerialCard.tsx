
import React from "react";
import { ProgressBar, Chip, Input } from "@heroui/react";
import { FiCheckCircle, FiAlertTriangle } from "react-icons/fi";

export interface SerialItem {
  id: number;
  serialNumber: string;
  isValid: boolean;
  error?: string;
}

export interface ProductGroup {
  id: string;
  name: string;
  totalQuantity: number;
  serials: SerialItem[];
}

export const ProductSerialCard: React.FC<{ product: ProductGroup }> = ({ product }) => {
  const completedCount = product.serials.filter((s) => s.isValid && s.serialNumber).length;
  const progressValue = (completedCount / product.totalQuantity) * 100;
  const isComplete = completedCount === product.totalQuantity;

  return (
    <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm mb-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-800">{product.name}</h3>
          <p className="text-xs text-gray-500 font-medium">Quantity: {product.totalQuantity}</p>
        </div>
        <div className="flex items-center gap-3 w-48 justify-end">
          <span className={`text-xs font-semibold ${isComplete ? "text-green-600" : "text-amber-600"}`}>
            {completedCount} / {product.totalQuantity} Completed
          </span>
          <ProgressBar
            aria-label="Serial Progress"
            value={progressValue}
            color={isComplete ? "success" : "warning"}
            className="w-20"
          />
        </div>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <div className="grid grid-cols-12 text-xs font-semibold text-gray-500 pb-2 px-2">
          <span className="col-span-1">#</span>
          <span className="col-span-8">Serial Number</span>
          <span className="col-span-3 text-right">Status</span>
        </div>

        {product.serials.map((item, index) => (
          <div key={item.id} className="grid grid-cols-12 items-center py-2 px-2 border-t border-gray-50">
            <span className="col-span-1 text-xs font-medium text-gray-400">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="col-span-8 pr-4">
              {item.isValid ? (
                <div className="px-3 py-2 bg-gray-200 rounded-md text-sm font-semibold text-gray-700">
                  {item.serialNumber}
                </div>
              ) : (
                <div>
                  <Input
                    placeholder="Enter or scan serial number"
                    defaultValue={item.serialNumber}
                    className={`w-full ${
                      item.error ? "border-red-500 bg-red-50/20 focus:border-red-600" : ""
                    }`}
                  />
                  {item.error && (
                    <p className="text-[10px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                      <FiAlertTriangle className="w-3 h-3" /> {item.error}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="col-span-3 flex justify-end">
              {item.isValid ? (
                <Chip variant="soft" color="success">
                  <span className="flex items-center gap-1">
                    <FiCheckCircle /> Valid
                  </span>
                </Chip>
              ) : (
                <Chip variant="soft" className="bg-gray-200 text-gray-600">
                  Pending
                </Chip>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};