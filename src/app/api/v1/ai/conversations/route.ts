import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getConversationList } from "@/lib/ai/aiService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    let userId: string | undefined = undefined;
    let userEmail: string | undefined = undefined;

    try {
      const reqHeaders = await headers();
      const session = await auth.api.getSession({ headers: reqHeaders });
      if (session?.user) {
        userId = session.user.id;
        userEmail = session.user.email;
      }
    } catch {
      // Session extraction optional
    }

    const conversations = await getConversationList({ userId, userEmail });

    return NextResponse.json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("Error in GET /api/v1/ai/conversations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve conversation history." },
      { status: 500 }
    );
  }
}
