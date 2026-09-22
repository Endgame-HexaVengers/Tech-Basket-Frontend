import type { AIChatResponse } from "@/types/ai-chat";

const AI_CHAT_ENDPOINT =
  process.env.NEXT_PUBLIC_AI_CHAT_URL || "/api/v1/ai/chat";

export async function askAIChat({
  message,
  image,
  conversationId,
}: {
  message: string;
  image?: File;
  conversationId?: string;
}): Promise<AIChatResponse> {
  const formData = new FormData();
  formData.append("message", message);
  if (image) formData.append("image", image);
  if (conversationId) formData.append("conversationId", conversationId);

  const response = await fetch(AI_CHAT_ENDPOINT, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const payload = (await response.json().catch(() => ({}))) as AIChatResponse;
  if (!response.ok) {
    if (response.status === 404 || response.status === 501) {
      throw new Error("AI_BACKEND_UNAVAILABLE");
    }

    throw new Error(
      payload.error ||
        (response.status === 401
          ? "Your session has expired. Please sign in again."
          : "The AI service could not answer right now."),
    );
  }

  return payload;
}
