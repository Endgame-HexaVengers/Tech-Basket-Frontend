
"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  CircleHelp,
  Cpu,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react";

import ChatInput from "./ChatInput";
import ChatWindow from "./ChatWindow";
import ImagePreview from "./ImagePreview";
import SuggestedQuestions from "./SuggestedQuestions";
import { askAIChat } from "@/lib/ai/chatClient";
import type { ChatMessage } from "@/types/ai-chat";

const initialMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello! I am your TechBasket inventory assistant. Ask me about stock levels, sales, purchases, or upload a product image for a closer look.",
};

const makeId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    initialMessage,
  ]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState<File | undefined>();
  const [preview, setPreview] = useState<string>();
  const [conversationId, setConversationId] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const imageName = useMemo(
    () => image?.name || "Product image",
    [image]
  );

  const selectImage = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please choose a PNG, JPG, or WEBP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Images must be smaller than 5MB.");
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setError(undefined);
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImage(undefined);
    setPreview(undefined);
  };

  const clearConversation = () => {
    if (isLoading) return;

    setMessages([initialMessage]);
    setConversationId(undefined);
    setInput("");
    setError(undefined);
    removeImage();
  };

  const sendMessage = async () => {
    const question = input.trim();

    if (!question || isLoading) return;

    const imageUrl = preview;

    setMessages((current) => [
      ...current,
      {
        id: makeId(),
        role: "user",
        content: question,
        imageUrl,
      },
    ]);

    setInput("");
    setError(undefined);
    setIsLoading(true);

    const selectedImage = image;
    removeImage();

    try {
      const response = await askAIChat({
        message: question,
        image: selectedImage,
        conversationId,
      });

      const answer = response.data?.answer || response.answer;

      if (!answer) {
        throw new Error("The AI response did not contain an answer.");
      }

      setConversationId(
        response.data?.conversationId ||
          response.conversationId ||
          conversationId
      );

      setMessages((current) => [
        ...current,
        {
          id: makeId(),
          role: "assistant",
          content: answer,
        },
      ]);
    } catch (requestError) {
      const isMissingBackend =
        requestError instanceof TypeError ||
        (requestError instanceof Error &&
          (requestError.message.includes("Failed to fetch") ||
            requestError.message === "AI_BACKEND_UNAVAILABLE"));

      if (isMissingBackend) {
        await new Promise((resolve) => setTimeout(resolve, 650));

        setMessages((current) => [
          ...current,
          {
            id: makeId(),
            role: "assistant",
            content: `Demo response: I received your question about “${question}”. The AI backend is not connected yet. Once POST /api/v1/ai/chat is available, this response will be replaced by live inventory analysis.`,
          },
        ]);
      } else {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Something went wrong while contacting the AI service."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-[calc(100vh-9.5rem)] flex-col overflow-hidden rounded-[28px] border border-slate-200/80  shadow shadow-slate-200/40 dark:border-slate-700/60 dark:bg-slate-950 dark:shadow-black/10">

      {/* Background Decoration */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

      {/* Header */}
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 bg-white/80 px-5 py-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 sm:px-7">

        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
            <Sparkles size={22} strokeWidth={2.2} />

            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-base font-bold tracking-tight text-slate-900 dark:text-white sm:text-lg">
                AI Chat Assistant
              </h1>

              <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-700 dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-300">
                AI Powered
              </span>
            </div>

            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              TechBasket Intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-400 sm:flex">
            <CheckCircle2 size={13} />
            Ready
          </div>

          <button
            type="button"
            onClick={clearConversation}
            disabled={isLoading}
            className="group flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-rose-900 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </header>

      {/* Assistant Information Strip */}
      <div className="relative z-10 border-b border-slate-100 bg-slate-50/80 px-5 py-3 dark:border-slate-800 dark:bg-slate-900/40 sm:px-7">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-medium text-slate-500 dark:text-slate-400 sm:justify-start">
          <span className="flex items-center gap-1.5">
            <Zap size={13} className="text-amber-500" />
            Inventory insights
          </span>

          <span className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-emerald-500" />
            Business assistant
          </span>

          <span className="flex items-center gap-1.5">
            <MessageCircle size={13} className="text-blue-500" />
            Ask anything
          </span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        {messages.length === 1 && !isLoading ? (
          <div className="pointer-events-none absolute left-0 right-0 top-5 z-0 flex justify-center px-5 sm:top-8">
            <div className="flex flex-col items-center text-center opacity-80">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-400">
                <Cpu size={23} />
              </div>

              <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">
                Your intelligent inventory companion
              </p>
            </div>
          </div>
        ) : null}

        <ChatWindow
          messages={messages}
          isLoading={isLoading}
        />
      </div>

      {/* Input Section */}
      <div className="relative z-10 border-t border-slate-200/80 bg-white/90 px-4 py-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 sm:px-7 sm:py-5">
        <div className="mx-auto w-full max-w-4xl space-y-3">

          {/* Error Alert */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300"
            >
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Image Preview */}
          {preview && (
            <div className="overflow-hidden rounded-2xl border border-blue-100 bg-blue-50/40 p-2 dark:border-blue-900/40 dark:bg-blue-950/20">
              <ImagePreview
                src={preview}
                name={imageName}
                onRemove={removeImage}
              />
            </div>
          )}

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-950/50">
              <div className="mb-2 flex items-center gap-2 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <CircleHelp size={13} />
                Suggested questions
              </div>

              <SuggestedQuestions onSelect={setInput} />
            </div>
          )}

          {/* Chat Input */}
          <div className="rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:focus-within:border-blue-500">
            <ChatInput
              value={input}
              onChange={setInput}
              onSubmit={sendMessage}
              onImageSelect={selectImage}
              disabled={isLoading}
            />
          </div>

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[10px] text-slate-400 dark:text-slate-500">
            <span>
              AI-generated responses may contain mistakes. Verify critical data.
            </span>

            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles size={11} />
              Powered by TechBasket
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}