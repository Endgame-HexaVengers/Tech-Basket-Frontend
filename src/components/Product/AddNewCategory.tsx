"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

type AddNewCategoryProps = {
	categories: string[];
	onClose: () => void;
	onSave: (category: string) => void | Promise<void>;
};

const fieldClass = "mt-1 h-10 w-full rounded-md border border-[#d6dce6] bg-white px-3 text-[13px] text-[#263449] outline-none placeholder:text-[#9aa5b5] focus:border-[#2949a8] focus:ring-4 focus:ring-[#dbe5ff]";

export default function AddNewCategory({ categories, onClose, onSave }: AddNewCategoryProps) {
	const [name, setName] = useState("");
	const [parent, setParent] = useState("None (Top Level)");
	const [description, setDescription] = useState("");
	const [error, setError] = useState("");

	const [saving, setSaving] = useState(false);

	const saveCategory = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const cleanName = name.trim();
		if (!cleanName) {
			setError("Category name is required.");
			return;
		}
		if (categories.some((category) => category.toLowerCase() === cleanName.toLowerCase())) {
			setError("This category already exists. Please enter a different name.");
			return;
		}
		setSaving(true);
		try {
			await onSave(cleanName);
		} catch {
			setError("Could not save this category. Please try again.");
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172235]/45 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
			<div role="dialog" aria-modal="true" aria-labelledby="add-category-title" className="w-full max-w-110 overflow-hidden rounded-lg border border-[#d6dce6] bg-white shadow-2xl">
				<div className="flex items-start justify-between border-b border-[#e2e6ed] px-5 py-4">
					<div><h2 id="add-category-title" className="text-[18px] font-semibold text-[#172235]">Add New Category</h2><p className="mt-1 text-[11px] text-[#718096]">Add a new product category for catalog organization.</p></div>
					<button type="button" onClick={onClose} aria-label="Close add category dialog" className="rounded p-1 text-[#526079] hover:bg-[#f1f5f9]"><X size={18} /></button>
				</div>
				<form onSubmit={saveCategory} className="space-y-4 px-5 py-5">
					<label className="block text-[11px] font-medium text-[#344054]">Category Name <span className="text-[#c2415a]">*</span><input autoFocus required value={name} onChange={(event) => { setName(event.target.value); setError(""); }} className={fieldClass} placeholder="e.g. Wireless Mouse" /></label>
					<label className="block text-[11px] font-medium text-[#344054]">Parent Category<span className="relative block"><select value={parent} onChange={(event) => setParent(event.target.value)} className={`${fieldClass} appearance-none pr-8`}><option>None (Top Level)</option>{categories.map((category) => <option key={category}>{category}</option>)}</select><ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#718096]" /></span></label>
					<label className="block text-[11px] font-medium text-[#344054]">Description <span className="font-normal text-[#8792a4]">(Optional)</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} className="mt-1 h-24 w-full resize-none rounded-md border border-[#d6dce6] p-3 text-[13px] font-normal outline-none placeholder:text-[#9aa5b5] focus:border-[#2949a8] focus:ring-4 focus:ring-[#dbe5ff]" placeholder="Briefly describe the category..." /></label>
					{error && <p role="alert" className="text-[12px] text-[#c2415a]">{error}</p>}
					  <div className="flex justify-end gap-3 border-t border-[#e2e6ed] pt-4"><button type="button" onClick={onClose} disabled={saving} className="h-10 rounded-md border border-[#d6dce6] bg-white px-4 text-[12px] font-medium text-[#344054] hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-60">Cancel</button><button type="submit" disabled={saving} className="h-10 rounded-md bg-[#2949a8] px-4 text-[12px] font-semibold text-white hover:bg-[#203d94] disabled:cursor-wait disabled:opacity-60">{saving ? "Saving..." : "Save Category"}</button></div>
				</form>
			</div>
		</div>
	);
}
