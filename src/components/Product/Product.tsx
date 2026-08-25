"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Keyboard,
  Monitor,
  MoreVertical,
  Mouse,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";

type ProductRecord = {
  id: number;
  name: string;
  sku: string;
  brand: string;
  category: string;
  color: string;
  warranty: string;
  type: "mouse" | "keyboard" | "monitor";
};

const products: ProductRecord[] = [
  {
    id: 1,
    name: "Logitech B175 Mouse",
    sku: "LOG-B175-WH",
    brand: "Logitech",
    category: "Mouse",
    color: "White",
    warranty: "365 Days",
    type: "mouse",
  },
  {
    id: 2,
    name: "Logitech B175 Mouse",
    sku: "LOG-B175-BK",
    brand: "Logitech",
    category: "Mouse",
    color: "Black",
    warranty: "365 Days",
    type: "mouse",
  },
  {
    id: 3,
    name: "Logitech K120 Keyboard",
    sku: "LOG-K120-BK",
    brand: "Logitech",
    category: "Keyboard",
    color: "Black",
    warranty: "365 Days",
    type: "keyboard",
  },
  {
    id: 4,
    name: "Dell P2422H Monitor",
    sku: "DEL-P2422H",
    brand: "Dell",
    category: "Monitor",
    color: "Black",
    warranty: "3 Years",
    type: "monitor",
  },
];

const filterOptions = {
  Brand: ["All brands", "Logitech", "Dell"],
  Category: ["All categories", "Mouse", "Keyboard", "Monitor"],
  Color: ["All colors", "White", "Black"],
  Status: ["Active", "Inactive"],
};

