import { X } from "lucide-react";

export default function ImagePreview({ src, name, onRemove }: { src: string; name: string; onRemove: () => void }) {
  return (
    <div className="relative inline-flex max-w-full items-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 p-2 dark:border-cyan-900 dark:bg-cyan-950/40">
      <img src={src} alt={name} className="h-14 w-14 rounded-lg object-cover" />
      <span className="max-w-40 truncate text-xs font-medium text-cyan-900 dark:text-cyan-100">{name}</span>
      <button type="button" onClick={onRemove} aria-label="Remove image" className="flex h-6 w-6 items-center justify-center rounded-full text-cyan-700 hover:bg-cyan-200 dark:hover:bg-cyan-900"><X size={14} /></button>
    </div>
  );
}
