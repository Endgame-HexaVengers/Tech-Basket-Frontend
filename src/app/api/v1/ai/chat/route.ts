import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { generateInventoryAIResponse } from "@/lib/ai/aiService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    let message = "";
    let conversationId: string | undefined = undefined;
    let imageUrl: string | undefined = undefined;

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      message = (formData.get("message") as string) || "";
      conversationId = (formData.get("conversationId") as string) || undefined;
      imageUrl = (formData.get("imageUrl") as string) || undefined;

      // If an actual image file was uploaded in FormData
      const imageFile = formData.get("image");
      if (imageFile instanceof File && !imageUrl) {
        try {
          const apiKey = process.env.IMGBB_API_KEY;
          if (apiKey) {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const base64Image = buffer.toString("base64");
            const uploadData = new URLSearchParams();
            uploadData.append("key", apiKey);
            uploadData.append("image", base64Image);

            const uploadRes = await fetch("https://api.imgbb.com/1/upload", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: uploadData.toString(),
            });

            if (uploadRes.ok) {
              const resData = await uploadRes.json();
              if (resData?.data?.url) {
                imageUrl = resData.data.display_url || resData.data.url;
              }
            }
          }
        } catch (uploadErr) {
          console.warn("Failed to process inline image upload to ImgBB:", uploadErr);
        }
      }
    } else {
      const body = await request.json().catch(() => ({}));
      message = body.message || "";
      conversationId = body.conversationId || undefined;
      imageUrl = body.imageUrl || body.image || undefined;
    }

    message = message.trim();

    if (!message && !imageUrl) {
      return NextResponse.json(
        { success: false, error: "Please provide a question or an image to analyze." },
        { status: 400 }
      );
    }

    if (message.length > 4000) {
      return NextResponse.json(
        { success: false, error: "Inquiry exceeds the maximum allowed length (4,000 characters)." },
        { status: 400 }
      );
    }

    // Check optional user authentication and branch permissions
    let userBranch: string | undefined = undefined;
    let userRole: string | undefined = undefined;
    let userId: string | undefined = undefined;
    let userEmail: string | undefined = undefined;

    try {
      const reqHeaders = await headers();
      const session = await auth.api.getSession({ headers: reqHeaders });
      if (session?.user) {
        userId = session.user.id;
        userEmail = session.user.email;
        userBranch = (session.user as any).branch;
        userRole = (session.user as any).role;
      }
    } catch {
      // Session extraction optional for AI advisory
    }

    // Generate real-time grounded AI response
    const result = await generateInventoryAIResponse({
      message,
      conversationId,
      imageUrl,
      userBranch,
      userRole,
      userId,
      userEmail,
    });

    return NextResponse.json({
      success: true,
      data: {
        answer: result.answer,
        conversationId: result.conversationId,
        sources: result.sources,
      },
      answer: result.answer,
      conversationId: result.conversationId,
    });
  } catch (error) {
    console.error("AI Chat API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "We encountered an issue while consulting your inventory intelligence. Please try again.",
      },
      { status: 500 }
    );
  }
}