export default function Product() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const visibleProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesQuery = `${product.name} ${product.sku}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesBrand =
          !filters.Brand ||
          filters.Brand === "All brands" ||
          product.brand === filters.Brand;
        const matchesCategory =
          !filters.Category ||
          filters.Category === "All categories" ||
          product.category === filters.Category;
        const matchesColor =
          !filters.Color ||
          filters.Color === "All colors" ||
          product.color === filters.Color;
        return matchesQuery && matchesBrand && matchesCategory && matchesColor;
      }),
    [filters, query],
  );

  return (
    <section className="min-h-[calc(100vh-108px)] bg-[#f8fafc] px-5 py-5 text-[#172235] sm:px-7 lg:px-9">
      <div className="mx-auto max-w-360">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[25px] font-bold leading-8 tracking-[-0.02em] text-[#111827]">
              Products
            </h1>
            <p className="mt-0.5 text-[13px] text-[#536174]">
              Manage product information, SKU, brand, category and warranty
              details.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/admin/products/add")}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#2949a8] px-4 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#203d94] focus:outline-none focus:ring-2 focus:ring-[#2949a8]/30"
          >
            <Plus size={16} strokeWidth={2.5} /> Add Product
          </button>
        </div>
        <div className="overflow-hidden rounded-[7px] border border-[#d8dee8] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <div className="flex flex-col gap-3 border-b border-[#edf0f4] p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
            <label className="relative block w-full sm:max-w-75">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#718096]"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by product title or SKU..."
                className="h-9 w-full rounded-lg border border-[#d6dce6] bg-white pl-9 pr-3 text-[12px] text-[#263449] outline-none placeholder:text-[#718096] focus:border-[#6d88ce] focus:ring-2 focus:ring-[#dbe5ff]"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filterOptions).map(([label, options]) => (
                <label key={label} className="relative">
                  <select
                    value={filters[label] || ""}
                    onChange={(event) =>
                      setFilters((current) => ({
                        ...current,
                        [label]: event.target.value,
                      }))
                    }
                    aria-label={label}
                    className="h-9 min-w-20.5 appearance-none rounded-lg border border-[#d6dce6] bg-white py-0 pl-3 pr-8 text-[12px] text-[#263449] outline-none focus:border-[#6d88ce]"
                  >
                    <option value="">{label}</option>
                    {options.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#718096]"
                  />
                </label>
              ))}
              <button
                type="button"
                onClick={() => setShowFilters((current) => !current)}
                className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-[12px] ${showFilters ? "border-[#2949a8] bg-[#f2f5ff] text-[#2949a8]" : "border-[#d6dce6] text-[#536174] hover:bg-[#f8fafc]"}`}
              >
                <SlidersHorizontal size={14} /> More Filters
              </button>
            </div>
          </div>
          {showFilters && (
            <div className="border-b border-[#edf0f4] bg-[#fbfcfe] px-4 py-3 text-[12px] text-[#536174]">
              Advanced filters are available for supplier, stock level, and
              warranty status.
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full min-w-190 border-collapse text-left">
              <thead className="bg-[#f1f3f6] text-[10px] font-bold uppercase tracking-[0.06em] text-[#43516a]">
                <tr>
                  {[
                    "Product",
                    "SKU",
                    "Brand",
                    "Category",
                    "Color",
                    "Warranty",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="h-10 border-b border-[#d9dee7] px-4 font-bold"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-[12px] text-[#334155]">
                {visibleProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="h-18 border-b border-[#edf0f4] last:border-b-0 hover:bg-[#fbfcff]"
                  >
                    <td className="px-4">
                      <div className="flex items-center gap-2.5">
                        <ProductIcon type={product.type} />
                        <span className="max-w-33 font-medium leading-4 text-[#263449]">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 text-[11px] leading-4 text-[#526079]">
                      {product.sku.split("-").map((part, index) => (
                        <span key={`${part}-${index}`} className="block">
                          {part}
                          {index < 2 ? "-" : ""}
                        </span>
                      ))}
                    </td>
                    <td className="px-4">{product.brand}</td>
                    <td className="px-4">{product.category}</td>
                    <td className="px-4">{product.color}</td>
                    <td className="px-4">{product.warranty}</td>
                    <td className="px-4">
                      <span className="inline-flex rounded-sm bg-[#dbe8ff] px-2 py-1 text-[10px] font-medium text-[#416398]">
                        Active
                      </span>
                    </td>
                    <td className="relative px-4">
                      <button
                        type="button"
                        aria-label={`Actions for ${product.name}`}
                        onClick={() =>
                          setOpenMenu(
                            openMenu === product.id ? null : product.id,
                          )
                        }
                        className="rounded p-1 text-[#526079] hover:bg-[#edf2fb]"
                      >
                        <MoreVertical size={17} />
                      </button>
                      {openMenu === product.id && (
                        <div className="absolute right-3 top-12 z-10 w-24 rounded border border-[#d6dce6] bg-white py-1 text-xs shadow-lg">
                          <button
                            type="button"
                            className="block w-full px-3 py-2 text-left hover:bg-[#f1f5f9]"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="block w-full px-3 py-2 text-left hover:bg-[#f1f5f9]"
                          >
                            Archive
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {visibleProducts.length === 0 && (
              <div className="px-4 py-10 text-center text-sm text-[#718096]">
                No products match the current filters.
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3 border-t border-[#d9dee7] px-4 py-4 text-[12px] text-[#536174] sm:flex-row sm:items-center sm:justify-between">
            <label className="flex items-center gap-2">
              Rows per page:{" "}
              <select className="bg-transparent font-medium text-[#263449] outline-none">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </label>
            <div className="flex items-center gap-4">
              <span>1-4 of 1,248</span>
              <button
                type="button"
                aria-label="Previous page"
                className="text-[#718096] hover:text-[#2949a8]"
              >
                <ChevronLeft size={17} />
              </button>
              <button
                type="button"
                aria-label="Next page"
                className="text-[#718096] hover:text-[#2949a8]"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductIcon({ type }: { type: ProductRecord["type"] }) {
  const Icon =
    type === "keyboard" ? Keyboard : type === "monitor" ? Monitor : Mouse;
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${type === "mouse" ? "bg-[#f3f4f6]" : type === "keyboard" ? "bg-[#e7e9eb]" : "bg-[#f5f7f8]"} border-[#d6dce6]`}
    >
      <Icon size={20} strokeWidth={1.5} className="text-[#344054]" />
    </span>
  );
}
