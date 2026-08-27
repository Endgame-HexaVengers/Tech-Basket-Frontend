"use client";

import { FormEvent, useState } from "react";
import { useTabs } from "@/context/TabContext";

export default function AddProductClient() {
  const { setActiveTab } = useTabs();
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Could not save product.");
      setMessage("Product created successfully in the database.");
      event.currentTarget.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="min-h-[calc(100vh-108px)] bg-[#f8fafc] px-5 py-7 text-[#172235] sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-375">
        <div className="mb-8 border-b border-[#e1e6ee] pb-5">
          <h1 className="text-[30px] font-bold tracking-tight text-[#111827]">Add Product</h1>
          <p className="mt-1 text-[13px] text-[#536174]">Create a new product in the TechBasket product catalog.</p>
        </div>
        <form onSubmit={submit} className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <label className="rounded-lg border border-[#d6dce6] bg-white p-5 text-[11px] font-medium lg:col-span-2">Product title
            <input name="title" required className="mt-2 h-11 w-full rounded-md border border-[#d6dce6] px-3 text-[13px]" placeholder="e.g. Logitech B175 Mouse" />
          </label>
          <label className="rounded-lg border border-[#d6dce6] bg-white p-5 text-[11px] font-medium">SKU
            <input name="sku" required className="mt-2 h-11 w-full rounded-md border border-[#d6dce6] px-3 text-[13px]" placeholder="LOG-B175-WH" />
          </label>
          <label className="rounded-lg border border-[#d6dce6] bg-white p-5 text-[11px] font-medium">Brand
            <input name="brand" required className="mt-2 h-11 w-full rounded-md border border-[#d6dce6] px-3 text-[13px]" />
          </label>
          <label className="rounded-lg border border-[#d6dce6] bg-white p-5 text-[11px] font-medium">Category
            <input name="category" required className="mt-2 h-11 w-full rounded-md border border-[#d6dce6] px-3 text-[13px]" />
          </label>
          <label className="rounded-lg border border-[#d6dce6] bg-white p-5 text-[11px] font-medium">Description
            <textarea name="description" className="mt-2 h-28 w-full rounded-md border border-[#d6dce6] p-3 text-[13px]" />
          </label>
          <div className="flex flex-wrap justify-end gap-3 border-t border-[#dfe4ec] pt-6 lg:col-span-2">
            <button type="button" onClick={() => setActiveTab("/admin/products")} className="h-10 px-4 text-[12px] text-[#536174]">Cancel</button>
            <button type="submit" disabled={saving} className="h-10 rounded-md bg-[#2949a8] px-5 text-[12px] font-semibold text-white disabled:opacity-60">{saving ? "Saving..." : "Create Product"}</button>
          </div>
        </form>
        {message && <p role="status" className="mt-4 text-[13px] text-[#2949a8]">{message}</p>}
      </div>
    </section>
  );
}
