import { AlertTriangle, ArrowUpRight, BarChart3, Package, ShoppingCart } from "lucide-react";

interface PromptCategory {
  title: string;
  icon: React.ReactNode;
  prompts: {
    label: string;
    query: string;
  }[];
}

const CATEGORIES: PromptCategory[] = [
  {
    title: "Stock Health & Alerts",
    icon: <AlertTriangle size={14} className="text-amber-500" />,
    prompts: [
      {
        label: "Low stock items",
        query: "Which products have low stock and need urgent reordering?",
      },
      {
        label: "Out of stock items",
        query: "List all products currently out of stock with 0 available units.",
      },
    ],
  },
  {
    title: "Sales & Revenue",
    icon: <BarChart3 size={14} className="text-blue-500" />,
    prompts: [
      {
        label: "Sales performance",
        query: "Summarize our total sales activity, revenue, and top-selling products.",
      },
      {
        label: "Branch distribution",
        query: "Show current inventory breakdown across all branches.",
      },
    ],
  },
  {
    title: "Procurement & Reorders",
    icon: <ShoppingCart size={14} className="text-emerald-500" />,
    prompts: [
      {
        label: "Reorder plan",
        query: "What products should we reorder this week based on threshold deficits?",
      },
      {
        label: "Pending purchases",
        query: "Summarize pending purchase orders and active supplier status.",
      },
    ],
  },
];

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

export default function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
      {CATEGORIES.map((cat, idx) => (
        <div
          key={idx}
          className="flex flex-col gap-1.5 rounded-xl border border-slate-200/80 bg-white/70 p-2.5 shadow-xs dark:border-slate-800 dark:bg-slate-900/60"
        >
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300">
            {cat.icon}
            <span>{cat.title}</span>
          </div>

          <div className="flex flex-col gap-1">
            {cat.prompts.map((p, pIdx) => (
              <button
                key={pIdx}
                type="button"
                onClick={() => onSelect(p.query)}
                className="group flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 px-2.5 py-1.5 text-left text-xs text-slate-600 transition hover:border-blue-200 hover:bg-blue-50/60 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400 dark:hover:border-blue-900/60 dark:hover:bg-blue-950/40 dark:hover:text-blue-300"
              >
                <span className="truncate">{p.label}</span>
                <ArrowUpRight
                  size={12}
                  className="shrink-0 text-slate-400 opacity-60 transition group-hover:opacity-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
