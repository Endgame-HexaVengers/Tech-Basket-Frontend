"use client";

import AddProductClient from "@/components/ProductClient/AddProductClient";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  PackageSearch,
  RefreshCw,
  ServerOff,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface CustomWindow extends Window {
  __techBasketLenis?: {
    start: () => void;
    stop: () => void;
  };
}

type ProductRow = {
  _id?: string;
  id?: string;
  productTitle?: string;
  title?: string;
  productName?: string;
  name?: string;
  sku?: string;
  productId?: string;
  brand?: string | { name?: string; _id?: string };
  brandId?: string;
  category?: string | { name?: string; _id?: string };
  categoryId?: string;
  color?: string;
  [key: string]: unknown;
};

type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const getDisplayName = (p: ProductRow, index: number) => {
  return p.productTitle || p.title || p.productName || p.name || `Product ${index + 1}`;
};

const getDisplaySku = (p: ProductRow) => {
  return p.sku || p.productId || "-";
};

const getDisplayBrand = (p: ProductRow) => {
  if (typeof p.brand === "object" && p.brand !== null) {
    return p.brand.name || "-";
  }
  if (p.brand) return p.brand;
  if (p.brandId) {
    return p.brandId.startsWith("BRAND_")
      ? p.brandId.replace(/^BRAND_/, "").replace(/_/g, " ")
      : p.brandId;
  }
  return "-";
};

const getDisplayCategory = (p: ProductRow) => {
  if (typeof p.category === "object" && p.category !== null) {
    return p.category.name || "-";
  }
  if (p.category) return p.category;
  if (p.categoryId) {
    return p.categoryId.startsWith("CAT_")
      ? p.categoryId.replace(/^CAT_/, "").replace(/_/g, " ")
      : p.categoryId;
  }
  return "-";
};

const getDisplayColor = (p: ProductRow) => {
  return p.color || "-";
};

