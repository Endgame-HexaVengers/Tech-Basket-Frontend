"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const products = [
  ["Logitech B175 Mouse", "LOG-B175-WH", "Logitech", "Mouse", "White"],
  ["Logitech B175 Mouse", "LOG-B175-BK", "Logitech", "Mouse", "Black"],
  ["Logitech K120 Keyboard", "LOG-K120-BK", "Logitech", "Keyboard", "Black"],
  ["Dell P2422H Monitor", "DEL-P2422H", "Dell", "Monitor", "Black"],
];

export default function ProductClient() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const visibleProducts = useMemo(
    () =>
      products.filter(([name, sku]) =>
        `${name} ${sku}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  return (
    <section className="min-h-[calc(100vh-108px)] bg-[#f8fafc] px-5 py-5 text-[#172235] sm:px-7 lg:px-9">
      <div className="mx-auto max-w-360">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-[25px] font-bold text-[#111827]">Products</h1>
            <p className="text-[13px] text-[#536174]">
              Manage product information, SKU, brand, category and warranty
              details.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/admin/products/add")}
            className="h-10 rounded-lg bg-[#2949a8] px-4 text-[13px] font-semibold text-white"
          >
            Add Product
          </button>
        </div>
        <div className="overflow-x-auto rounded-[7px] border border-[#d8dee8] bg-white">
          <div className="border-b border-[#edf0f4] p-4">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by product title or SKU..."
              className="h-9 w-full max-w-75 rounded-lg border border-[#d6dce6] px-3 text-[12px]"
            />
          </div>
          <table className="w-full min-w-190 text-left text-[12px]">
            <thead className="bg-[#f1f3f6] text-[10px] uppercase text-[#43516a]">
              <tr>
                {["Product", "SKU", "Brand", "Category", "Color"].map(
                  (heading) => (
                    <th key={heading} className="h-10 px-4">
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {visibleProducts.map((product) => (
                <tr key={product[1]} className="h-14 border-t border-[#edf0f4]">
                  <td className="px-4 font-medium">{product[0]}</td>
                  <td className="px-4">{product[1]}</td>
                  <td className="px-4">{product[2]}</td>
                  <td className="px-4">{product[3]}</td>
                  <td className="px-4">{product[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {visibleProducts.length === 0 && (
            <p className="p-10 text-center text-sm text-[#718096]">
              No products match the current search.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
