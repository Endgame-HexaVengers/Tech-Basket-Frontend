import { ImagePlus } from "lucide-react";

export default function ImageUpload({ onSelect, disabled }: { onSelect: (file: File) => void; disabled?: boolean }) {
  return (
    <label className={`flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-cyan-400 hover:text-cyan-600 ${disabled ? "pointer-events-none opacity-50" : ""}`} title="Upload product image">
      <ImagePlus size={18} />
      <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" disabled={disabled} onChange={(event) => { const file = event.target.files?.[0]; if (file) onSelect(file); event.currentTarget.value = ""; }} />
    </label>
  );
}