export default function ProductClient() {
  const [query, setQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        let list: ProductRow[] = [];
        let meta: PaginationMeta = {
          page: currentPage,
          limit: 10,
          total: 0,
          totalPages: 1,
        };

        const queryParam = query.trim() ? `&search=${encodeURIComponent(query.trim())}` : "";

        // 1. Try direct fetch from backend server
        try {
          const backendRes = await fetch(
            `http://localhost:5000/api/v1/products?page=${currentPage}&limit=10${queryParam}`,
            {
              headers: { Accept: "application/json" },
            }
          );
          if (backendRes.ok) {
            const json = await backendRes.json();
            list = Array.isArray(json?.data)
              ? json.data
              : Array.isArray(json)
                ? json
                : [];
            if (json?.pagination) {
              meta = json.pagination;
            } else {
              meta.total = list.length;
              meta.totalPages = Math.ceil(list.length / 10) || 1;
            }
          }
        } catch {
          // If direct fetch fails (e.g. CORS), fallback to internal /api/products
        }

        // 2. Fallback to /api/products route
        if (list.length === 0) {
          const response = await fetch(
            `/api/products?page=${currentPage}&limit=10${queryParam}`,
            {
              method: "GET",
              headers: { Accept: "application/json" },
            }
          );

          if (!response.ok) {
            const errorJson = await response.json().catch(() => null);
            throw new Error(
              errorJson?.error ||
                `Backend server (http://localhost:5000) is offline (status ${response.status}).`
            );
          }

          const payload = await response.json();
          list = Array.isArray(payload?.data)
            ? payload.data
            : Array.isArray(payload)
              ? payload
              : Array.isArray(payload?.products)
                ? payload.products
                : [];

          if (payload?.pagination) {
            meta = payload.pagination;
          } else {
            meta.total = list.length;
            meta.totalPages = Math.ceil(list.length / 10) || 1;
          }
        }

        setProducts(list);
        setPagination(meta);
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Could not load products from the API."
        );
      } finally {
        setLoading(false);
        setIsRetrying(false);
      }
    };

    fetchProducts();
  }, [currentPage, query, refreshKey]);

  useEffect(() => {
    const lenis = (typeof window !== "undefined" ? (window as unknown as CustomWindow).__techBasketLenis : undefined);

    if (!isAddModalOpen) {
      document.body.style.overflow = "";
      if (lenis) {
        lenis.start();
      }
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (lenis) {
      lenis.stop();
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      if (lenis) {
        lenis.start();
      }
    };
  }, [isAddModalOpen]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  };

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    const totalPages = pagination.totalPages || 1;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push("...");

      pages.push(totalPages);
    }
    return pages;
  };

  const startItem = pagination.total === 0 ? 0 : (currentPage - 1) * pagination.limit + 1;
  const endItem = Math.min(currentPage * pagination.limit, pagination.total);

  return (
    <>
      <section className="min-h-[calc(100vh-108px)] bg-[#f8fafc] px-5 py-5 text-[#172235] sm:px-7 lg:px-9">
        <div className="mx-auto max-w-360">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-[25px] font-bold text-[#111827]">Products</h1>
                <span className="rounded-full bg-[#e7ecff] px-2.5 py-1 text-[12px] font-semibold text-[#2949a8]">
                  {pagination.total}
                </span>
              </div>
              <p className="text-[13px] text-[#536174]">
                Manage product information, SKU, brand, category and warranty
                details.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="h-10 cursor-pointer rounded-lg bg-[#2949a8] px-4 text-[13px] font-semibold text-white hover:bg-[#203a86] transition"
            >
              Add Product
            </button>
          </div>

          <div className="overflow-x-auto rounded-[7px] border border-[#d8dee8] bg-white shadow-xs">
            <div className="border-b border-[#edf0f4] p-4">
              <input
                value={query}
                onChange={handleSearchChange}
                placeholder="Search by product title or SKU..."
                className="h-9 w-full max-w-75 rounded-lg border border-[#d6dce6] px-3 text-[12px] focus:border-[#2949a8] focus:outline-hidden"
              />
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-3 h-8 w-8 animate-spin rounded-full border-3 border-[#2949a8] border-t-transparent" />
                <p className="text-sm font-medium text-[#334155]">Loading products...</p>
                <p className="mt-0.5 text-xs text-[#64748b]">Connecting to the product catalog service</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-600 shadow-sm">
                  <ServerOff className="h-7 w-7" />
                </div>

                <div className="mb-2.5 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100/80 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                    Server Offline
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                    localhost:5000
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#111827]">
                  Backend Server is Unreachable
                </h3>

                <p className="mt-1.5 max-w-lg text-xs sm:text-sm leading-relaxed text-[#536174]">
                  We cannot retrieve product data because the backend API server is offline at{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-rose-600">
                    http://localhost:5000
                  </code>
                  . Please start your backend server to load and manage products.
                </p>

                <div className="mt-4 flex max-w-lg items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/80 px-3.5 py-2 text-left text-xs text-amber-900">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                  <span>
                    <strong>How to fix:</strong> Run <code className="rounded bg-amber-100/90 px-1 py-0.5 font-mono font-semibold text-amber-950">npm run dev</code> in your backend directory (<code className="rounded bg-amber-100/90 px-1 py-0.5 font-mono text-amber-950">Tech-Basket-Backend</code>).
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleRetry}
                    disabled={isRetrying}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#2949a8] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#203a86] active:scale-[0.98] disabled:opacity-60"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isRetrying ? "animate-spin" : ""}`} />
                    {isRetrying ? "Checking Connection..." : "Retry Connection"}
                  </button>
                </div>
              </div>
            ) : (
              <>
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
                    {products.map((product, index) => {
                      const productName = getDisplayName(product, index);
                      const sku = getDisplaySku(product);
                      const brand = getDisplayBrand(product);
                      const category = getDisplayCategory(product);
                      const color = getDisplayColor(product);

                      return (
                        <tr
                          key={product._id || product.id || `${productName}-${sku}-${index}`}
                          className="h-14 border-t border-[#edf0f4] hover:bg-[#fbfcfd] transition"
                        >
                          <td className="px-4 font-medium">{productName}</td>
                          <td className="px-4 text-[#536174]">{sku}</td>
                          <td className="px-4 text-[#536174]">{brand}</td>
                          <td className="px-4 text-[#536174]">{category}</td>
                          <td className="px-4 text-[#94a3b8]">{color}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {products.length === 0 && (
                  <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <PackageSearch className="h-6 w-6" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-800">
                      {pagination.total === 0
                        ? "No Products in Catalog"
                        : "No Matching Products Found"}
                    </h4>
                    <p className="mt-1 max-w-sm text-xs text-slate-500">
                      {pagination.total === 0
                        ? "There are currently no products registered. Click 'Add Product' to create your first item."
                        : `No products found matching "${query}". Try searching with a different keyword or SKU.`}
                    </p>
                    {pagination.total === 0 ? (
                      <button
                        type="button"
                        onClick={() => setIsAddModalOpen(true)}
                        className="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#2949a8] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#203a86]"
                      >
                        Add Product
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setQuery("");
                          setCurrentPage(1);
                        }}
                        className="mt-3 cursor-pointer text-xs font-medium text-[#2949a8] hover:underline"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                )}

                {/* Pagination Controls */}
                {pagination.total > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#edf0f4] px-4 py-3.5 bg-white">
                    <p className="text-[12px] text-[#536174]">
                      Showing <span className="font-semibold text-[#111827]">{startItem}</span> to{" "}
                      <span className="font-semibold text-[#111827]">{endItem}</span> of{" "}
                      <span className="font-semibold text-[#111827]">{pagination.total}</span> products
                    </p>

                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1 || loading}
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#d6dce6] bg-white px-2.5 text-[12px] font-medium text-[#43516a] transition hover:bg-[#f8fafc] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                        Previous
                      </button>

                      {renderPageNumbers().map((item, idx) =>
                        typeof item === "number" ? (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setCurrentPage(item)}
                            disabled={loading}
                            className={`h-8 min-w-8 rounded-lg px-2 text-[12px] font-semibold transition cursor-pointer ${
                              currentPage === item
                                ? "bg-[#2949a8] text-white shadow-xs"
                                : "border border-[#d6dce6] bg-white text-[#43516a] hover:bg-[#f8fafc]"
                            }`}
                          >
                            {item}
                          </button>
                        ) : (
                          <span key={idx} className="px-1.5 text-[12px] text-[#94a3b8] select-none">
                            ...
                          </span>
                        )
                      )}

                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                        disabled={currentPage >= pagination.totalPages || loading}
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#d6dce6] bg-white px-2.5 text-[12px] font-medium text-[#43516a] transition hover:bg-[#f8fafc] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        Next
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div
            className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto overscroll-contain rounded-2xl bg-white shadow-2xl"
            onWheel={(event) => event.stopPropagation()}
            onTouchMove={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 cursor-pointer transition"
              aria-label="Close add product form"
            >
              <X className="h-4 w-4" />
            </button>
            <AddProductClient
              onClose={() => setIsAddModalOpen(false)}
              onProductAdded={() => setRefreshKey((current) => current + 1)}
            />
          </div>
        </div>
      )}
    </>
  );
}
