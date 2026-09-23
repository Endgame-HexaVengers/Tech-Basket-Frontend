import type {
  AIChatResponse,
  ConversationDetail,
  ConversationSummary,
} from "@/types/ai-chat";

const AI_CHAT_ENDPOINT =
  process.env.NEXT_PUBLIC_AI_CHAT_URL || "/api/v1/ai/chat";

export async function uploadToImgBB(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("/api/img-upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (!response.ok || !data.success || !data.url) {
    throw new Error(data.error || "Failed to upload image to ImgBB.");
  }

  return data.url as string;
}

export async function askAIChat({
  message,
  image,
  imageUrl,
  conversationId,
  signal,
}: {
  message: string;
  image?: File;
  imageUrl?: string;
  conversationId?: string;
  signal?: AbortSignal;
}): Promise<AIChatResponse> {
  const formData = new FormData();
  formData.append("message", message);
  if (image) formData.append("image", image);
  if (imageUrl) formData.append("imageUrl", imageUrl);
  if (conversationId) formData.append("conversationId", conversationId);

  const response = await fetch(AI_CHAT_ENDPOINT, {
    method: "POST",
    body: formData,
    credentials: "include",
    signal,
  });

  const payload = (await response.json().catch(() => ({}))) as AIChatResponse;
  if (!response.ok) {
    throw new Error(
      payload.error ||
        (response.status === 401
          ? "Your session has expired. Please sign in again."
          : "The AI service could not process your inquiry right now.")
    );
  }

  return payload;
}

export async function fetchConversations(): Promise<ConversationSummary[]> {
  try {
    const response = await fetch("/api/v1/ai/conversations", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data.conversations) ? data.conversations : [];
  } catch (error) {
    console.warn("Failed to fetch conversations:", error);
    return [];
  }
}

export async function fetchConversation(
  conversationId: string
): Promise<ConversationDetail | null> {
  try {
    const response = await fetch(`/api/v1/ai/conversations/${conversationId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.conversation || null;
  } catch (error) {
    console.warn("Failed to fetch conversation details:", error);
    return null;
  }
}

export async function renameConversation(
  conversationId: string,
  title: string
): Promise<boolean> {
  try {
    const response = await fetch(`/api/v1/ai/conversations/${conversationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
      credentials: "include",
    });

    return response.ok;
  } catch (error) {
    console.warn("Failed to rename conversation:", error);
    return false;
  }
}

export async function deleteConversation(
  conversationId: string
): Promise<boolean> {
  try {
    const response = await fetch(`/api/v1/ai/conversations/${conversationId}`, {
      method: "DELETE",
      credentials: "include",
    });

    return response.ok;
  } catch (error) {
    console.warn("Failed to delete conversation:", error);
    return false;
  }
}
