import { NextRequest, NextResponse } from "next/server";
import { catalogDatabase } from "@/lib/mongodb";
import { buildProductDocument } from "@/lib/productDoc";

export const runtime = "nodejs";

const BACKEND_PRODUCTS_URL = "http://localhost:5000/api/v1/products";

async function getProductsCollection() {
  const collections = await catalogDatabase.listCollections().toArray();
  const names = collections.map((c) => c.name);

  // 1. Prefer exact collection names
  if (names.includes("TechBasket_all data")) {
    return catalogDatabase.collection("TechBasket_all data");
  }
  if (names.includes("TechBasket_all_data")) {
    return catalogDatabase.collection("TechBasket_all_data");
  }

  // 2. Fuzzy match for any collection containing techbasket and data
  const matchingName = names.find(
    (name) =>
      /techbasket.*data/i.test(name) ||
      /all.*data/i.test(name) ||
      name.toLowerCase().includes("all data")
  );
  if (matchingName) {
    return catalogDatabase.collection(matchingName);
  }

  // 3. Fallback to products or default
  if (names.includes("products")) {
    return catalogDatabase.collection("products");
  }

  return catalogDatabase.collection("TechBasket_all data");
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.max(1, Number(searchParams.get("limit")) || 10);
  const search = searchParams.get("search") || "";

  try {
    const backendUrl = new URL(BACKEND_PRODUCTS_URL);
    backendUrl.searchParams.set("page", String(page));
    backendUrl.searchParams.set("limit", String(limit));
    if (search) {
      backendUrl.searchParams.set("search", search);
    }

    const backendRes = await fetch(backendUrl.toString(), {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(4000),
    });

    if (backendRes.ok) {
      const json = await backendRes.json();
      const backendList = Array.isArray(json?.data)
        ? json.data
        : Array.isArray(json)
          ? json
          : [];

      const formattedList = backendList.map((product: Record<string, unknown>) => ({
        ...product,
        _id: product._id ? String(product._id) : (product.id as string) || String(Math.random()),
      }));

      return NextResponse.json({
        success: true,
        data: formattedList,
        pagination: json.pagination || {
          page,
          limit,
          total: formattedList.length,
          totalPages: Math.ceil(formattedList.length / limit) || 1,
        },
      });
    }
  } catch (error) {
    console.warn("Backend server not reachable, attempting direct MongoDB fallback:", error);
  }

  // Fallback: If backend is down, query MongoDB directly with pagination
  try {
    const collection = await getProductsCollection();
    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { productTitle: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      collection.find(filter).skip(skip).limit(limit).toArray(),
      collection.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: items.map((p) => ({ ...p, _id: p._id.toString() })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (fallbackError) {
    console.error("Backend & MongoDB fallback both failed:", fallbackError);
    return NextResponse.json(
      {
        error: "Backend server (http://localhost:5000) is unreachable. Please ensure the backend server is running.",
        details: String(fallbackError),
      },
      { status: 503 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      title?: string;
      productTitle?: string;
      sku?: string;
      brand?: string;
      brandId?: string;
      category?: string;
      categoryId?: string;
      color?: string;
      warrantyPeriod?: number;
      warrantyUnit?: string;
      description?: string;
      status?: "active" | "inactive" | string;
    };

    const title = (body.title || body.productTitle || "").trim();
    const sku = (body.sku || "").trim().toUpperCase();
    const brand = (body.brand || body.brandId || "").trim();
    const category = (body.category || body.categoryId || "").trim();

    if (!title || !sku || !brand || !category) {
      return NextResponse.json(
        { error: "Title, SKU, brand and category are required." },
        { status: 400 }
      );
    }

    // Insert directly into the MongoDB collection (TechBasket_all data)
    const collection = await getProductsCollection();
    const productDocument = buildProductDocument({
      ...body,
      title,
      sku,
      brand,
      category,
    });

    const result = await collection.insertOne(productDocument);

    return NextResponse.json(
      {
        ...productDocument,
        _id: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Product POST failed", error);
    return NextResponse.json({ error: "Could not save product to database." }, { status: 500 });
  }
}
