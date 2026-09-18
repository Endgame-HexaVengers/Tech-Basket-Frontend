import { NextRequest, NextResponse } from "next/server";
import { catalogDatabase } from "@/lib/mongodb";
import { Branch, INITIAL_BRANCHES } from "@/types/branch";

export const runtime = "nodejs";

const getBranchesCollection = () => catalogDatabase.collection<Branch>("branches");

/** Normalise a field that may be a string or a legacy address-object. */
function toStr(val: any, fallback = ""): string {
  if (!val) return fallback;
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    // e.g. { street, city, state, zip }  or  { city }  etc.
    return [
      val.street || val.address || "",
      val.city || val.state || "",
      val.zip || val.postCode || "",
    ]
      .filter(Boolean)
      .join(", ") || JSON.stringify(val);
  }
  return String(val);
}

export async function GET(request: NextRequest) {
  try {
    const col = getBranchesCollection();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const type = searchParams.get("type")?.trim() || "";
    const location = searchParams.get("location")?.trim() || "";

    let branchesCount = await col.countDocuments();

    // Auto-seed initial branches if collection is empty
    if (branchesCount === 0) {
      await col.insertMany(INITIAL_BRANCHES as any);
      branchesCount = INITIAL_BRANCHES.length;
    }

    // Build filter query
    const query: Record<string, unknown> = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (type && type !== "all") {
      query.type = type;
    }

    if (location && location !== "all") {
      query.location = { $regex: location, $options: "i" };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { manager: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ];
    }

    const rawBranches = await col.find(query).sort({ createdAt: -1 }).toArray();

    const branches: Branch[] = rawBranches.map((doc: any) => ({
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
      users: typeof doc.users === "number" ? doc.users : (Array.isArray(doc.assignedUsers) ? doc.assignedUsers.length : 0),
      assignedUsers: Array.isArray(doc.assignedUsers) ? doc.assignedUsers : [],
    }));

    // Calculate real-time overall stats across all branches
    const allBranches = search || status || type || location
      ? await col.find({}).toArray()
      : rawBranches;

    const totalBranches = allBranches.length;
    const activeBranches = allBranches.filter((b: any) => b.status === "ACTIVE").length;
    const inactiveBranches = totalBranches - activeBranches;
    const assignedUsers = allBranches.reduce(
      (sum: number, b: any) =>
        sum + (typeof b.users === "number" ? b.users : (Array.isArray(b.assignedUsers) ? b.assignedUsers.length : 0)),
      0
    );

    const stats = {
      totalBranches,
      activeBranches,
      inactiveBranches,
      assignedUsers,
    };

    return NextResponse.json({
      success: true,
      branches,
      stats,
    });
  } catch (error) {
    console.error("Branches GET failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch branches from database",
        details: String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<Branch>;
    const col = getBranchesCollection();

    if (!body.name?.trim()) {
      return NextResponse.json(
        { success: false, error: "Branch name is required." },
        { status: 400 }
      );
    }

    const count = await col.countDocuments();
    const nextCodeNumber = String(count + 1).padStart(2, "0");
    const locPrefix = (body.location || "DHK").slice(0, 3).toUpperCase();
    const code = body.code?.trim() || `BR-${locPrefix}-${nextCodeNumber}`;
    const id = `br-${Date.now()}`;
    const today = new Date().toISOString().split("T")[0];

    const newBranch: Branch = {
      id,
      name: body.name.trim(),
      code,
      location: body.location?.trim() || "Dhaka",
      address: body.address?.trim() || "",
      type: body.type || "Retail Store",
      manager: body.manager?.trim() || "Not Assigned",
      managerPhone: body.managerPhone?.trim() || "",
      managerEmail: body.managerEmail?.trim() || "",
      phone: body.phone?.trim() || "",
      email: body.email?.trim() || "",
      users: Number(body.users) || (Array.isArray(body.assignedUsers) ? body.assignedUsers.length : 0),
      assignedUsers: Array.isArray(body.assignedUsers) ? body.assignedUsers : [],
      status: body.status || "ACTIVE",
      isMainBranch: Boolean(body.isMainBranch),
      openingHours: body.openingHours?.trim() || "10:00 AM - 08:00 PM",
      createdAt: body.createdAt || today,
    };

    await col.insertOne(newBranch as any);

    return NextResponse.json({
      success: true,
      branch: newBranch,
      message: "Branch successfully created",
    });
  } catch (error) {
    console.error("Branches POST failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create new branch",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
