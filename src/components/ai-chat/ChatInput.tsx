"use client";

import { useEffect, useRef } from "react";
import { CornerDownLeft, Send, Square, X } from "lucide-react";
import ImageUpload from "./ImageUpload";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStop?: () => void;
  onImageSelect: (file: File) => void;
  disabled?: boolean;
  isLoading?: boolean;
  hasImage?: boolean;
  onOpenDataPolicy?: () => void;
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  onStop,
  onImageSelect,
  disabled,
  isLoading,
  hasImage,
  onOpenDataPolicy,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea up to 140px
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      const nextHeight = Math.min(el.scrollHeight, 140);
      el.style.height = `${Math.max(nextHeight, 38)}px`;
    }
  }, [value]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!disabled && !isLoading && (value.trim() || hasImage)) {
        onSubmit();
      }
    }
  };

  const handleClear = () => {
    onChange("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "38px";
      textareaRef.current.focus();
    }
  };

  const canSubmit = !disabled && !isLoading && (value.trim().length > 0 || hasImage);

  return (
    <div className="w-full">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (isLoading) {
            onStop?.();
          } else if (canSubmit) {
            onSubmit();
          }
        }}
        className="flex flex-col gap-2"
      >
        {/* Input Textarea Container */}
        <div className="relative flex items-center">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Ask about inventory, sales, purchases, stock alerts..."
            aria-label="Inquiry to AI assistant"
            rows={1}
            maxLength={4000}
            className="w-full resize-none border-0 bg-transparent px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-60 dark:text-slate-100 dark:placeholder:text-slate-500"
          />

          {/* Quick Clear Text Button */}
          {value.length > 0 && !disabled && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              title="Clear input"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Toolbar & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-2 pt-2 dark:border-slate-800">
          {/* Left tools: Image attachment & hints */}
          <div className="flex items-center gap-2">
            <ImageUpload onSelect={onImageSelect} disabled={disabled || isLoading} />

            <span className="hidden text-[11px] text-slate-400 sm:inline">
              Attach image (max 5MB)
              {onOpenDataPolicy && (
                <>
                  {" · "}
                  <button
                    type="button"
                    onClick={onOpenDataPolicy}
                    className="font-medium text-cyan-600 underline underline-offset-2 transition hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
                  >
                    Data Policy
                  </button>
                </>
              )}
            </span>
          </div>

          {/* Right tools: Character counter & Action button */}
          <div className="flex items-center gap-2.5">
            {value.length > 100 && (
              <span className="text-[10px] text-slate-400">
                {value.length}/4000
              </span>
            )}

            {/* Dynamic Button: Stop when generating, Send otherwise */}
            {isLoading ? (
              <button
                type="button"
                onClick={onStop}
                className="flex h-9 items-center gap-1.5 rounded-xl border border-rose-300 bg-rose-50 px-3.5 text-xs font-semibold text-rose-700 shadow-sm transition hover:bg-rose-100 hover:text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300"
                title="Stop response generation"
              >
                <Square size={13} className="fill-current animate-pulse" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!canSubmit}
                aria-label="Send inquiry"
                className="flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 text-xs font-semibold text-white shadow-sm transition hover:from-blue-700 hover:to-indigo-700 hover:shadow disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span>Send</span>
                <CornerDownLeft size={13} />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
