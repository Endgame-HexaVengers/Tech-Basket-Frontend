import { NextRequest, NextResponse } from "next/server";
import { catalogDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { Supplier } from "@/types/supplier";

export const runtime = "nodejs";

const getSuppliersCollection = () => catalogDatabase.collection<Supplier>("suppliers");

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
    const col = getSuppliersCollection();

    const supplier = await col.findOne(getQueryFilter(id) as any);

    if (!supplier) {
      return NextResponse.json(
        { success: false, error: "Supplier not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      supplier: {
        ...supplier,
        _id: (supplier as any)._id?.toString(),
        brands: Array.isArray((supplier as any).brands) ? (supplier as any).brands : [],
        purchases: Array.isArray((supplier as any).purchases) ? (supplier as any).purchases : [],
        ledger: Array.isArray((supplier as any).ledger) ? (supplier as any).ledger : [],
        rmaItems: Array.isArray((supplier as any).rmaItems) ? (supplier as any).rmaItems : [],
      },
    });
  } catch (error) {
    console.error("Supplier GET by ID failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch supplier details", details: String(error) },
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
    const updates = (await request.json()) as Partial<Supplier>;
    const col = getSuppliersCollection();

    // Prevent overwriting internal _id
    delete (updates as any)._id;

    const filter = getQueryFilter(id);

    const result = await col.findOneAndUpdate(
      filter as any,
      { $set: updates },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Supplier not found to update" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      supplier: {
        ...result,
        _id: (result as any)._id?.toString(),
        brands: Array.isArray((result as any).brands) ? (result as any).brands : [],
        purchases: Array.isArray((result as any).purchases) ? (result as any).purchases : [],
        ledger: Array.isArray((result as any).ledger) ? (result as any).ledger : [],
        rmaItems: Array.isArray((result as any).rmaItems) ? (result as any).rmaItems : [],
      },
    });
  } catch (error) {
    console.error("Supplier PATCH failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update supplier", details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const col = getSuppliersCollection();

    const filter = getQueryFilter(id);
    const result = await col.deleteOne(filter as any);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Supplier not found to delete" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Supplier successfully removed from database",
    });
  } catch (error) {
    console.error("Supplier DELETE failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete supplier", details: String(error) },
      { status: 500 }
    );
  }
}
