"use client";

import { useState } from "react";
import { ChevronDown, ImagePlus } from "lucide-react";
import { useRouter } from "next/navigation";

const inputClass =
  "mt-2 h-11 w-full rounded-md border border-[#d6dce6] bg-white px-3 text-[13px] text-[#263449] shadow-[0_1px_2px_rgba(15,23,42,0.03)] outline-none transition focus:border-[#2949a8] focus:ring-4 focus:ring-[#dbe5ff]";
const selectClass = `${inputClass} appearance-none pr-7`;

export default function AddProduct() {
  const router = useRouter();
  const [saved, setSaved] = useState("");

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
          onSubmit={(event) => {
            event.preventDefault();
            submit("Product created successfully.");
          }}
          className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2"
        >
          <FormSection title="Basic Product Information" className="lg:col-span-2">
            <Field label="Product Title" className="sm:col-span-2">
              <input
                required
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
              />
            </Field>
            <Field label="SKU">
              <input
                required
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
            <Field label="Brand">
              <Select
                ariaLabel="Brand"
                options={["Select brand", "Logitech", "Dell"]}
              />
            </Field>
            <Field label="Category">
              <Select
                ariaLabel="Category"
                options={["Select category", "Mouse", "Keyboard", "Monitor"]}
              />
            </Field>
          </FormSection>

          <FormSection title="Warranty Information">
            <div className="grid grid-cols-1 gap-3 sm:col-span-2 sm:grid-cols-2">
              <Field label="Warranty Period">
                <input
                  className={inputClass}
                  defaultValue="1"
                  type="number"
                  min="0"
                />
              </Field>
              <Field label="Unit">
                <Select
                  ariaLabel="Warranty unit"
                  options={["Years", "Days", "Months"]}
                />
              </Field>
            </div>
          </FormSection>
          <FormSection title="Product Description">
            <Field label="Short Description" className="sm:col-span-2">
              <textarea
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
                  defaultChecked
                  className="accent-[#2949a8]"
                />{" "}
                Active
              </label>
              <label className="flex items-center gap-1.5 text-[#8792a4]">
                <input
                  type="radio"
                  name="status"
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
              className="inline-flex h-10 items-center gap-2 rounded-md bg-[#2949a8] px-5 text-[12px] font-semibold text-white shadow-sm hover:bg-[#203d94]"
            >
              <ImagePlus size={12} /> Create Product
            </button>
          </div>
        </form>
      </div>
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
    <div className={`relative overflow-hidden rounded-lg border border-[#d6dce6] bg-white p-5 shadow-[0_2px_5px_rgba(15,23,42,0.04)] ${className}`}>
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
}: {
  options: string[];
  ariaLabel: string;
}) {
  return (
    <span className="relative block">
      <select aria-label={ariaLabel} className={selectClass}>
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
