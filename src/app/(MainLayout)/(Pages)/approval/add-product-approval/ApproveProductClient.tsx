"use client";

import { Check, X } from "lucide-react";

type ApproveProductProps = {
  productName: string;
  onClose: () => void;
  onApprove: () => void;
};

export default function ApproveProduct({
  productName,
  onClose,
  onApprove,
}: ApproveProductProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#172235]/45 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="approve-product-title"
        className="w-full max-w-130 overflow-hidden rounded-lg bg-white shadow-2xl"
      >
        <div className="px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#0639a6] text-white">
              <Check size={20} strokeWidth={3} />
            </span>
            <div className="min-w-0 flex-1">
              <h2
                id="approve-product-title"
                className="text-[18px] font-semibold text-[#172235]"
              >
                Approve Product?
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close approval dialog"
              className="rounded p-1 text-[#526079] hover:bg-[#f1f5f9]"
            >
              <X size={19} />
            </button>
          </div>
          <div className="mt-4 space-y-3 text-[13px] leading-5 text-[#344054]">
            <p>
              You are about to approve:{" "}
              <strong className="text-[#172235]">{productName}</strong>.
            </p>
            <div>
              <p>
                Once approved, this product will become active and available
                for:
              </p>
              <ul className="mt-1 space-y-0.5 text-[#172235]">
                <li>
                  <span className="mr-2 text-[#159447]">✓</span>Purchase
                </li>
                <li>
                  <span className="mr-2 text-[#159447]">✓</span>Sales
                </li>
                <li>
                  <span className="mr-2 text-[#159447]">✓</span>RMA / Warranty
                  Claim
                </li>
                <li>
                  <span className="mr-2 text-[#159447]">✓</span>Stock Management
                </li>
                <li>
                  <span className="mr-2 text-[#159447]">✓</span>Stock Transfer
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-[#d9dee7] bg-[#f8fafc] px-5 py-3 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-sm bg-[#e5e7eb] px-4 text-[12px] font-medium text-[#344054] hover:bg-[#dce0e5]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onApprove}
            className="inline-flex h-9 items-center gap-2 rounded-sm bg-[#0639a6] px-4 text-[12px] font-semibold text-white hover:bg-[#052d86]"
          >
            <Check size={15} /> Approve Product
          </button>
        </div>
      </div>
    </div>
  );
}
