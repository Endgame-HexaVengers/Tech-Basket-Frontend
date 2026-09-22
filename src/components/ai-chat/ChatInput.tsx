import { Send } from "lucide-react";
import ImageUpload from "./ImageUpload";

export default function ChatInput({ value, onChange, onSubmit, onImageSelect, disabled }: { value: string; onChange: (value: string) => void; onSubmit: () => void; onImageSelect: (file: File) => void; disabled?: boolean }) {
  return (
    <form onSubmit={(event) => { event.preventDefault(); onSubmit(); }} className="rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/10">
      <textarea value={value} onChange={(event) => onChange(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); onSubmit(); } }} disabled={disabled} rows={2} placeholder="Ask about your inventory..." aria-label="AI question" className="w-full resize-none border-0 bg-transparent px-2 py-1 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-60 dark:text-slate-100" />
      <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2 dark:border-slate-700">
        <div className="flex items-center gap-2"><ImageUpload onSelect={onImageSelect} disabled={disabled} /><span className="hidden text-xs text-slate-400 sm:inline">PNG, JPG or WEBP · max 5MB</span></div>
        <button type="submit" disabled={disabled || !value.trim()} aria-label="Send question" className="flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"><Send size={16} /> Send</button>
      </div>
    </form>
  );
}
