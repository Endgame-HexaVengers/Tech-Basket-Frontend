

import React from "react";

interface InfoData {
  invoiceNumber: string;
  purchaseOrder: string;
  supplier: string;
  purchaseDate: string;
  branch: string;
}

export const PurchaseInfoCard: React.FC<{ data: InfoData }> = ({ data }) => {
  return (
    <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Purchase Information</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div>
          <p className="text-xs text-gray-500 font-medium">Invoice Number</p>
          <p className="text-sm font-bold text-gray-800">{data.invoiceNumber}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">Purchase Order</p>
          <p className="text-sm font-bold text-blue-700">{data.purchaseOrder}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">Supplier</p>
          <p className="text-sm font-semibold text-gray-800">{data.supplier}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">Purchase Date</p>
          <p className="text-sm font-semibold text-gray-800">{data.purchaseDate}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">Branch</p>
          <p className="text-sm font-semibold text-gray-800">{data.branch}</p>
        </div>
      </div>
    </div>
  );
};