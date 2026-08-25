import { NextRequest, NextResponse } from "next/server";
import { catalogDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";

type CatalogType = "brand" | "category";

const defaults: Record<CatalogType, string[]> = {
  brand: ["Logitech", "Dell"],
  category: ["Mouse", "Keyboard", "Monitor"],
};

const collection = () => catalogDatabase.collection("catalog_items");

async function prepareCatalog() {
  await collection().createIndex(
    { type: 1, normalizedName: 1 },
    { unique: true },
  );

  for (const [type, names] of Object.entries(defaults) as [CatalogType, string[]][]) {
    await collection().bulkWrite(
      names.map((name) => ({
        updateOne: {
          filter: { type, normalizedName: name.toLowerCase() },
          update: { $setOnInsert: { type, name, normalizedName: name.toLowerCase(), createdAt: new Date() } },
          upsert: true,
        },
      })),
    );
  }
}

export async function GET() {
  try {
    await prepareCatalog();
    const items = await collection().find({}, { projection: { _id: 0, type: 1, name: 1 } }).sort({ name: 1 }).toArray();
    return NextResponse.json({
      brands: items.filter((item) => item.type === "brand").map((item) => item.name),
      categories: items.filter((item) => item.type === "category").map((item) => item.name),
    });
  } catch (error) {
    console.error("Catalog GET failed", error);
    return NextResponse.json({ error: "Could not load catalog data." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { type?: CatalogType; name?: string };
    const type = body.type;
    const name = body.name?.trim() || "";

    if (type !== "brand" && type !== "category") {
      return NextResponse.json({ error: "Catalog type must be brand or category." }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ error: `${type} name is required.` }, { status: 400 });
    }

    await prepareCatalog();
    const normalizedName = name.toLowerCase();
    const result = await collection().insertOne({ type, name, normalizedName, createdAt: new Date() });
    return NextResponse.json({ id: result.insertedId.toString(), type, name }, { status: 201 });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
      return NextResponse.json({ error: "This name already exists." }, { status: 409 });
    }
    console.error("Catalog POST failed", error);
    return NextResponse.json({ error: "Could not save catalog data." }, { status: 500 });
  }
}
