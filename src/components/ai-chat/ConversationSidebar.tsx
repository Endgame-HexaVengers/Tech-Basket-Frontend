"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  MessageSquarePlus,
  Pencil,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import type { ConversationSummary } from "@/types/ai-chat";

interface ConversationSidebarProps {
  conversations: ConversationSummary[];
  activeId?: string;
  onSelect: (conversationId: string) => void;
  onNewChat: () => void;
  onRename: (conversationId: string, title: string) => Promise<void>;
  onDelete: (conversationId: string) => Promise<void>;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

function formatRelativeTime(isoString?: string): string {
  if (!isoString) return "";
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(isoString).toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  onRename,
  onDelete,
  isOpenMobile,
  onCloseMobile,
  isCollapsed,
  onToggleCollapse,
}: ConversationSidebarProps) {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return conversations;
    return conversations.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        (c.lastMessageSnippet && c.lastMessageSnippet.toLowerCase().includes(query))
    );
  }, [conversations, search]);

  const startEditing = (conv: ConversationSummary, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conv.conversationId);
    setEditingTitle(conv.title);
  };

  const saveEditing = async (conversationId: string, e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (editingTitle.trim()) {
      await onRename(conversationId, editingTitle.trim());
    }
    setEditingId(null);
  };

  const cancelEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const confirmDelete = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await onDelete(conversationId);
    setDeletingId(null);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-slate-50/90 dark:bg-slate-950/95">
      {/* Sidebar Header & New Chat */}
      <div className="border-b border-slate-200/80 p-3.5 dark:border-slate-800">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onNewChat}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:from-blue-700 hover:to-indigo-700 hover:shadow"
          >
            <MessageSquarePlus size={16} />
            <span>New Chat</span>
          </button>

          {/* Collapse button on desktop */}
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? "Expand history sidebar" : "Collapse history sidebar"}
            className="hidden h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white md:flex"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft size={16} />
          </button>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 md:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search input */}
        <div className="relative mt-3">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-500"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Conversations List */}
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {filteredConversations.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            {search ? "No matching conversations" : "No past conversations yet"}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredConversations.map((conv) => {
              const isActive = conv.conversationId === activeId;
              const isEditing = editingId === conv.conversationId;
              const isConfirmingDelete = deletingId === conv.conversationId;

              return (
                <div
                  key={conv.conversationId}
                  onClick={() => {
                    if (!isEditing && !isConfirmingDelete) {
                      onSelect(conv.conversationId);
                      onCloseMobile();
                    }
                  }}
                  className={`group relative flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-xs transition ${
                    isActive
                      ? "border border-blue-200 bg-blue-50/80 font-semibold text-blue-900 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200"
                      : "text-slate-700 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-900/80"
                  }`}
                >
                  {isEditing ? (
                    <form
                      onSubmit={(e) => saveEditing(conv.conversationId, e)}
                      className="flex flex-1 items-center gap-1.5"
                    >
                      <input
                        type="text"
                        autoFocus
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        className="w-full rounded-lg border border-blue-400 bg-white px-2 py-1 text-xs text-slate-900 outline-none dark:bg-slate-900 dark:text-white"
                      />
                      <button
                        type="submit"
                        className="rounded p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                      >
                        <Check size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="rounded p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                      >
                        <X size={13} />
                      </button>
                    </form>
                  ) : isConfirmingDelete ? (
                    <div className="flex flex-1 items-center justify-between text-xs text-rose-600">
                      <span>Delete chat?</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => confirmDelete(conv.conversationId, e)}
                          className="rounded bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-rose-700"
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingId(null);
                          }}
                          className="rounded bg-slate-200 px-2 py-0.5 text-[10px] text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <MessageSquare
                            size={14}
                            className={`shrink-0 ${
                              isActive
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                            }`}
                          />
                          <p className="truncate text-xs">{conv.title}</p>
                        </div>
                        <span className="mt-0.5 block text-[10px] font-normal text-slate-400 dark:text-slate-500">
                          {formatRelativeTime(conv.updatedAt)}
                        </span>
                      </div>

                      {/* Hover Actions: Rename / Delete */}
                      <div className="ml-2 flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={(e) => startEditing(conv, e)}
                          title="Rename"
                          className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingId(conv.conversationId);
                          }}
                          title="Delete"
                          className="rounded p-1 text-slate-400 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-950/50 dark:hover:text-rose-400"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="border-t border-slate-200/80 p-3 text-[11px] text-slate-400 dark:border-slate-800 dark:text-slate-500">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
          <span className="truncate">Live MongoDB Grounding</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden border-r border-slate-200/80 transition-all duration-200 dark:border-slate-800 md:block ${
          isCollapsed ? "w-0 overflow-hidden border-none" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Collapsed Toggle Button when sidebar is closed on desktop */}
      {isCollapsed && (
        <button
          type="button"
          onClick={onToggleCollapse}
          className="absolute left-2 top-3 z-30 hidden h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 md:flex"
          title="Open conversation history"
        >
          <ChevronRight size={16} />
        </button>
      )}

      {/* Mobile Drawer (Sheet) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-72 max-w-[85vw] shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
