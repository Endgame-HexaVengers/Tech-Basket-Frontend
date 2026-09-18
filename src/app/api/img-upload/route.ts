import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json(
        {
          error: "Product image is required.",
        },
        { status: 400 }
      );
    }

    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        {
          error: "Only image files are allowed.",
        },
        { status: 400 }
      );
    }

    // 8 MB maximum
    if (image.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        {
          error: "Image size must be less than 8 MB.",
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "ImgBB API key is not configured.",
        },
        { status: 500 }
      );
    }

    // Convert image to base64
    const buffer = Buffer.from(
      await image.arrayBuffer()
    );

    const base64Image =
      buffer.toString("base64");

    // Prepare ImgBB request
    const uploadData = new URLSearchParams();

    uploadData.append("key", apiKey);
    uploadData.append(
      "image",
      base64Image
    );

    // Upload to ImgBB
    const response = await fetch(
      "https://api.imgbb.com/1/upload",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body: uploadData.toString(),
      }
    );

    const result = await response.json();

    if (
      !response.ok ||
      !result?.success
    ) {
      return NextResponse.json(
        {
          error:
            result?.error?.message ||
            "ImgBB image upload failed.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,

      // Main image URL
      url:
        result.data.display_url ||
        result.data.url,

      // Optional delete URL
      deleteUrl:
        result.data.delete_url,
    });
  } catch (error) {
    console.error(
      "ImgBB upload error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to upload product image.",
      },
      { status: 500 }
    );
  }
}