import { NextRequest, NextResponse } from "next/server";
import {
  getLoginUser,
  sendLoginOtp,
  verifyLoginCredentials,
} from "@/lib/login-otp";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const rawIdentifier = (body.email || "").trim();
    const password = body.password || "";

    if (!rawIdentifier || !password) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const isValid = await verifyLoginCredentials(rawIdentifier, password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const user = await getLoginUser(rawIdentifier);
    const targetEmail = (user?.email || rawIdentifier).trim().toLowerCase();

    await sendLoginOtp(targetEmail);
    return NextResponse.json({ success: true, email: targetEmail });
  } catch (error) {
    console.error("Login OTP request failed", error);
    return NextResponse.json(
      { error: "Could not send the verification code." },
      { status: 500 },
    );
  }
}