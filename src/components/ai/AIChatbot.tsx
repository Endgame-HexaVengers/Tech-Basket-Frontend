"use client";

import { useState } from "react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

export default function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm TechBasket AI. How can I help you?",
      sender: "ai",
    },
  ]);

  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 overflow-hidden rounded-2xl border bg-white shadow-2xl">

      {/* Header */}
      <div className="flex items-center gap-3 bg-black px-5 py-4 text-white">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl">
          🤖
        </div>

        <div>
          <h2 className="font-semibold">
            TechBasket AI
          </h2>

          <p className="text-xs text-gray-300">
            Inventory Assistant
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 space-y-3 overflow-y-auto p-4">

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-4 py-2 text-sm ${
                message.sender === "user"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}

      </div>

      {/* Input */}
      <div className="flex gap-2 border-t p-3">

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          placeholder="Ask about inventory..."
          className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none"
        />

        <button
          onClick={handleSend}
          className="rounded-lg bg-black px-4 py-2 text-white"
        >
          Send
        </button>

      </div>
    </div>
  );
}