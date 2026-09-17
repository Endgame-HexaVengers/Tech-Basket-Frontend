import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json({ error: "Please select an image." }, { status: 400 });
    }

    if (!image.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
    }

    if (image.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be smaller than 8 MB." }, { status: 400 });
    }

    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const url = `data:${image.type};base64,${imageBuffer.toString("base64")}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Image upload failed", error);
    return NextResponse.json({ error: "Could not upload image." }, { status: 500 });
  }
}
