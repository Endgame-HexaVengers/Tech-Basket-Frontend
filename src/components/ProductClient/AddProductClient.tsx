"use client";

import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTabs } from "@/context/TabContext";

type AddProductClientProps = {
  onClose?: () => void;
  onProductAdded?: () => void;
};

export default function AddProductClient({ onClose, onProductAdded }: AddProductClientProps) {
  const { setActiveTab } = useTabs();
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [productColor, setProductColor] = useState("Black");
  const [warrantyPeriod, setWarrantyPeriod] = useState("1");
  const [warrantyUnit, setWarrantyUnit] = useState("Years");
  const [catalogCategories, setCatalogCategories] = useState<string[]>([]);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newBrand, setNewBrand] = useState({
    name: "",
    website: "",
    description: "",
  });
  const [newCategory, setNewCategory] = useState({
    name: "",
    parentCategory: "",
    description: "",
  });

  useEffect(() => {
    const lenis = window.__techBasketLenis;
    if (lenis) {
      lenis.stop();
    }

    return () => {
      if (lenis) {
        lenis.start();
      }
    };
  }, []);

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const response = await fetch("/api/catalog");
        if (!response.ok) return;

        const data = (await response.json()) as {
          categories?: string[];
        };

        setCatalogCategories(data.categories ?? []);
      } catch {
        setCatalogCategories([]);
      }
    };

    loadCatalog();
  }, []);

  const closeForm = () => {
    if (onClose) {
      onClose();
      return;
    }

    setActiveTab("/admin/products");
  };

  const saveBrand = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = newBrand.name.trim();
    if (!trimmedName) return;

    try {
      const response = await fetch("/api/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "brand",
          name: trimmedName,
          website: newBrand.website.trim(),
          description: newBrand.description.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData?.error || "Could not save brand to the database.",
        );
      }

      setBrandName(trimmedName);
      setIsBrandModalOpen(false);
      setNewBrand({ name: "", website: "", description: "" });
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not save brand.",
      );
    }
  };

  const saveCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = newCategory.name.trim();
    if (!trimmedName) return;

    try {
      const response = await fetch("/api/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "category",
          name: trimmedName,
          parentCategory: newCategory.parentCategory.trim(),
          description: newCategory.description.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData?.error || "Could not save category to the database.",
        );
      }

      setCategoryName(trimmedName);
      setCatalogCategories((current) =>
        current.includes(trimmedName)
          ? current
          : [...current, trimmedName].sort((a, b) => a.localeCompare(b)),
      );
      setIsCategoryModalOpen(false);
      setNewCategory({ name: "", parentCategory: "", description: "" });
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not save category.",
      );
    }
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSaving(true);

    const formData = new FormData(form);
    const payload = {
      title: String(formData.get("title") || "").trim(),
      sku: String(formData.get("sku") || "").trim(),
      brand: String(formData.get("brand") || "").trim(),
      category: String(formData.get("category") || "").trim(),
      description: String(formData.get("description") || "").trim(),
      color: String(formData.get("color") || productColor || "").trim(),
      warrantyPeriod: Number(formData.get("warrantyPeriod") || warrantyPeriod || 0),
      warrantyUnit: String(formData.get("warrantyUnit") || warrantyUnit || "Years").trim(),
      status: "active",
    };

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error || "Could not save product.");
      }

      setMessage("Product created successfully in the database.");
      toast.success("Product created successfully!");
      onProductAdded?.();
      if (form instanceof HTMLFormElement) {
        form.reset();
      }
      setBrandName("");
      setCategoryName("");
      setProductColor("Black");
      setWarrantyPeriod("1");
      setWarrantyUnit("Years");

      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 500);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Could not save product.";
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <section
        className="max-h-[90vh] overflow-y-auto overscroll-contain bg-[#f8fafc] px-5 py-7 text-[#172235] sm:px-8 lg:px-12"
        style={{ overscrollBehavior: "contain" }}
      >
        <div className="mx-auto w-full max-w-375">
          <div className="mb-8 border-b border-[#e1e6ee] pb-5">
            <h1 className="text-[30px] font-bold tracking-tight text-[#111827]">
              Add Product
            </h1>
            <p className="mt-1 text-[13px] text-[#536174]">
              Create a new product in the TechBasket product catalog.
            </p>
          </div>
          <form
            onSubmit={submit}
            className="grid grid-cols-1 gap-5 lg:grid-cols-2"
          >
            <label className="rounded-lg border border-[#d6dce6] bg-white p-5 text-[11px] font-medium lg:col-span-2">
              Product title
              <input
                name="title"
                required
                className="mt-2 h-11 w-full rounded-md border border-[#d6dce6] px-3 text-[13px]"
                placeholder="e.g. Logitech B175 Mouse"
              />
            </label>
            <label className="rounded-lg border border-[#d6dce6] bg-white p-5 text-[11px] font-medium">
              SKU
              <input
                name="sku"
                required
                className="mt-2 h-11 w-full rounded-md border border-[#d6dce6] px-3 text-[13px]"
                placeholder="LOG-B175-WH"
              />
            </label>
            <div className="rounded-lg border border-[#d6dce6] bg-white p-5 text-[11px] font-medium">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span>Brand</span>
                <button
                  type="button"
                  onClick={() => setIsBrandModalOpen(true)}
                  className="rounded-md border border-[#d6dce6] px-2 py-1 text-[10px] font-semibold text-[#2949a8]"
                >
                  + New Brand
                </button>
              </div>
              <input
                name="brand"
                value={brandName}
                onChange={(event) => setBrandName(event.target.value)}
                required
                className="h-11 w-full rounded-md border border-[#d6dce6] px-3 text-[13px]"
              />
            </div>
            <div className="rounded-lg border border-[#d6dce6] bg-white p-5 text-[11px] font-medium">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span>Category</span>
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="rounded-md border border-[#d6dce6] px-2 py-1 text-[10px] font-semibold text-[#2949a8]"
                >
                  + New Category
                </button>
              </div>
              <input
                name="category"
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                required
                className="h-11 w-full rounded-md border border-[#d6dce6] px-3 text-[13px]"
              />
            </div>
            <label className="rounded-lg border border-[#d6dce6] bg-white p-5 text-[11px] font-medium">
              Color
              <input
                name="color"
                value={productColor}
                onChange={(event) => setProductColor(event.target.value)}
                className="mt-2 h-11 w-full rounded-md border border-[#d6dce6] px-3 text-[13px]"
                placeholder="Black"
              />
            </label>
            <div className="rounded-lg border border-[#d6dce6] bg-white p-5 text-[11px] font-medium">
              <div className="mb-2 flex items-center gap-2">
                <span>Warranty</span>
              </div>
              <div className="flex gap-2">
                <input
                  name="warrantyPeriod"
                  type="number"
                  min="0"
                  value={warrantyPeriod}
                  onChange={(event) => setWarrantyPeriod(event.target.value)}
                  className="h-11 w-24 rounded-md border border-[#d6dce6] px-3 text-[13px]"
                />
                <select
                  name="warrantyUnit"
                  value={warrantyUnit}
                  onChange={(event) => setWarrantyUnit(event.target.value)}
                  className="h-11 flex-1 rounded-md border border-[#d6dce6] px-3 text-[13px]"
                >
                  <option value="Years">Years</option>
                  <option value="Months">Months</option>
                  <option value="Days">Days</option>
                </select>
              </div>
            </div>
            <label className="rounded-lg border border-[#d6dce6] bg-white p-5 text-[11px] font-medium lg:col-span-2">
              Description
              <textarea
                name="description"
                className="mt-2 h-28 w-full rounded-md border border-[#d6dce6] p-3 text-[13px]"
                placeholder="Brief description about the product..."
              />
            </label>
            <div className="flex flex-wrap justify-end gap-3 border-t border-[#dfe4ec] pt-6 lg:col-span-2">
              <button
                type="button"
                onClick={closeForm}
                className="h-10 px-4 text-[12px] text-[#536174]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="h-10 rounded-md bg-[#2949a8] px-5 text-[12px] font-semibold text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : "Create Product"}
              </button>
            </div>
          </form>
          {message && (
            <p role="status" className="mt-4 text-[13px] text-[#2949a8]">
              {message}
            </p>
          )}
        </div>
      </section>

      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-140 rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-5">
              <h2 className="text-[17px] font-semibold text-[#111827]">
                Add New Category
              </h2>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                aria-label="Close category modal"
                className="text-[30px] leading-none text-[#6b7280]"
              >
                ×
              </button>
            </div>

            <form onSubmit={saveCategory} className="space-y-5 p-6">
              <p className="text-[13px] text-[#536174]">
                Define a new product category for catalog organization.
              </p>

              <div>
                <label className="mb-2 block text-[13px] font-medium text-[#111827]">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={newCategory.name}
                  onChange={(event) =>
                    setNewCategory((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  required
                  className="h-11 w-full rounded-md border border-[#d6dce6] bg-white px-3 text-[13px] text-[#111827] outline-none placeholder:text-[#8b95a7]"
                  placeholder="e.g., Wireless Mouse"
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-medium text-[#111827]">
                  Parent Category
                </label>
                <select
                  value={newCategory.parentCategory}
                  onChange={(event) =>
                    setNewCategory((current) => ({
                      ...current,
                      parentCategory: event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-md border border-[#d6dce6] bg-white px-3 text-[13px] text-[#111827] outline-none"
                >
                  <option value="">None (Top Level)</option>
                  {catalogCategories
                    .filter((category) => category !== newCategory.name.trim())
                    .map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-medium text-[#111827]">
                  Description <span className="text-[#536174]">(Optional)</span>
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(event) =>
                    setNewCategory((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  className="h-28 w-full rounded-md border border-[#d6dce6] bg-white p-3 text-[13px] text-[#111827] outline-none placeholder:text-[#8b95a7]"
                  placeholder="Briefly describe the category..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="h-10 rounded-md border border-[#d6dce6] bg-white px-4 text-[12px] font-medium text-[#374151]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 rounded-md bg-[#2949a8] px-5 text-[12px] font-semibold text-white shadow-sm"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isBrandModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-140 rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-5">
              <h2 className="text-[17px] font-semibold text-[#111827]">
                Add New Brand
              </h2>
              <button
                type="button"
                onClick={() => setIsBrandModalOpen(false)}
                aria-label="Close brand modal"
                className="text-[30px] leading-none text-[#6b7280]"
              >
                ×
              </button>
            </div>

            <form onSubmit={saveBrand} className="space-y-5 p-6">
              <p className="text-[13px] text-[#536174]">
                Create a new brand entry in the master catalog.
              </p>

              <div>
                <label className="mb-2 block text-[13px] font-medium text-[#111827]">
                  Brand Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={newBrand.name}
                  onChange={(event) =>
                    setNewBrand((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  required
                  className="h-11 w-full rounded-md border border-[#d6dce6] bg-white px-3 text-[13px] text-[#111827] outline-none placeholder:text-[#8b95a7]"
                  placeholder="e.g., Logitech"
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-medium text-[#111827]">
                  Brand Website <span className="text-[#536174]">(Optional)</span>
                </label>
                <input
                  type="url"
                  value={newBrand.website}
                  onChange={(event) =>
                    setNewBrand((current) => ({
                      ...current,
                      website: event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-md border border-[#d6dce6] bg-white px-3 text-[13px] text-[#111827] outline-none placeholder:text-[#8b95a7]"
                  placeholder="https://www.example.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-medium text-[#111827]">
                  Description <span className="text-[#536174]">(Optional)</span>
                </label>
                <textarea
                  value={newBrand.description}
                  onChange={(event) =>
                    setNewBrand((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  className="h-28 w-full rounded-md border border-[#d6dce6] bg-white p-3 text-[13px] text-[#111827] outline-none placeholder:text-[#8b95a7]"
                  placeholder="Brief details about the brand..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBrandModalOpen(false)}
                  className="h-10 rounded-md border border-[#d6dce6] bg-white px-4 text-[12px] font-medium text-[#374151]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 rounded-md bg-[#2949a8] px-5 text-[12px] font-semibold text-white shadow-sm"
                >
                  Save Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
