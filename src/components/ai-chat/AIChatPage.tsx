"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Cpu,
  History,
  MessageCircle,
  MessageSquarePlus,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react";

import ChatInput from "./ChatInput";
import ChatWindow from "./ChatWindow";
import ConversationSidebar from "./ConversationSidebar";
import ImagePreview from "./ImagePreview";
import SuggestedQuestions from "./SuggestedQuestions";
import {
  askAIChat,
  deleteConversation as deleteConversationApi,
  fetchConversation,
  fetchConversations,
  renameConversation as renameConversationApi,
  uploadToImgBB,
} from "@/lib/ai/chatClient";
import type { ChatMessage, ConversationSummary } from "@/types/ai-chat";

const initialMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello! I am your **TechBasket Inventory Intelligence Assistant**. I have live access to your warehouse catalog, stock availability, sales orders, and active suppliers. Ask me anything or attach a product image to inspect.",
  timestamp: new Date().toISOString(),
};

const makeId = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export default function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState<File | undefined>();
  const [preview, setPreview] = useState<string>();
  const [conversationId, setConversationId] = useState<string>();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  // Sidebar responsive states
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // In-flight abort controller for Stop Generation
  const abortControllerRef = useRef<AbortController | null>(null);

  const imageName = useMemo(() => image?.name || "Product image", [image]);

  // Load past conversation threads on mount
  const loadConversationList = useCallback(async () => {
    try {
      const list = await fetchConversations();
      setConversations(list);
    } catch {
      // Graceful fallback
    }
  }, []);

  useEffect(() => {
    loadConversationList();
  }, [loadConversationList]);

  // Image selection validation
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

  // Start new conversation
  const handleNewConversation = () => {
    if (isLoading) {
      abortGeneration();
    }
    setMessages([
      {
        ...initialMessage,
        id: makeId(),
        timestamp: new Date().toISOString(),
      },
    ]);
    setConversationId(undefined);
    setInput("");
    setError(undefined);
    removeImage();
    setIsMobileOpen(false);
  };

  // Select past conversation
  const handleSelectConversation = async (selectedId: string) => {
    if (isLoading) {
      abortGeneration();
    }
    setError(undefined);
    removeImage();
    setInput("");

    try {
      const detail = await fetchConversation(selectedId);
      if (detail && Array.isArray(detail.messages) && detail.messages.length > 0) {
        setMessages(detail.messages);
        setConversationId(selectedId);
      } else {
        // Fallback
        setConversationId(selectedId);
      }
    } catch {
      setError("Could not load selected conversation.");
    }
  };

  // Rename conversation
  const handleRenameConversation = async (convId: string, newTitle: string) => {
    const success = await renameConversationApi(convId, newTitle);
    if (success) {
      setConversations((prev) =>
        prev.map((c) => (c.conversationId === convId ? { ...c, title: newTitle } : c))
      );
    }
  };

  // Delete conversation
  const handleDeleteConversation = async (convId: string) => {
    const success = await deleteConversationApi(convId);
    if (success) {
      setConversations((prev) => prev.filter((c) => c.conversationId !== convId));
      if (conversationId === convId) {
        handleNewConversation();
      }
    }
  };

  // Abort generating in-flight
  const abortGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  // Clear current active conversation messages
  const handleClearCurrent = () => {
    if (isLoading) abortGeneration();
    setMessages([
      {
        ...initialMessage,
        id: makeId(),
        timestamp: new Date().toISOString(),
      },
    ]);
    setInput("");
    setError(undefined);
    removeImage();
  };

  // Core send message handler
  const sendMessage = async (overridePrompt?: string) => {
    const question = (overridePrompt ?? input).trim();
    if ((!question && !preview) || isLoading) return;

    const imageUrl = preview;
    const userMsgId = makeId();
    const now = new Date().toISOString();

    // Append user message immediately
    setMessages((current) => [
      ...current,
      {
        id: userMsgId,
        role: "user",
        content: question,
        imageUrl,
        timestamp: now,
      },
    ]);

    setInput("");
    setError(undefined);
    setIsLoading(true);

    const selectedImage = image;
    const localPreviewUrl = preview;
    removeImage();

    // Create AbortController
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      let hostedImageUrl: string | undefined = undefined;
      if (selectedImage) {
        try {
          hostedImageUrl = await uploadToImgBB(selectedImage);
        } catch (uploadErr) {
          console.warn("ImgBB upload warning:", uploadErr);
        }
      }

      const response = await askAIChat({
        message: question,
        image: selectedImage,
        imageUrl: hostedImageUrl || localPreviewUrl,
        conversationId,
        signal: controller.signal,
      });

      const answer = response.data?.answer || response.answer;
      if (!answer) {
        throw new Error("The AI service returned an empty answer.");
      }

      const returnedConvId =
        response.data?.conversationId || response.conversationId || conversationId;

      if (returnedConvId) {
        setConversationId(returnedConvId);
      }

      // Append assistant answer
      setMessages((current) => [
        ...current,
        {
          id: makeId(),
          role: "assistant",
          content: answer,
          timestamp: new Date().toISOString(),
          status: "complete",
        },
      ]);

      // Refresh sidebar conversation list
      loadConversationList();
    } catch (requestError: any) {
      if (requestError?.name === "AbortError" || controller.signal.aborted) {
        // User aborted intentionally
        setMessages((current) => [
          ...current,
          {
            id: makeId(),
            role: "assistant",
            content: "*Generation stopped by user.*",
            timestamp: new Date().toISOString(),
          },
        ]);
      } else {
        const errorMsg =
          requestError instanceof Error
            ? requestError.message
            : "Something went wrong while contacting the AI service.";
        setError(errorMsg);

        // Mark last message with error status
        setMessages((current) => [
          ...current,
          {
            id: makeId(),
            role: "assistant",
            content: `I could not complete the request due to an error: ${errorMsg}`,
            timestamp: new Date().toISOString(),
            status: "error",
          },
        ]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  // Regenerate last assistant response
  const handleRegenerate = async () => {
    if (isLoading) return;

    // Find the last user message
    let lastUserMessage: ChatMessage | null = null;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        lastUserMessage = messages[i];
        break;
      }
    }

    if (!lastUserMessage) return;

    // Remove the last assistant message
    setMessages((current) => {
      const lastIndex = current.findLastIndex((m) => m.role === "assistant");
      if (lastIndex !== -1 && lastIndex > 0) {
        return current.slice(0, lastIndex);
      }
      return current;
    });

    await sendMessage(lastUserMessage.content);
  };

  // Retry last failed inquiry
  const handleRetry = async () => {
    if (isLoading) return;

    let lastUserMessage: ChatMessage | null = null;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        lastUserMessage = messages[i];
        break;
      }
    }

    if (!lastUserMessage) return;

    // Remove error message
    setMessages((current) => {
      if (current.length > 0 && current[current.length - 1].status === "error") {
        return current.slice(0, -1);
      }
      return current;
    });

    await sendMessage(lastUserMessage.content);
  };

  // Suggested prompt click: populate and immediately send
  const handleSelectSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  const activeConversationTitle = useMemo(() => {
    if (!conversationId) return "New Conversation";
    const found = conversations.find((c) => c.conversationId === conversationId);
    return found ? found.title : "Active Conversation";
  }, [conversationId, conversations]);

  return (
    <section className="relative flex h-[calc(100vh-8.5rem)] min-h-[580px] w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute -right-28 -top-28 h-64 w-64 rounded-full bg-cyan-400/5 blur-3xl dark:bg-cyan-500/10" />
      <div className="pointer-events-none absolute -bottom-28 -left-28 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl dark:bg-blue-600/10" />

      {/* History Sidebar */}
      <ConversationSidebar
        conversations={conversations}
        activeId={conversationId}
        onSelect={handleSelectConversation}
        onNewChat={handleNewConversation}
        onRename={handleRenameConversation}
        onDelete={handleDeleteConversation}
        isOpenMobile={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      />

      {/* Main Chat Workspace */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        {/* Header Bar */}
        <header className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            {/* Mobile History Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 md:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              title="Open conversation history"
              aria-label="Open conversation history"
            >
              <History size={16} />
            </button>

            {/* Assistant Icon Badge */}
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/20">
              <Sparkles size={18} />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-white bg-emerald-500 dark:border-slate-950">
                <span className="h-1 w-1 rounded-full bg-white" />
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-sm font-bold tracking-tight text-slate-900 dark:text-white sm:text-base">
                  {activeConversationTitle}
                </h1>
                <span className="hidden rounded-md border border-cyan-200 bg-cyan-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-700 dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-300 sm:inline-block">
                  Live Grounded
                </span>
              </div>
              <p className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                TechBasket Inventory Intelligence
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleNewConversation}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              title="Start a new chat session"
            >
              <MessageSquarePlus size={14} className="text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">New Chat</span>
            </button>

            <button
              type="button"
              onClick={handleClearCurrent}
              disabled={isLoading || messages.length <= 1}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-600 shadow-xs transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-rose-900/60 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
              title="Clear current messages"
            >
              <Trash2 size={13} />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        </header>

        {/* Intelligence Context Strip */}
        <div className="relative z-10 hidden border-b border-slate-100 bg-slate-50/70 px-6 py-2 text-[11px] font-medium text-slate-500 dark:border-slate-800/80 dark:bg-slate-900/40 dark:text-slate-400 sm:flex sm:items-center sm:gap-6">
          <span className="flex items-center gap-1.5">
            <Zap size={13} className="text-amber-500" /> Real-time Warehouse Context
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-emerald-500" /> Strictly Advisory Insights
          </span>
          <span className="flex items-center gap-1.5">
            <MessageCircle size={13} className="text-blue-500" /> Multi-Turn Context Memory
          </span>
        </div>

        {/* Chat Window Message Area */}
        <div className="relative flex min-h-0 flex-1 flex-col">
          {/* Empty / Welcome State Cards */}
          {messages.length === 1 && !isLoading && (
            <div className="pointer-events-none absolute inset-x-0 top-6 z-0 flex flex-col items-center px-4 text-center">
              <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 shadow-xs dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-400">
                <Cpu size={22} />
              </div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                How can I assist your inventory today?
              </h2>
              <p className="mt-0.5 max-w-md text-xs text-slate-400 dark:text-slate-500">
                Ask about stock thresholds, sales revenue, branch distributions, or upload an invoice/product image for visual inspection.
              </p>
            </div>
          )}

          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            onRegenerate={handleRegenerate}
            onRetry={handleRetry}
          />
        </div>

        {/* Input & Composer Footer */}
        <div className="relative z-10 border-t border-slate-200/80 bg-white/95 px-4 py-3.5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95 sm:px-6">
          <div className="mx-auto w-full max-w-3xl space-y-2.5">
            {/* Error Banner */}
            {error && (
              <div
                role="alert"
                className="flex items-center justify-between gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{error}</span>
                </div>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="flex items-center gap-1 font-semibold underline underline-offset-2 hover:text-rose-900 dark:hover:text-rose-100"
                >
                  <RefreshCcw size={12} /> Retry
                </button>
              </div>
            )}

            {/* Uploaded Image Preview */}
            {preview && (
              <div className="overflow-hidden rounded-xl border border-blue-100 bg-blue-50/40 p-2 dark:border-blue-900/40 dark:bg-blue-950/20">
                <ImagePreview src={preview} name={imageName} onRemove={removeImage} />
              </div>
            )}

            {/* Categorized Suggested Prompt Cards (only shown when chat is fresh) */}
            {messages.length === 1 && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <Sparkles size={12} className="text-cyan-500" />
                  Suggested Inquiries
                </div>
                <SuggestedQuestions onSelect={handleSelectSuggestedQuestion} />
              </div>
            )}

            {/* Polished Chat Composer */}
            <div className="rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xs transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:border-blue-500">
              <ChatInput
                value={input}
                onChange={setInput}
                onSubmit={() => sendMessage()}
                onStop={abortGeneration}
                onImageSelect={selectImage}
                disabled={false}
                isLoading={isLoading}
                hasImage={Boolean(preview)}
              />
            </div>

            {/* Bottom Status & Disclaimer */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[10px] text-slate-400 dark:text-slate-500">
              <span>
                Inventory data is synchronized in real-time from TechBasket MongoDB database.
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Sparkles size={11} className="text-cyan-500" />
                Enterprise Intelligence v1.0
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}