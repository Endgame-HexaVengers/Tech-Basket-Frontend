import {
  ChevronDown,
  Edit3,
  Eye,
  Printer,
  Save,
  Search,
  Trash2,
} from "lucide-react";

const fieldClass =
  "h-10 w-full rounded-sm border border-slate-300 bg-white px-3 text-[13px] text-slate-700 outline-none";
const labelClass =
  "mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-600";

const SalesInvoicePage = () => {
  return (
    <section className="min-h-[calc(100vh-64px)] bg-[#f5f7f9] px-5 py-5 text-slate-900 sm:px-8 lg:px-10">
      <div className="w-full space-y-3">
        <header className="flex items-start justify-between border-b border-slate-200 pb-3">
          <div className="flex items-start gap-2">
            <div>
              <h1 className="text-[24px] font-bold text-blue-950">
                Generate Enterprise Invoice
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                TechBasket ERP • Sales Module
              </p>
            </div>
        
          </div>
        </header>

        <section className="rounded-sm border border-slate-200 bg-white p-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_auto] lg:items-end">
            <div>
              <label className={labelClass}>Branch Name *</label>
              <div className="relative">
                <select
                  className={`${fieldClass} appearance-none`}
                  defaultValue="Dhaka Branch"
                >
                  <option>Dhaka Branch</option>
                  <option>Chittagong Branch</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-3 w-3" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Date From *</label>
              <input
                className={fieldClass}
                type="date"
                defaultValue="2026-08-01"
              />
            </div>
            <div>
              <label className={labelClass}>Date To *</label>
              <input
                className={fieldClass}
                type="date"
                defaultValue="2026-08-25"
              />
            </div>
            <button
              className="h-10 rounded-sm bg-[#063b98] px-5 text-[11px] font-bold text-white"
              type="button"
            >
              <Search className="mr-1 inline h-3 w-3" />
              Load Sales
            </button>
          </div>
        </section>

        <section className="border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2">
            <h2 className="text-[14px] font-bold text-blue-950">
              Sales Created
            </h2>
            <span className="text-[10px] text-emerald-700">
              ● Available for Invoice
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-162.5 text-left text-[12px]">
              <thead className="bg-slate-100 text-[10px] uppercase text-slate-600">
                <tr>
                  <th className="px-3 py-2">Select</th>
                  <th>Sale ID</th>
                  <th>Customer</th>
                  <th>Sale Date</th>
                  <th>Sales Person</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="px-3 py-2">
                    <input defaultChecked type="radio" name="sale" />
                  </td>
                  <td className="font-mono font-semibold text-blue-800">
                    SALE-000242
                  </td>
                  <td>Karim Traders</td>
                  <td>25 Aug 2026</td>
                  <td>John Doe</td>
                  <td className="font-semibold">$450.00</td>
                  <td>
                    <span className="bg-emerald-100 px-2 py-1 text-[7px] font-bold text-emerald-700">
                      READY FOR INVOICE
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-slate-200 text-slate-400">
                  <td className="px-3 py-2">
                    <input type="radio" name="sale" />
                  </td>
                  <td className="font-mono">SALE-000241</td>
                  <td>ABC Corp</td>
                  <td>24 Aug 2026</td>
                  <td>Jane Smith</td>
                  <td>$300.00</td>
                  <td>
                    <span className="bg-slate-100 px-2 py-1 text-[7px]">
                      INVOICED
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-end border-t border-slate-200 px-3 py-3">
            <button
              className="h-9 bg-[#063b98] px-4 text-[11px] font-bold text-white"
              type="button"
            >
              Load Selected Sale
            </button>
          </div>
        </section>

        <div className="grid gap-3 lg:grid-cols-2">
          <section className="border border-slate-200 bg-white p-3">
            <h2 className="mb-3 text-[12px] font-bold uppercase tracking-widest text-slate-600">
              ◎ Sale Information
            </h2>
            <div className="grid grid-cols-2 gap-y-3 text-[12px]">
              <p>
                SALE ID
                <br />
                <b className="text-blue-900">SALE-000242</b>
              </p>
              <p>
                SALE DATE
                <br />
                <b>25 Aug 2026</b>
              </p>
              <p>
                SALES PERSON
                <br />
                <b>John Doe</b>
              </p>
              <p>
                EMPLOYEE ID
                <br />
                <b>EMP-0921</b>
              </p>
              <p>
                BRANCH
                <br />
                <b>Dhaka Branch</b>
              </p>
              <p>
                STATUS
                <br />
                <b className="text-emerald-700">Active</b>
              </p>
            </div>
          </section>
          <section className="border border-slate-200 bg-white p-3">
            <h2 className="mb-3 text-[12px] font-bold uppercase tracking-widest text-slate-600">
              ♙ Customer Information
            </h2>
            <div className="grid grid-cols-2 gap-y-3 text-[12px]">
              <p>
                PHONE NUMBER
                <br />
                <b>01712345678</b>
              </p>
              <p>
                CUSTOMER ID
                <br />
                <b>CUST-0821</b>
              </p>
              <p>
                TYPE
                <br />
                <b>Business Account</b>
              </p>
              <p>
                NAME
                <br />
                <b>Karim Traders</b>
              </p>
              <p className="col-span-2">
                ADDRESS
                <br />
                <b>12/A Park Street, Dhaka 1205, Bangladesh</b>
              </p>
            </div>
          </section>
        </div>

        <section className="border border-slate-200 bg-white p-3">
          <h2 className="mb-3 text-[13px] font-bold uppercase tracking-widest text-slate-600">
            Sale Line Items
          </h2>
          <table className="w-full text-left text-[12px]">
            <thead className="border-y border-slate-200 bg-slate-100 text-[10px] uppercase text-slate-600">
              <tr>
                <th className="px-2 py-2">No</th>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Sale Price</th>
                <th>Discount</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="px-2 py-2">01</td>
                <td>Logitech B175 Wireless Mouse</td>
                <td className="font-mono">LOG-B175-BLK</td>
                <td>2</td>
                <td>$150.00</td>
                <td>$10.00</td>
                <td className="font-bold">$290.00</td>
              </tr>
              <tr>
                <td className="px-2 py-2">02</td>
                <td>Logitech K120 Wired Keyboard</td>
                <td className="font-mono">LOG-K120-USB</td>
                <td>1</td>
                <td>$160.00</td>
                <td>$0.00</td>
                <td className="font-bold">$160.00</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="border border-slate-200 bg-white p-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-slate-600">
              ⚑ Serial Number Assignment
            </h2>
            <span className="rounded bg-indigo-100 px-2 py-1 text-[7px] font-bold text-indigo-700">
              BATCH PROCESSING
            </span>
          </div>
          <div className="grid gap-3 lg:grid-cols-3">
            <div>
              <label className={labelClass}>Select Product *</label>
              <select className={fieldClass} defaultValue="Logitech B175 Mouse">
                <option>Logitech B175 Mouse</option>
              </select>
              <div className="mt-2 border border-slate-200 bg-slate-50 p-2 text-[8px]">
                <p className="text-slate-500">Selected Status</p>
                <b>Logitech B175 Mouse</b>
                <br />
                Required: 2 &nbsp;{" "}
                <span className="text-red-600">Selected: 0/2</span>
              </div>
            </div>
            <div>
              <label className={labelClass}>Search Serial Number</label>
              <div className="relative">
                <Search className="absolute left-2 top-2 h-3 w-3 text-slate-400" />
                <input
                  className={`${fieldClass} pl-7`}
                  placeholder="Type to search serial..."
                />
              </div>
              <p className="mt-2 text-[8px]">SN-LOT-001928 (In Stock)</p>
              <p className="mt-2 text-[8px]">SN-LOT-001929 (In Stock)</p>
            </div>
            <div>
              <label className={labelClass}>Available Serials</label>
              <div className="space-y-2 border border-slate-200 p-2 text-[8px]">
                <label className="block">
                  <input type="checkbox" /> SN-LOT-001928
                </label>
                <label className="block">
                  <input type="checkbox" /> SN-LOT-001929
                </label>
                <label className="block">
                  <input type="checkbox" /> SN-LOT-001930
                </label>
              </div>
            </div>
          </div>
          <div className="mt-3 border-t border-slate-200 pt-3 text-[8px]">
            <b>Pending Assignment Chips</b>
            <span className="ml-3 rounded bg-blue-100 px-2 py-1 text-blue-800">
              SN-LOT-001928 ×
            </span>
            <span className="ml-2 rounded border border-dashed px-2 py-1 text-slate-500">
              Waiting for 1 more serial...
            </span>
          </div>
        </section>

        <section className="border border-slate-200 bg-white p-3">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-slate-600">
              Confirmed Assignments
            </h2>
            <span className="text-[8px] font-bold text-emerald-700">
              Assigned Products: 2 / 2 ✓
            </span>
          </div>
          <table className="w-full text-left text-[12px]">
            <thead className="border-y border-slate-200 bg-slate-100 text-[10px] uppercase">
              <tr>
                <th className="px-2 py-2">No</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Selected Serial Numbers</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="px-2 py-2">01</td>
                <td>Logitech B175 Mouse</td>
                <td>2</td>
                <td>
                  <span className="font-mono text-[8px]">SN-LOT-001928</span>
                </td>
                <td>
                  <Edit3 className="inline h-3 w-3 text-blue-700" />{" "}
                  <Trash2 className="ml-2 inline h-3 w-3 text-red-500" />
                </td>
              </tr>
              <tr>
                <td className="px-2 py-2">02</td>
                <td>Logitech K120 Keyboard</td>
                <td>1</td>
                <td>
                  <span className="font-mono text-[8px]">SN-LOT-001927</span>
                </td>
                <td>
                  <Edit3 className="inline h-3 w-3 text-blue-700" />{" "}
                  <Trash2 className="ml-2 inline h-3 w-3 text-red-500" />
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3">
          <button
            className="h-8 bg-[#063b98] px-4 text-[9px] font-bold text-white"
            type="button"
          >
            <Save className="mr-1 inline h-3 w-3" />
            Save &amp; Finalize Invoice
          </button>
          <button className="text-[8px] font-bold text-red-600" type="button">
            Clear All Data
          </button>
          <div className="flex gap-2">
            <button
              className="h-8 border border-slate-400 px-4 text-[8px] font-bold"
              type="button"
            >
              <Printer className="mr-1 inline h-3 w-3" />
              Report
            </button>
            <button
              className="h-8 border border-slate-400 px-4 text-[8px] font-bold"
              type="button"
            >
              <Eye className="mr-1 inline h-3 w-3" />
              Preview
            </button>
          </div>
        </footer>
        <p className="pt-4 text-center text-[7px] text-slate-400">
          TechBasket Enterprise Resource Planning • Secure Session ID:
          TB-0922-AX881
        </p>
      </div>
    </section>
  );
};

export default SalesInvoicePage;
