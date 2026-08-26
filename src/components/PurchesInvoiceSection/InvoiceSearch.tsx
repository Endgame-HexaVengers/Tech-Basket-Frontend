"use client";

import React, { useState } from "react";
import { Input, Button, Spinner } from "@heroui/react";
import { FiRefreshCw } from "react-icons/fi";

interface Props {
  onSearch: (invoiceNum: string) => void;
}

export const InvoiceSearch: React.FC<Props> = ({ onSearch }) => {
  const [invoice, setInvoice] = useState("INV-2026-000125");
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadClick = () => {
    setIsLoading(true);

    setTimeout(() => {
      onSearch(invoice);
      setIsLoading(false);
    }, 2500);
  };

  return (
    <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
      <div className="flex items-end gap-3">
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-sm font-semibold text-gray-600">
            Purchase Invoice Number
          </label>
          <Input
            placeholder="Enter Invoice Number"
            value={invoice}
            onChange={(e) => setInvoice(e.target.value)}
            disabled={isLoading}
            className="border border-gray-300 bg-white rounded-lg focus:border-blue-600 outline-none px-3 py-2 text-sm disabled:opacity-60"
          />
        </div>

        <Button
          onClick={handleLoadClick}
          isDisabled={isLoading}
          className="bg-[#001f54] hover:bg-[#00153a] text-white font-semibold px-6 h-[40px] flex items-center justify-center gap-2 rounded-lg disabled:opacity-70 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Spinner size="sm" color="current" className="text-white" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <FiRefreshCw className="w-4 h-4" />
              <span>Load</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};