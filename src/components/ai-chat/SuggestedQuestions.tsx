import { ArrowUpRight } from "lucide-react";

const suggestions = [
  "Which products have low stock?",
  "Summarize today's sales activity",
  "What should we reorder this week?",
];

export default function SuggestedQuestions({ onSelect }: { onSelect: (question: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((question) => (
        <button key={question} type="button" onClick={() => onSelect(question)} className="group rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-cyan-700 dark:hover:text-cyan-300">
          {question}<ArrowUpRight size={13} className="ml-1 inline transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </button>
      ))}
    </div>
  );
}
