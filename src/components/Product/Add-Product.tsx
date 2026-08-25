"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ImagePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import AddNewBrand from "./AddNewBrand";
import AddNewCategory from "./AddNewCategory";

const inputClass =
  "mt-2 h-11 w-full rounded-md border border-[#d6dce6] bg-white px-3 text-[13px] text-[#263449] shadow-[0_1px_2px_rgba(15,23,42,0.03)] outline-none transition focus:border-[#2949a8] focus:ring-4 focus:ring-[#dbe5ff]";
const selectClass = `${inputClass} appearance-none pr-7`;

export default function AddProduct() {
  const router = useRouter();
  const [saved, setSaved] = useState("");
  const [brands, setBrands] = useState(["Logitech", "Dell"]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [brandMenuOpen, setBrandMenuOpen] = useState(false);
  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [categories, setCategories] = useState(["Mouse", "Keyboard", "Monitor"]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [sku, setSku] = useState("");
  const [color, setColor] = useState("");
  const [warrantyPeriod, setWarrantyPeriod] = useState("1");
  const [warrantyUnit, setWarrantyUnit] = useState("Years");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [savingProduct, setSavingProduct] = useState(false);

  useEffect(() => {
    fetch("/api/catalog")
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load catalog data.");
        return response.json() as Promise<{ brands: string[]; categories: string[] }>;
      })
      .then((data) => {
        setBrands(data.brands);
        setCategories(data.categories);
      })
      .catch(() => {
        setSaved("Catalog data could not be loaded. Using the default options.");
      });
  }, []);

  const submit = (message: string) => {
    setSaved(message);
    window.setTimeout(() => setSaved(""), 3000);
  };

  return (
    <section className="min-h-[calc(100vh-108px)] bg-[#f8fafc] px-5 py-7 text-[#172235] sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-375">
        <div className="mb-5 flex items-center gap-1.5 text-[12px] text-[#526079]">
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="hover:text-[#2949a8]"
          >
            Admin
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="hover:text-[#2949a8]"
          >
            Products
          </button>
          <span>/</span>
          <span className="text-[#172235]">Add Product</span>
        </div>
        <div className="mb-8 border-b border-[#e1e6ee] pb-5">
          <h1 className="text-[30px] font-bold tracking-tight text-[#111827]">Add Product</h1>
          <p className="mt-1 text-[13px] text-[#536174]">
            Create a new product in the TechBasket product catalog.
          </p>
        </div>

        <form
          onSubmit={async (event) => {
            event.preventDefault();
            setSavingProduct(true);
            try {
              const response = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, sku, brand: selectedBrand, category: selectedCategory, color, warrantyPeriod, warrantyUnit, description, status }) });
              const result = await response.json() as { error?: string };
              if (!response.ok) throw new Error(result.error || "Could not save product.");
              submit("Product created successfully in the database.");
            } catch (error) {
              submit(error instanceof Error ? error.message : "Could not save product.");
            } finally {
              setSavingProduct(false);
            }
          }}
          className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2"
        >
          <FormSection title="Basic Product Information" className="lg:col-span-2">
            <Field label="Product Title" className="sm:col-span-2">
              <input
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className={inputClass}
                placeholder="e.g. Logitech B175 Mouse"
              />
              <p className="mt-1.5 text-[11px] font-normal text-[#8792a4]">
                Enter the base product/model name. Do not include the color.
              </p>
            </Field>
            <Field label="Color">
              <Select
                ariaLabel="Color"
                options={["Select or search color", "White", "Black"]}
                value={color}
                onChange={setColor}
              />
            </Field>
            <Field label="SKU">
              <input
                required
                value={sku}
                onChange={(event) => setSku(event.target.value)}
                className={inputClass}
                placeholder="LOG-B175-WH"
              />
                <p className="mt-1.5 text-[11px] font-normal text-[#8792a4]">
                SKU must be unique.{" "}
                <span className="font-medium text-[#3671c9]">
                  SKU available
                </span>
              </p>
            </Field>
            <Field label="Brand" className="relative z-30">
              <div className="relative mt-2">
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={brandMenuOpen}
                  onClick={() => setBrandMenuOpen((current) => !current)}
                  className={`${inputClass} mt-0 flex items-center justify-between text-left ${selectedBrand ? "text-[#263449]" : "text-[#718096]"}`}
                >
                  {selectedBrand || "Select brand"}
                  <ChevronDown size={14} />
                </button>
                {brandMenuOpen && (
                  <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 overflow-hidden rounded-md border border-[#cbd5e1] bg-white py-1 shadow-lg" role="listbox">
                    {brands.map((brand) => (
                      <button
                        key={brand}
                        type="button"
                        role="option"
                        aria-selected={selectedBrand === brand}
                        onClick={() => { setSelectedBrand(brand); setBrandMenuOpen(false); }}
                        className="block w-full px-3 py-2 text-left text-[13px] text-[#263449] hover:bg-[#eef4ff]"
                      >
                        {brand}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => { setBrandMenuOpen(false); setBrandModalOpen(true); }}
                      className="w-full border-t border-[#e2e6ed] px-3 py-2 text-left text-[13px] font-medium text-[#2949a8] hover:bg-[#f2f6ff]"
                    >
                      + Add new brand
                    </button>
                  </div>
                )}
              </div>
            </Field>
            <Field label="Category" className="relative z-20">
              <div className="relative mt-2">
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={categoryMenuOpen}
                  onClick={() => setCategoryMenuOpen((current) => !current)}
                  className={`${inputClass} mt-0 flex items-center justify-between text-left ${selectedCategory ? "text-[#263449]" : "text-[#718096]"}`}
                >
                  {selectedCategory || "Select category"}
                  <ChevronDown size={14} />
                </button>
                {categoryMenuOpen && (
                  <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 overflow-hidden rounded-md border border-[#cbd5e1] bg-white py-1 shadow-lg" role="listbox">
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        role="option"
                        aria-selected={selectedCategory === category}
                        onClick={() => { setSelectedCategory(category); setCategoryMenuOpen(false); }}
                        className="block w-full px-3 py-2 text-left text-[13px] text-[#263449] hover:bg-[#eef4ff]"
                      >
                        {category}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => { setCategoryMenuOpen(false); setCategoryModalOpen(true); }}
                      className="w-full border-t border-[#e2e6ed] px-3 py-2 text-left text-[13px] font-medium text-[#2949a8] hover:bg-[#f2f6ff]"
                    >
                      + Add new category
                    </button>
                  </div>
                )}
              </div>
            </Field>
          </FormSection>

          <FormSection title="Warranty Information">
            <div className="grid grid-cols-1 gap-3 sm:col-span-2 sm:grid-cols-2">
              <Field label="Warranty Period">
                <input
                  className={inputClass}
                  value={warrantyPeriod}
                  onChange={(event) => setWarrantyPeriod(event.target.value)}
                  type="number"
                  min="0"
                />
              </Field>
              <Field label="Unit">
                <Select
                  ariaLabel="Warranty unit"
                  options={["Years", "Days", "Months"]}
                  value={warrantyUnit}
                  onChange={setWarrantyUnit}
                />
              </Field>
            </div>
          </FormSection>
          <FormSection title="Product Description">
            <Field label="Short Description" className="sm:col-span-2">
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="mt-2 h-32 w-full resize-none rounded-md border border-[#d6dce6] p-3 text-[13px] font-normal shadow-[0_1px_2px_rgba(15,23,42,0.03)] outline-none placeholder:text-[#9aa5b5] focus:border-[#2949a8] focus:ring-4 focus:ring-[#dbe5ff]"
                placeholder="Brief overview of the product..."
              />
            </Field>
          </FormSection>
          <FormSection title="Product Status" className="lg:col-span-2">
            <div className="flex gap-8 pt-1 text-[13px]">
              <label className="flex items-center gap-1.5">
                <input
                  type="radio"
                  name="status"
                  checked={status === "active"}
                  onChange={() => setStatus("active")}
                  className="accent-[#2949a8]"
                />{" "}
                Active
              </label>
              <label className="flex items-center gap-1.5 text-[#8792a4]">
                <input
                  type="radio"
                  name="status"
                  checked={status === "inactive"}
                  onChange={() => setStatus("inactive")}
                  className="accent-[#2949a8]"
                />{" "}
                Inactive
              </label>
            </div>
          </FormSection>

          {saved && (
            <div
              role="status"
              className="rounded-md border border-[#c8d7f4] bg-[#eef4ff] px-3 py-2 text-[13px] text-[#2949a8]"
            >
              {saved}
            </div>
          )}
          <div className="flex flex-wrap justify-end gap-3 border-t border-[#dfe4ec] pt-6 lg:col-span-2">
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="h-10 px-4 text-[12px] text-[#536174] hover:text-[#172235]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => submit("Draft saved.")}
              className="h-10 rounded-md border border-[#8da5d7] bg-white px-4 text-[12px] font-medium text-[#2949a8]"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              disabled={savingProduct}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-[#2949a8] px-5 text-[12px] font-semibold text-white shadow-sm hover:bg-[#203d94] disabled:cursor-wait disabled:opacity-60"
            >
              <ImagePlus size={12} /> {savingProduct ? "Saving..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
      {brandModalOpen && (
        <AddNewBrand
          brands={brands}
          onClose={() => setBrandModalOpen(false)}
          onSave={async (brand) => {
            const response = await fetch("/api/catalog", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ type: "brand", name: brand }),
            });
            if (!response.ok) throw new Error("Could not save brand.");
            setBrands((current) => [...current, brand]);
            setSelectedBrand(brand);
            setBrandModalOpen(false);
          }}
        />
      )}
      {categoryModalOpen && (
        <AddNewCategory
          categories={categories}
          onClose={() => setCategoryModalOpen(false)}
          onSave={async (category) => {
            const response = await fetch("/api/catalog", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ type: "category", name: category }),
            });
            if (!response.ok) throw new Error("Could not save category.");
            setCategories((current) => [...current, category]);
            setSelectedCategory(category);
            setCategoryModalOpen(false);
          }}
        />
      )}
    </section>
  );
}

function FormSection({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative overflow-visible rounded-lg border border-[#d6dce6] bg-white p-5 shadow-[0_2px_5px_rgba(15,23,42,0.04)] ${className}`}>
      <span className="absolute left-0 top-0 h-1 w-full bg-[#2949a8]" />
      <h2 className="border-b border-[#e2e6ed] pb-3 text-[15px] font-semibold text-[#172235]">
        {title}
      </h2>
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      className={`block text-[11px] font-medium text-[#344054] ${className}`}
    >
      {label}
      {children}
    </label>
  );
}

function Select({
  options,
  ariaLabel,
  value,
  onChange,
}: {
  options: string[];
  ariaLabel: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <span className="relative block">
      <select aria-label={ariaLabel} value={value} onChange={(event) => onChange?.(event.target.value)} className={selectClass}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <ChevronDown
        size={12}
        className="pointer-events-none absolute right-2 top-1/2 mt-0.5 -translate-y-1/2 text-[#718096]"
      />
    </span>
  );
}
