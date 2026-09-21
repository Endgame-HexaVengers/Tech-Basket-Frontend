import { NextRequest, NextResponse } from "next/server";
import { catalogDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { Branch } from "@/types/branch";

export const runtime = "nodejs";

const getBranchesCollection = () => catalogDatabase.collection<Branch>("branches");

function toStr(val: any, fallback = ""): string {
  if (!val) return fallback;
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    return [val.street || val.address || "", val.city || val.state || "", val.zip || val.postCode || ""]
      .filter(Boolean)
      .join(", ") || JSON.stringify(val);
  }
  return String(val);
}

function normalizeBranch(doc: any) {
  return {
    ...doc,
    _id: doc._id?.toString(),
    id: doc.id || doc._id?.toString(),
    name: toStr(doc.name, "Unnamed Branch"),
    code: toStr(doc.code, ""),
    location: toStr(doc.location, ""),
    address: toStr(doc.address, ""),
    type: toStr(doc.type, "Retail Store"),
    manager: toStr(doc.manager, "Not Assigned"),
    phone: toStr(doc.phone, ""),
    email: toStr(doc.email, ""),
    openingHours: toStr(doc.openingHours, ""),
    assignedUsers: Array.isArray(doc.assignedUsers) ? doc.assignedUsers : [],
  };
}


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
    const col = getBranchesCollection();

    const branch = await col.findOne(getQueryFilter(id) as any);

    if (!branch) {
      return NextResponse.json(
        { success: false, error: "Branch not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      branch: normalizeBranch(branch),
    });
  } catch (error) {
    console.error("Branch GET by ID failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch branch details", details: String(error) },
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
    const updates = (await request.json()) as Partial<Branch>;
    const col = getBranchesCollection();

    // Prevent updating internal _id
    delete (updates as any)._id;
    updates.updatedAt = new Date().toISOString();

    const filter = getQueryFilter(id);

    const result = await col.findOneAndUpdate(
      filter as any,
      { $set: updates },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Branch not found to update" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      branch: normalizeBranch(result),
      message: "Branch updated successfully",
    });
  } catch (error) {
    console.error("Branch PATCH failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update branch", details: String(error) },
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
    const col = getBranchesCollection();

    const filter = getQueryFilter(id);
    const result = await col.deleteOne(filter as any);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Branch not found to delete" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Branch successfully deleted",
    });
  } catch (error) {
    console.error("Branch DELETE failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete branch", details: String(error) },
      { status: 500 }
    );
  }
}
