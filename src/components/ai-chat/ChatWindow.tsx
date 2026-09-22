"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage as ChatMessageType } from "@/types/ai-chat";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";

export default function ChatWindow({ messages, isLoading }: { messages: ChatMessageType[]; isLoading: boolean }) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-5">
        {messages.map((message) => <ChatMessage key={message.id} message={message} />)}
        {isLoading && <TypingIndicator />}
        <div ref={endRef} />
      </div>
    </div>
  );
}
