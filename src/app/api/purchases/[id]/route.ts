import { NextRequest, NextResponse } from "next/server";
import { catalogDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { Purchase } from "@/types/purchase";

export const runtime = "nodejs";

const getPurchasesCollection = () => catalogDatabase.collection<Purchase>("purchases");

function getQueryFilter(id: string) {
  if (ObjectId.isValid(id) && id.length === 24) {
    return {
      $or: [{ _id: new ObjectId(id) }, { id: id }],
    };
  }
  return { id: id };
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const col = getPurchasesCollection();
    
    const purchase = await col.findOne(getQueryFilter(id) as any);

    if (!purchase) {
      return NextResponse.json(
        { success: false, error: "Purchase not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      purchase: {
        ...purchase,
        _id: (purchase as any)._id?.toString(),
      },
    });
  } catch (error) {
    console.error("Purchase GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch purchase", details: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const updates = (await request.json()) as Partial<Purchase>;
    const col = getPurchasesCollection();

    delete (updates as any)._id;
    updates.updatedAt = new Date().toISOString();

    const result = await col.findOneAndUpdate(
      getQueryFilter(id) as any,
      { $set: updates },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Purchase not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      purchase: {
        ...result,
        _id: (result as any)._id?.toString(),
      },
      message: "Purchase updated successfully",
    });
  } catch (error) {
    console.error("Purchase PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update purchase", details: String(error) },
      { status: 500 }
    );
  }
}
