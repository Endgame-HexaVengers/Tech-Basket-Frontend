"use client";

import { useEffect, useRef, useState, UIEvent } from "react";
import { ArrowDown } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/types/ai-chat";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";

interface ChatWindowProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  onRegenerate?: () => void;
  onRetry?: () => void;
}

export default function ChatWindow({
  messages,
  isLoading,
  onRegenerate,
  onRetry,
}: ChatWindowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  // Identify the latest assistant message
  let latestAssistantIndex = -1;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "assistant") {
      latestAssistantIndex = i;
      break;
    }
  }

  // Handle scroll detection
  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isFarFromBottom = scrollHeight - scrollTop - clientHeight > 140;
    setShowScrollBottom(isFarFromBottom);
  };

  const scrollToBottom = (smooth = true) => {
    endRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  useEffect(() => {
    // Only auto-scroll if user is close to bottom
    if (!showScrollBottom) {
      scrollToBottom();
    }
  }, [messages, isLoading, showScrollBottom]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="relative min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {messages.map((message, idx) => (
          <ChatMessage
            key={message.id || idx}
            message={message}
            isLatestAssistant={idx === latestAssistantIndex}
            isLoading={isLoading}
            onRegenerate={onRegenerate}
            onRetry={onRetry}
          />
        ))}

        {isLoading && <TypingIndicator />}

        <div ref={endRef} className="h-2" />
      </div>

      {/* Floating Scroll to Bottom Button */}
      {showScrollBottom && (
        <button
          type="button"
          onClick={() => scrollToBottom(true)}
          className="absolute bottom-4 right-8 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-600 shadow-md backdrop-blur transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800/95 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          aria-label="Scroll to newest message"
        >
          <ArrowDown size={16} />
        </button>
      )}
    </div>
  );
}
