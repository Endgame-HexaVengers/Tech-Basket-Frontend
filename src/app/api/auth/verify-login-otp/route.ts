import { NextRequest, NextResponse } from "next/server";
import {
  normalizeLoginEmail,
  verifyLoginOtp,
  VERIFICATION_COOKIE,
} from "@/lib/login-otp";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string; otp?: string };
    const email = normalizeLoginEmail(body.email || "");
    const token = await verifyLoginOtp(email, body.otp || "");

    if (!token) {
      return NextResponse.json(
        { error: "Invalid or expired verification code." },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(VERIFICATION_COOKIE, `${email}:${token}`, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 5 * 60,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Login OTP verification failed", error);
    return NextResponse.json(
      { error: "Could not verify the code." },
      { status: 500 },
    );
  }
}