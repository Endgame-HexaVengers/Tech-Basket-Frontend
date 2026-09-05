"use client";

import { useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  X,
  Minimize2,
  PackageSearch,
  ShoppingCart,
  BarChart3,
} from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

const quickPrompts = [
  {
    label: "Low stock",
    icon: PackageSearch,
    text: "Which products are low in stock?",
  },
  {
    label: "Reorder",
    icon: ShoppingCart,
    text: "Which products need reorder?",
  },
  {
    label: "Summary",
    icon: BarChart3,
    text: "Give me an inventory summary",
  },
];

export default function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! 👋 I'm TechBasket AI. I can help you analyze inventory, stock levels, reorder recommendations and RMA insights.",
      sender: "ai",
    },
  ]);

  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const handleSend = (messageText?: string) => {
    const text = messageText ?? input;

    if (!text.trim()) return;

    const newMessage: Message = {
      // eslint-disable-next-line react-hooks/purity
      id: Date.now(),
      text: text.trim(),
      sender: "user",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white shadow-[0_10px_35px_rgba(99,102,241,0.45)] transition-all duration-300 hover:scale-105"
      >
        <div className="relative">
          <Bot size={28} />

          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-indigo-600 bg-emerald-400" />
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[390px] overflow-hidden rounded-[24px] border border-white/60 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.20)]">

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-5 py-5 text-white">

        {/* Decorative blur */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

        <div className="relative flex items-center justify-between">

          <div className="flex items-center gap-3">

            {/* AI Icon */}
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-inner backdrop-blur-md">
              <Bot size={24} />

              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-violet-600 bg-emerald-400" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-semibold">
                  TechBasket AI
                </h2>

                <Sparkles size={14} className="text-yellow-300" />
              </div>

              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                <p className="text-xs text-white/80">
                  Online · Inventory Assistant
                </p>
              </div>
            </div>
          </div>

          {/* Header buttons */}
          <div className="flex items-center gap-1">

            <button
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Minimize chatbot"
            >
              <Minimize2 size={16} />
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Close chatbot"
            >
              <X size={17} />
            </button>

          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-[350px] space-y-4 overflow-y-auto bg-slate-50/70 px-4 py-5">

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >

            {message.sender === "ai" && (
              <div className="mr-2 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
                <Bot size={16} />
              </div>
            )}

            <div
              className={`max-w-[78%] rounded-2xl px-4 py-3 text-[13px] leading-5 ${
                message.sender === "user"
                  ? "rounded-br-md bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md"
                  : "rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm"
              }`}
            >
              {message.text}
            </div>

          </div>
        ))}

        {/* Quick prompts */}
        {messages.length === 1 && (
          <div className="pt-2">

            <p className="mb-2 px-1 text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Quick actions
            </p>

            <div className="grid grid-cols-1 gap-2">

              {quickPrompts.map((prompt) => {
                const Icon = prompt.icon;

                return (
                  <button
                    key={prompt.label}
                    onClick={() => handleSend(prompt.text)}
                    className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50/50 hover:shadow-sm"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-100">
                      <Icon size={15} />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-700">
                        {prompt.label}
                      </p>

                      <p className="mt-0.5 text-[11px] text-slate-400">
                        {prompt.text}
                      </p>
                    </div>
                  </button>
                );
              })}

            </div>
          </div>
        )}

      </div>

      {/* Input */}
      <div className="border-t border-slate-200 bg-white p-3">

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1.5 transition-all focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-50">

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
            placeholder="Ask about your inventory..."
            className="min-w-0 flex-1 bg-transparent px-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>

        </div>

        <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-slate-400">
          <Sparkles size={10} />
          Powered by TechBasket AI
        </div>

      </div>
    </div>
  );
}