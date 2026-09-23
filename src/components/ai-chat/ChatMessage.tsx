"use client";

import { useState } from "react";
import {
  AlertCircle,
  Bot,
  Check,
  Copy,
  ExternalLink,
  RotateCcw,
  Sparkles,
  User,
} from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/types/ai-chat";
import MarkdownRenderer from "./MarkdownRenderer";

function formatTimestamp(isoString?: string): string {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

interface ChatMessageProps {
  message: ChatMessageType;
  isLatestAssistant?: boolean;
  isLoading?: boolean;
  onRegenerate?: () => void;
  onRetry?: () => void;
}

export default function ChatMessage({
  message,
  isLatestAssistant,
  isLoading,
  onRegenerate,
  onRetry,
}: ChatMessageProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const time = formatTimestamp(message.timestamp);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <article
      className={`group flex gap-3.5 transition-all ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* Bot Avatar */}
      {!isUser && (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/20">
          <Sparkles size={17} />
        </div>
      )}

      {/* Message Body */}
      <div
        className={`flex flex-col ${
          isUser ? "items-end" : "items-start"
        } max-w-[min(92%,44rem)]`}
      >
        {/* Author & Timestamp Header */}
        <div className="mb-1 flex items-center gap-2 px-1 text-[11px] text-slate-400 dark:text-slate-500">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {isUser ? "You" : "TechBasket Assistant"}
          </span>
          {time && <span>• {time}</span>}
        </div>

        {/* Message Bubble */}
        <div
          className={`relative rounded-2xl px-4 py-3.5 text-sm shadow-sm transition ${
            isUser
              ? "rounded-tr-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-600/10"
              : message.status === "error"
              ? "rounded-tl-sm border border-rose-200 bg-rose-50/70 text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200"
              : "rounded-tl-sm border border-slate-200/90 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-100"
          }`}
        >
          {/* Uploaded Image Preview */}
          {message.imageUrl && (
            <div className="mb-3 overflow-hidden rounded-xl border border-white/20 bg-slate-950/10">
              <a
                href={message.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/img relative block"
                title="Click to view full image"
              >
                <img
                  src={message.imageUrl}
                  alt="Product context"
                  className="max-h-60 w-auto rounded-lg object-contain transition group-hover/img:opacity-90"
                />
                <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-slate-900/80 px-2 py-0.5 text-[10px] text-white opacity-0 backdrop-blur-sm transition group-hover/img:opacity-100">
                  <ExternalLink size={10} /> View full
                </span>
              </a>
            </div>
          )}

          {/* Text Content */}
          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed text-sm">
              {message.content}
            </p>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}

          {/* Error Status Notice */}
          {message.status === "error" && (
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-rose-200/80 pt-2.5 text-xs text-rose-700 dark:border-rose-900/50 dark:text-rose-300">
              <span className="flex items-center gap-1.5 font-medium">
                <AlertCircle size={14} /> Request failed to complete
              </span>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  disabled={isLoading}
                  className="flex items-center gap-1 font-semibold underline underline-offset-2 hover:text-rose-900 dark:hover:text-rose-100"
                >
                  <RotateCcw size={12} /> Retry
                </button>
              )}
            </div>
          )}
        </div>

        {/* Action Bar (Copy / Regenerate) */}
        <div
          className={`mt-1.5 flex items-center gap-1 px-1 text-slate-400 opacity-80 transition group-hover:opacity-100 dark:text-slate-500`}
        >
          {/* Copy Message */}
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy message text"
            className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            title="Copy message"
          >
            {copied ? (
              <>
                <Check size={12} className="text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Regenerate Response (Latest Assistant Message Only) */}
          {!isUser && isLatestAssistant && onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              disabled={isLoading}
              aria-label="Regenerate response"
              className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              title="Regenerate this response"
            >
              <RotateCcw size={12} className={isLoading ? "animate-spin" : ""} />
              <span>Regenerate</span>
            </button>
          )}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300">
          <User size={18} />
        </div>
      )}
    </article>
  );
}
