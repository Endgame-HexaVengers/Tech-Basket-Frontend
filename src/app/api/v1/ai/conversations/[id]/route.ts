import { NextRequest, NextResponse } from "next/server";
import {
  getConversationById,
  renameConversation,
  deleteConversation,
} from "@/lib/ai/aiService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Conversation ID is required." },
        { status: 400 }
      );
    }

    const conversation = await getConversationById(id);
    if (!conversation) {
      return NextResponse.json(
        { success: false, error: "Conversation not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Error in GET /api/v1/ai/conversations/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load conversation." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Conversation ID is required." },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const title = typeof body.title === "string" ? body.title.trim() : "";

    if (!title) {
      return NextResponse.json(
        { success: false, error: "A valid title is required." },
        { status: 400 }
      );
    }

    if (title.length > 80) {
      return NextResponse.json(
        { success: false, error: "Title exceeds maximum 80 characters." },
        { status: 400 }
      );
    }

    const updated = await renameConversation(id, title);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Conversation not found or could not be renamed." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      title,
    });
  } catch (error) {
    console.error("Error in PATCH /api/v1/ai/conversations/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update conversation title." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Conversation ID is required." },
        { status: 400 }
      );
    }

    const deleted = await deleteConversation(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Conversation not found or could not be deleted." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Conversation deleted successfully.",
    });
  } catch (error) {
    console.error("Error in DELETE /api/v1/ai/conversations/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete conversation." },
      { status: 500 }
    );
  }
}
