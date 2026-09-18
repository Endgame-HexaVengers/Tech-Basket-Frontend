import { NextRequest, NextResponse } from "next/server";

const BACKEND_PRODUCTS_URL = process.env.BACKEND_PRODUCTS_URL;

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  if (!BACKEND_PRODUCTS_URL) {
    return NextResponse.json(
      { error: "Product backend URL is not configured." },
      { status: 500 },
    );
  }

  try {
    const authorization = request.headers.get("authorization");
    const response = await fetch(
      `${BACKEND_PRODUCTS_URL}/api/v1/products/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: authorization ? { Authorization: authorization } : undefined,
        cache: "no-store",
      },
    );

    const payload = await response.json().catch(() => ({}));
    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not delete product." },
      { status: 503 },
    );
  }
}