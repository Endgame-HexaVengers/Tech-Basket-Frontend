export type ChatRole = "user" | "assistant";

export type ChatMessageStatus = "complete" | "error" | "sending";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  imageUrl?: string;
  timestamp?: string;
  status?: ChatMessageStatus;
};

export type ConversationSummary = {
  id: string;
  conversationId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount?: number;
  lastMessageSnippet?: string;
};

export type ConversationDetail = {
  id: string;
  conversationId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
};

export type AIChatResponse = {
  success?: boolean;
  data?: {
    answer?: string;
    conversationId?: string;
    sources?: string[];
  };
  answer?: string;
  conversationId?: string;
  error?: string;
};
