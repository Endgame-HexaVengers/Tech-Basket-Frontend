export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  imageUrl?: string;
};

export type AIChatResponse = {
  success?: boolean;
  data?: {
    answer?: string;
    conversationId?: string;
  };
  answer?: string;
  conversationId?: string;
  error?: string;
};
