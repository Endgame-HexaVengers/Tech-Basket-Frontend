

import { useState } from 'react';

import {
  TbPlus,
  TbTrash,
  TbFileText,
  TbDeviceFloppy,
} from 'react-icons/tb';

import { CgSpinner } from 'react-icons/cg';

import { PurchaseItem } from '@/types/purchase';

import toast from 'react-hot-toast';
import { Button } from '@heroui/react';

interface Props {
  items: PurchaseItem[];
  onReset: () => void;
  onSave: () => void;
}

export default function PurchaseSummary({
  items,
  onReset,
  onSave,
}: Props) {
  const [loadingBtn, setLoadingBtn] =
    useState<string | null>(null);

  const totalProducts = items.length;

  const totalQuantity = items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const grandTotal = items.reduce(
    (acc, item) => acc + item.total,
    0
  );

  const handleAction = (
    type: string,
    actionFn: () => void,
    message: string
  ) => {
    setLoadingBtn(type);

    setTimeout(() => {
      actionFn();

      setLoadingBtn(null);

      // Show only if message exists
      if (message) {
        toast.success(message);
      }
    }, 700);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">

      {/* Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">

        <h2 className="text-lg font-bold text-slate-800">
          Purchase Summary
        </h2>

        <div className="flex flex-wrap items-center gap-6 text-slate-600 text-sm">

          {/* Total Products */}
          <div>
            <span className="block text-xs text-slate-400 font-medium">
              Total Products
            </span>

            <span className="font-semibold text-slate-800">
              {totalProducts}
            </span>
          </div>

          {/* Total Quantity */}
          <div>
            <span className="block text-xs text-slate-400 font-medium">
              Total Quantity
            </span>

            <span className="font-semibold text-slate-800">
              {totalQuantity}
            </span>
          </div>

          {/* Subtotal */}
          <div>
            <span className="block text-xs text-slate-400 font-medium">
              Subtotal
            </span>

            <span className="font-bold text-slate-800">
              ৳ {grandTotal.toLocaleString()}
            </span>
          </div>

          {/* Grand Total */}
          <div className="bg-blue-900 text-white px-5 py-2 rounded-xl shadow-inner">

            <span className="block text-[10px] uppercase font-bold text-blue-200">
              Grand Total
            </span>

            <span className="text-xl font-extrabold">
              ৳ {grandTotal.toLocaleString()}
            </span>

          </div>

        </div>

      </div>

      {/* Buttons */}
      <div className="flex flex-wrap justify-end items-center gap-3 pt-4 border-t border-slate-100">

        {/* Add */}
        <Button
          type="button"
          onClick={() =>
            handleAction(
              'add',
              () => {},
              'Add action completed successfully!'
            )
          }
          isDisabled={loadingBtn !== null}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded cursor-pointer  transition disabled:opacity-50"
        >

          {loadingBtn === 'add' ? (
            <CgSpinner className="animate-spin" />
          ) : (
            <TbPlus />
          )}

          Add

        </Button>

        {/* Clear */}
        <Button
          type="button"
          onClick={() =>
            handleAction(
              'clear',
              onReset,
              'Purchase order cleared successfully!'
            )
          }
          isDisabled={loadingBtn !== null}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-sm rounded cursor-pointer  transition disabled:opacity-50"
        >

          {loadingBtn === 'clear' ? (
            <CgSpinner className="animate-spin" />
          ) : (
            <TbTrash />
          )}

          Clear

        </Button>

        {/* Report */}
        <Button
          type="button"
          onClick={() =>
            handleAction(
              'report',
              () => {},
              'Report generated successfully!'
            )
          }
          isDisabled={loadingBtn !== null}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-100
           hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded cursor-pointer  transition disabled:opacity-50"
        >

          {loadingBtn === 'report' ? (
            <CgSpinner className="animate-spin" />
          ) : (
            <TbFileText />
          )}

          Report

        </Button>

        {/* Save */}
        <Button
          type="button"
          onClick={() =>
            handleAction(
              'save',
              onSave,
              'Purchase order saved successfully!')}
          isDisabled={loadingBtn !== null}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-700 hover:bg-blue-800
           text-white font-semibold text-sm rounded cursor-pointer shadow-md transition disabled:opacity-50"
        >

          {loadingBtn === 'save' ? (
            <CgSpinner className="animate-spin" />
          ) : (
            <TbDeviceFloppy />
          )}

          Save Purchase Order

        </Button>

      </div>

    </div>
  );
}