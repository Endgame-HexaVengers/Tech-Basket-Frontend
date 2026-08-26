import { AlertTriangle, ChevronDown, Package, Plus, Search, Trash2, UserPlus } from "lucide-react";

const inputClassName =
  "h-11 w-full rounded-sm border border-slate-200 bg-white px-3 text-[13px] text-slate-700 outline-none placeholder:text-slate-400";

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="mb-1.5 block text-[12px] font-medium text-slate-600">
    {children}
  </label>
);

const SaleField = ({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={className}>
    <FieldLabel>{label}</FieldLabel>
    {children}
  </div>
);

const NewSaleEntry = () => {
  return (
    <section className="min-h-[calc(100vh-64px)] bg-[#f6f8fa] px-5 py-6 text-slate-900 sm:px-8 lg:px-10">
      <div className="w-full">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-[28px] font-semibold tracking-tight">
            New Sale Entry
          </h1>
          <span className="text-[12px] font-medium text-slate-500">
            MPL Shop 1316
          </span>
        </div>

        <form className="space-y-3">
          <section className="rounded-md border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
            <h2 className="mb-4 text-[16px] font-semibold">Sales Person Information</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <SaleField label="Sales Person"><input className={inputClassName} defaultValue="Chan Badsha Bhuiyan" readOnly /></SaleField>
              <SaleField label="Employee ID"><input className={`${inputClassName} font-mono text-[12px]`} defaultValue="EMP-00125" readOnly /></SaleField>
              <SaleField label="Branch"><input className={inputClassName} defaultValue="Dhaka Branch" readOnly /></SaleField>
              <SaleField label="Sale Date"><input className={inputClassName} type="date" defaultValue="2026-08-25" /></SaleField>
            </div>
          </section>

          <section className="rounded-md border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
            <h2 className="mb-4 text-[16px] font-semibold">
              Customer Information
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <SaleField
                label="Search Customer by Phone"
                className="w-full sm:max-w-[320px]"
              >
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                  <input className={`${inputClassName} pl-8`} defaultValue="01712345678" />
                </div>
              </SaleField>
              <button
                className="h-9 rounded-sm bg-slate-200 px-4 text-[10px] font-semibold text-slate-700"
                type="button"
              >
                Search
              </button>
            </div>
            <div className="mt-3 flex items-start gap-2 rounded-sm border border-blue-200 bg-blue-100 px-3 py-3 text-slate-600">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div><p className="text-[12px] font-semibold">No Customer Found</p><p className="text-[10px]">This phone number is not registered. Please enter details to create a new customer profile.</p></div>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <SaleField label="Customer Name *"><input className={inputClassName} placeholder="Enter full name" /></SaleField>
              <SaleField label="Customer Type *"><select className={inputClassName} defaultValue=""><option value="" disabled>Select Type</option><option>Individual</option><option>Business</option></select></SaleField>
            </div>
            <SaleField label="Address (Optional)" className="mt-3"><input className={inputClassName} placeholder="Enter street address" /></SaleField>
            <div className="mt-3 flex justify-end"><button className="flex h-10 items-center gap-1 rounded-sm bg-[#123b9c] px-4 text-[10px] font-semibold text-white" type="button"><UserPlus className="h-3.5 w-3.5" />Create Customer</button></div>
          </section>

          <section className="rounded-md border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
            <h2 className="mb-4 text-[16px] font-semibold">
              Product Information
            </h2>
            <div className="grid gap-2 rounded-sm border border-slate-200 bg-slate-50 p-2 sm:grid-cols-[1fr_68px_108px_68px] sm:items-end">
              <SaleField label="Search Product (Name/SKU)">
                <div className="relative">
                  <Package className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                  <input
                    className={`${inputClassName} pl-8`}
                    placeholder="Type to search..."
                  />
                </div>
              </SaleField>
              <SaleField label="Qty">
                <input
                  className={inputClassName}
                  defaultValue="1"
                  type="number"
                  min="1"
                />
              </SaleField>
              <SaleField label="Sale Price">
                <input className={inputClassName} defaultValue="৳ 650" />
              </SaleField>
              <button
                className="flex h-9 items-center justify-center gap-1 rounded-sm bg-[#123b9c] text-[10px] font-semibold text-white"
                type="button"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full min-w-150 border-collapse text-left">
                <thead className="border-y border-slate-200 bg-slate-50 text-[9px] font-medium text-slate-500">
                  <tr>
                    <th className="px-2 py-2">Product &amp; SKU</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Discount</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="text-[10px]">
                  <tr className="border-b border-slate-100">
                    <td className="px-2 py-2 font-medium">
                      Logitech B175 Wireless Mouse{" "}
                      <span className="block font-mono text-[8px] font-normal text-slate-400">
                        SKU: LOG-B175-BLK
                      </span>
                    </td>
                    <td>5</td>
                    <td>৳ 650</td>
                    <td>৳ 0</td>
                    <td className="font-semibold">৳ 3,250</td>
                    <td>
                      <button aria-label="Remove Logitech mouse" type="button">
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-2 py-2 font-medium">
                      A4Tech KV-300H Keyboard{" "}
                      <span className="block font-mono text-[8px] font-normal text-slate-400">
                        SKU: A4T-KV300-01K
                      </span>
                    </td>
                    <td>2</td>
                    <td>৳ 1,200</td>
                    <td>৳ 100</td>
                    <td className="font-semibold">৳ 2,300</td>
                    <td>
                      <button aria-label="Remove A4Tech keyboard" type="button">
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid gap-3 lg:grid-cols-2">
            <section className="rounded-md border border-slate-200 bg-white p-4">
              <h2 className="mb-3 text-[13px] font-semibold">
                Payment Details
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <SaleField label="Payment Method">
                  <div className="relative">
                    <select
                      className={`${inputClassName} appearance-none`}
                      defaultValue="Cash"
                    >
                      <option>Cash</option>
                      <option>Bank Transfer</option>
                      <option>Card</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-3 h-3 w-3" />
                  </div>
                </SaleField>
                <SaleField label="Payment Status">
                  <div className="relative">
                    <select
                      className={`${inputClassName} appearance-none`}
                      defaultValue="Partial"
                    >
                      <option>Partial</option>
                      <option>Paid</option>
                      <option>Due</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-3 h-3 w-3" />
                  </div>
                </SaleField>
              </div>
              <SaleField label="Paid Amount" className="mt-3">
                <input className={inputClassName} defaultValue="৳ 3000" />
              </SaleField>
              <SaleField label="Remarks / Notes" className="mt-3">
                <textarea
                  className="h-10 w-full resize-none rounded-sm border border-slate-200 px-3 py-2 text-[10px] outline-none placeholder:text-slate-400"
                  placeholder="Add any internal notes here..."
                />
              </SaleField>
            </section>
            <section className="rounded-md border border-slate-200 bg-white p-4">
              <h2 className="mb-4 text-[13px] font-semibold">
                Financial Summary
              </h2>
              <div className="space-y-3 text-[10px]">
                <div className="flex justify-between">
                  <span>Subtotal (7 items)</span>
                  <span>৳ 5,650</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Discount</span>
                  <span className="text-red-500">− ৳ 100</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT / Tax (0%)</span>
                  <span>৳ 0</span>
                </div>
                <div className="my-2 border-t border-slate-200" />
                <div className="flex justify-between text-[13px] font-semibold">
                  <span>Grand Total</span>
                  <span>৳ 5,550</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Paid Amount</span>
                  <span>৳ 3,000</span>
                </div>
                <div className="flex justify-between rounded-sm bg-red-100 px-2 py-1 font-semibold text-red-600">
                  <span>Due Amount</span>
                  <span>৳ 2,550</span>
                </div>
              </div>
            </section>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-200 pt-3">
            <button
              className="h-9 rounded-sm border border-slate-200 bg-slate-100 px-5 text-[10px] font-semibold text-slate-600"
              type="reset"
            >
              Cancel
            </button>
            <button
              className="h-9 rounded-sm bg-[#123b9c] px-5 text-[10px] font-semibold text-white"
              type="submit"
            >
              Create Sale
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default NewSaleEntry;
