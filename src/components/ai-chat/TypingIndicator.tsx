import { Bot } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-500">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300"><Bot size={16} /></div>
      <div className="flex gap-1 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
        {[0, 1, 2].map((item) => <span key={item} className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-500" style={{ animationDelay: `${item * 120}ms` }} />)}
      </div>
    </div>
  );
}
