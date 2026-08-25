import { NextRequest, NextResponse } from "next/server";
import { catalogDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";

const products = () => catalogDatabase.collection("products");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      title?: string;
      sku?: string;
      brand?: string;
      category?: string;
      color?: string;
      warrantyPeriod?: number;
      warrantyUnit?: string;
      description?: string;
      status?: "active" | "inactive";
    };

    const title = body.title?.trim() || "";
    const sku = body.sku?.trim().toUpperCase() || "";

    if (!title || !sku || !body.brand || !body.category) {
      return NextResponse.json(
        { error: "Title, SKU, brand and category are required." },
        { status: 400 },
      );
    }

    await products().createIndex({ sku: 1 }, { unique: true });
    const product = {
      title,
      sku,
      brand: body.brand,
      category: body.category,
      color: body.color || "",
      warrantyPeriod: Number(body.warrantyPeriod) || 0,
      warrantyUnit: body.warrantyUnit || "Years",
      description: body.description?.trim() || "",
      status: body.status === "inactive" ? "inactive" : "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await products().insertOne(product);
    return NextResponse.json(
      { id: result.insertedId.toString(), ...product },
      { status: 201 },
    );
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
      return NextResponse.json({ error: "This SKU already exists." }, { status: 409 });
    }
    console.error("Product POST failed", error);
    return NextResponse.json({ error: "Could not save product." }, { status: 500 });
  }
}
