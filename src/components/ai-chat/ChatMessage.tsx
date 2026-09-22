"use client";

import { Bot, User } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/types/ai-chat";

export default function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === "user";

  return (
    <article className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
          <Bot size={16} />
        </div>
      )}
      <div className={`max-w-[min(90%,42rem)] ${isUser ? "items-end" : "items-start"}`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${isUser ? "rounded-br-md bg-blue-600 text-white" : "rounded-bl-md border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}>
          {message.imageUrl && (
            <img src={message.imageUrl} alt="Uploaded product" className="mb-3 max-h-48 max-w-full rounded-xl object-contain" />
          )}
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
      {isUser && (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          <User size={16} />
        </div>
      )}
    </article>
  );
}
