"use client";

import AddProductClient from "@/components/ProductClient/AddProductClient";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  PackageSearch,
  Plus,
  RefreshCw,
  ServerOff,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import FadeUp from "../FadeUp";

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
  image?: unknown;
  imageUrl?: unknown;
  thumbnail?: unknown;
  images?: unknown;
  [key: string]: unknown;
};

type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const getDisplayName = (p: ProductRow, index: number) =>
  p.productTitle || p.title || p.productName || p.name || `Product ${index + 1}`;

const getDisplaySku = (p: ProductRow) => p.sku || p.productId || "-";

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

const getDisplayImage = (p: ProductRow) => {
  const image =
    p.image ??
    p.imageUrl ??
    p.thumbnail ??
    (Array.isArray(p.images) ? p.images[0] : p.images);

  if (typeof image === "string") return image;

  if (typeof image === "object" && image !== null) {
    const imageRecord = image as { url?: unknown; src?: unknown };
    if (typeof imageRecord.url === "string") return imageRecord.url;
    if (typeof imageRecord.src === "string") return imageRecord.src;
  }

  return "";
};

export default function ProductClient() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
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

        const queryParam = submittedQuery.trim()
          ? `&search=${encodeURIComponent(submittedQuery.trim())}`
          : "";

        const response = await fetch(
          `/api/products?page=${currentPage}&limit=10${queryParam}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          },
        );

        if (!response.ok) {
          const errorJson = await response.json().catch(() => null);

          throw new Error(
            errorJson?.error ||
              `Could not load products (status ${response.status}).`,
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

        setProducts(list);
        setPagination(meta);
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Could not load products from the API.",
        );
      } finally {
        setLoading(false);
        setIsRetrying(false);
      }
    };

    fetchProducts();
  }, [currentPage, refreshKey, submittedQuery]);

  // Handle Lenis when Add Product modal opens
  useEffect(() => {
    const lenis =
      typeof window !== "undefined" ? window.__techBasketLenis : undefined;

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

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  };

  const openAddProductModal = () => {
    setQuery("");
    setSubmittedQuery("");
    setCurrentPage(1);
    setIsAddModalOpen(true);
  };

  const closeAddProductModal = () => {
    setQuery("");
    setSubmittedQuery("");
    setIsAddModalOpen(false);
  };

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    const totalPages = pagination.totalPages || 1;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const startItem =
    pagination.total === 0 ? 0 : (currentPage - 1) * pagination.limit + 1;

  const endItem = Math.min(currentPage * pagination.limit, pagination.total);

  return (
    <>
      <section className="min-h-[calc(100vh-108px)] px-5 py-5 text-[#172235] sm:px-7 lg:px-9">
        <FadeUp className="mx-auto max-w-360">
          {/* Header */}
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-[25px] font-bold text-[#111827]">
                  Products
                </h1>

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
              onClick={openAddProductModal}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#2949a8] px-4 text-[13px] font-semibold text-white transition hover:bg-[#203a86]"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </button>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-[7px] border border-[#d8dee8] bg-white shadow-xs">
            {/* Search */}
            <div className="border-b border-[#edf0f4] p-4">
              <input
                value={query}
                onChange={handleSearchChange}
                placeholder="Search by product title or SKU..."
                className="h-9 w-full max-w-75 rounded-lg border border-[#d6dce6] px-3 text-[12px] focus:border-[#2949a8] focus:outline-hidden"
              />
            </div>

            {/* Loading */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-3 h-8 w-8 animate-spin rounded-full border-3 border-[#2949a8] border-t-transparent" />

                <p className="text-sm font-medium text-[#334155]">
                  Loading products...
                </p>

                <p className="mt-0.5 text-xs text-[#64748b]">
                  Connecting to the product catalog service
                </p>
              </div>
            ) : error ? (
              <div className="px-5 py-12 sm:px-10 sm:py-16">
                <div className="mx-auto flex max-w-2xl flex-col items-center rounded-2xl border border-[#e2e7f0] bg-[#f8faff] px-5 py-8 text-center shadow-[0_12px_35px_rgba(41,73,168,0.06)] sm:px-10">
                  <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e8edff] text-[#2949a8]">
                    <span className="absolute inset-0 animate-ping rounded-2xl bg-[#dbe4ff] opacity-40" />
                    <ServerOff className="relative h-7 w-7" strokeWidth={1.8} />
                  </div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#f4c7cf] bg-white px-3 py-1 text-[11px] font-semibold text-[#b4233c] shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#d33b46]" />
                    Connection unavailable
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-[#172235]">
                    Product catalog is taking a break
                  </h3>
                  <p className="mt-2 max-w-md text-[13px] leading-6 text-[#61708a]">
                    We could not connect to the catalog service right now. Start
                    the backend service, then try again to load your products.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[11px] text-[#61708a]">
                    <span className="rounded-md border border-[#dfe5f1] bg-white px-2.5 py-1.5 shadow-sm">Endpoint</span>
                    <code className="rounded-md bg-[#edf1fa] px-2.5 py-1.5 font-mono text-[#2949a8]">localhost:5000</code>
                  </div>
                  <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleRetry}
                      disabled={isRetrying}
                      className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#2949a8] px-5 text-xs font-semibold text-white shadow-[0_5px_12px_rgba(41,73,168,0.2)] transition hover:bg-[#203a86] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${isRetrying ? "animate-spin" : ""}`} />
                      {isRetrying ? "Checking connection..." : "Try again"}
                    </button>
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-[#7a879b]">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Run <code className="font-semibold text-[#536174]">npm run dev</code> in the backend
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Product Table */}
                <table className="w-full min-w-190 text-left text-[12px]">
                  <thead className="bg-[#f1f3f6] text-[10px] uppercase text-[#43516a]">
                    <tr>
                      {[
                        "Image",
                        "Product",
                        "SKU",
                        "Brand",
                        "Category",
                        "Color",
                      ].map((heading) => (
                        <th key={heading} className="h-10 px-4">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((product, index) => {
                      const productName = getDisplayName(product, index);

                      const sku = getDisplaySku(product);
                      const brand = getDisplayBrand(product);
                      const category = getDisplayCategory(product);
                      const color = getDisplayColor(product);
                      const image = getDisplayImage(product);

                      return (
                        <tr
                          key={
                            product._id ||
                            product.id ||
                            `${productName}-${sku}-${index}`
                          }
                          className="h-14 border-t border-[#edf0f4] transition hover:bg-[#fbfcfd]"
                        >
                          <td className="w-20 px-4">
                            {image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={image}
                                alt={productName}
                                className="h-10 w-10 rounded-md border border-[#e2e8f0] object-cover"
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-dashed border-[#cbd5e1] bg-[#f8fafc] text-[#94a3b8]">
                                <PackageSearch className="h-4 w-4" />
                              </div>
                            )}
                          </td>
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

                {/* Empty State */}
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
                        onClick={openAddProductModal}
                        className="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#2949a8] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#203a86]"
                      >
                        Add Product
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setQuery("");
                          setSubmittedQuery("");
                          setCurrentPage(1);
                        }}
                        className="mt-3 cursor-pointer text-xs font-medium text-[#2949a8] hover:underline"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                )}

                {/* Pagination */}
                {pagination.total > 0 && (
                  <div className="flex flex-col items-center justify-between gap-4 border-t border-[#edf0f4] bg-white px-4 py-3.5 sm:flex-row">
                    <p className="text-[12px] text-[#536174]">
                      Showing{" "}
                      <span className="font-semibold text-[#111827]">
                        {startItem}
                      </span>{" "}
                      to{" "}
                      <span className="font-semibold text-[#111827]">
                        {endItem}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-[#111827]">
                        {pagination.total}
                      </span>{" "}
                      products
                    </p>

                    <div className="flex items-center space-x-1">
                      {/* Previous */}
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1 || loading}
                        className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg border border-[#d6dce6] bg-white px-2.5 text-[12px] font-medium text-[#43516a] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                        Previous
                      </button>

                      {/* Page Numbers */}
                      {renderPageNumbers().map((item, idx) =>
                        typeof item === "number" ? (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setCurrentPage(item)}
                            disabled={loading}
                            className={`h-8 min-w-8 cursor-pointer rounded-lg px-2 text-[12px] font-semibold transition ${
                              currentPage === item
                                ? "bg-[#2949a8] text-white shadow-xs"
                                : "border border-[#d6dce6] bg-white text-[#43516a] hover:bg-[#f8fafc]"
                            }`}
                          >
                            {item}
                          </button>
                        ) : (
                          <span
                            key={idx}
                            className="select-none px-1.5 text-[12px] text-[#94a3b8]"
                          >
                            ...
                          </span>
                        ),
                      )}

                      {/* Next */}
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentPage((p) =>
                            Math.min(pagination.totalPages, p + 1),
                          )
                        }
                        disabled={
                          currentPage >= pagination.totalPages || loading
                        }
                        className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg border border-[#d6dce6] bg-white px-2.5 text-[12px] font-medium text-[#43516a] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-40"
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
        </FadeUp>
      </section>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <FadeUp className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div
            className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto overscroll-contain rounded-2xl bg-white shadow-2xl"
            onWheel={(event) => event.stopPropagation()}
            onTouchMove={(event) => event.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={closeAddProductModal}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100"
              aria-label="Close add product form"
            >
              <X className="h-4 w-4" />
            </button>

            <AddProductClient
              onClose={closeAddProductModal}
              onProductAdded={() => {
                setQuery("");
                setSubmittedQuery("");
                setCurrentPage(1);
                setRefreshKey((current) => current + 1);
              }}
            />
          </div>
        </FadeUp>
      )}
    </>
  );
}
