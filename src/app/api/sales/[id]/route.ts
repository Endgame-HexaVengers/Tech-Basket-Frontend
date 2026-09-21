import { NextRequest, NextResponse } from "next/server";
import { catalogDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const col = catalogDatabase.collection("sales");

    let query: any = { $or: [{ id }, { invoiceNo: id }] };
    if (ObjectId.isValid(id)) {
      query.$or.push({ _id: new ObjectId(id) });
    }

    const sale = await col.findOne(query);
    if (!sale) {
      return NextResponse.json({ success: false, error: "Sale not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      sale: {
        ...sale,
        _id: sale._id?.toString(),
      },
    });
  } catch (error) {
    console.error("Sale by ID GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch sale details", details: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const col = catalogDatabase.collection("sales");

    let query: any = { $or: [{ id }, { invoiceNo: id }] };
    if (ObjectId.isValid(id)) {
      query.$or.push({ _id: new ObjectId(id) });
    }

    const updateFields = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const result = await col.updateOne(query, { $set: updateFields });
    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "Sale not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Sale updated successfully",
    });
  } catch (error) {
    console.error("Sale PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update sale", details: String(error) },
      { status: 500 }
    );
  }
}
