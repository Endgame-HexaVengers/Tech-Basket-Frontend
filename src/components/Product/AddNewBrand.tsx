"use client";

import { useState } from "react";
import { X } from "lucide-react";

type AddNewBrandProps = {
	brands: string[];
	onClose: () => void;
	onSave: (brand: string) => void | Promise<void>;
};

const fieldClass = "mt-1 h-10 w-full rounded-md border border-[#d6dce6] bg-white px-3 text-[13px] text-[#263449] outline-none placeholder:text-[#9aa5b5] focus:border-[#2949a8] focus:ring-4 focus:ring-[#dbe5ff]";

export default function AddNewBrand({ brands, onClose, onSave }: AddNewBrandProps) {
	const [name, setName] = useState("");
	const [website, setWebsite] = useState("");
	const [description, setDescription] = useState("");
	const [error, setError] = useState("");
	const [saving, setSaving] = useState(false);

	const saveBrand = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const cleanName = name.trim();
		if (!cleanName) {
			setError("Brand name is required.");
			return;
		}
		if (brands.some((brand) => brand.toLowerCase() === cleanName.toLowerCase())) {
			setError("This brand already exists. Please enter a different name.");
			return;
		}
		setSaving(true);
		try {
			await onSave(cleanName);
		} catch {
			setError("Could not save this brand. Please try again.");
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172235]/45 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
			<div role="dialog" aria-modal="true" aria-labelledby="add-brand-title" className="w-full max-w-110 overflow-hidden rounded-lg border border-[#d6dce6] bg-white shadow-2xl">
				<div className="flex items-start justify-between border-b border-[#e2e6ed] px-5 py-4">
					<div><h2 id="add-brand-title" className="text-[18px] font-semibold text-[#172235]">Add New Brand</h2><p className="mt-1 text-[11px] text-[#718096]">Create a new brand entry in the master catalog.</p></div>
					<button type="button" onClick={onClose} aria-label="Close add brand dialog" className="rounded p-1 text-[#526079] hover:bg-[#f1f5f9]"><X size={18} /></button>
				</div>
				<form onSubmit={saveBrand} className="space-y-4 px-5 py-5">
					<label className="block text-[11px] font-medium text-[#344054]">Brand Name <span className="text-[#c2415a]">*</span><input autoFocus required value={name} onChange={(event) => { setName(event.target.value); setError(""); }} className={fieldClass} placeholder="e.g. Logitech" /></label>
					<label className="block text-[11px] font-medium text-[#344054]">Brand Website <span className="font-normal text-[#8792a4]">(Optional)</span><input type="url" value={website} onChange={(event) => setWebsite(event.target.value)} className={fieldClass} placeholder="https://www.example.com" /></label>
					<label className="block text-[11px] font-medium text-[#344054]">Description <span className="font-normal text-[#8792a4]">(Optional)</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} className="mt-1 h-24 w-full resize-none rounded-md border border-[#d6dce6] p-3 text-[13px] font-normal outline-none placeholder:text-[#9aa5b5] focus:border-[#2949a8] focus:ring-4 focus:ring-[#dbe5ff]" placeholder="Brief details about the brand..." /></label>
					{error && <p role="alert" className="text-[12px] text-[#c2415a]">{error}</p>}
					<div className="flex justify-end gap-3 border-t border-[#e2e6ed] pt-4"><button type="button" onClick={onClose} disabled={saving} className="h-10 rounded-md border border-[#d6dce6] bg-white px-4 text-[12px] font-medium text-[#344054] hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-60">Cancel</button><button type="submit" disabled={saving} className="h-10 rounded-md bg-[#2949a8] px-4 text-[12px] font-semibold text-white hover:bg-[#203d94] disabled:cursor-wait disabled:opacity-60">{saving ? "Saving..." : "Save Brand"}</button></div>
				</form>
			</div>
		</div>
	);
}
