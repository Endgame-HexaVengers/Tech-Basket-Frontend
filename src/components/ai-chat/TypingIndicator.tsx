import { Sparkles } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-3.5 text-xs text-slate-500 dark:text-slate-400">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/20">
        <Sparkles size={16} className="animate-spin" style={{ animationDuration: "3s" }} />
      </div>

      <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-slate-200/90 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-1.5 py-0.5">
          {[0, 1, 2].map((item) => (
            <span
              key={item}
              className="h-2 w-2 animate-bounce rounded-full bg-cyan-500 dark:bg-cyan-400"
              style={{
                animationDelay: `${item * 160}ms`,
                animationDuration: "1s",
              }}
            />
          ))}
        </div>
        <span className="ml-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
          Consulting inventory database...
        </span>
      </div>
    </div>
  );
}
