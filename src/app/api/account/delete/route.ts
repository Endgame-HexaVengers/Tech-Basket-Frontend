
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";

const BACKEND_URL = (process.env.NEXT_PUBLIC_SERVER_URL || "").replace(/\/$/, "");

export async function DELETE(request: NextRequest) {
  try {
    const tokenResult = await auth.api.getToken({
      headers: request.headers,
    });

    if (!tokenResult?.token) {
      return NextResponse.json(
        { message: "Session expired. Please log in again." },
        { status: 401 },
      );
    }

    const backendResponse = await fetch(
      `${BACKEND_URL}/api/v1/users/me`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${tokenResult.token}`,
        },
        cache: "no-store",
      },
    );

    const result = await backendResponse.json().catch(() => null);

    return NextResponse.json(result || {}, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error("Account deletion proxy failed:", error);

    return NextResponse.json(
      { message: "Unable to delete your account." },
      { status: 500 },
    );
  }
}