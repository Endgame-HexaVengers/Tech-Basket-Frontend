import { NextRequest, NextResponse } from "next/server";
import { catalogDatabase } from "@/lib/mongodb";
import { INITIAL_SUPPLIERS, Supplier } from "@/types/supplier";

export const runtime = "nodejs";

const getSuppliersCollection = () => catalogDatabase.collection<Supplier>("suppliers");

export async function GET(request: NextRequest) {
  try {
    const col = getSuppliersCollection();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const type = searchParams.get("type")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";

    let suppliersCount = await col.countDocuments();

    // Auto-seed initial suppliers if collection is currently empty
    if (suppliersCount === 0) {
      const seeded = INITIAL_SUPPLIERS.map((s) => ({
        ...s,
        createdAt: s.createdAt || new Date().toISOString().split("T")[0],
      }));
      await col.insertMany(seeded as any);
      suppliersCount = seeded.length;
    }

    // Build filter
    const query: Record<string, unknown> = {};
    if (type && type !== "all") {
      query.type = type;
    }
    if (status && status !== "all") {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } },
        { supplierCode: { $regex: search, $options: "i" } },
        { contactPerson: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { brands: { $regex: search, $options: "i" } },
      ];
    }

    const rawSuppliers = await col.find(query).sort({ createdAt: -1 }).toArray();

    const suppliers: Supplier[] = rawSuppliers.map((doc: any) => ({
      ...doc,
      _id: doc._id?.toString(),
      id: doc.id || doc._id?.toString(),
      brands: Array.isArray(doc.brands) ? doc.brands : [],
      purchases: Array.isArray(doc.purchases) ? doc.purchases : [],
      ledger: Array.isArray(doc.ledger) ? doc.ledger : [],
      rmaItems: Array.isArray(doc.rmaItems) ? doc.rmaItems : [],
      pendingRmaCount: Number(doc.pendingRmaCount) || 0,
      totalPurchased: Number(doc.totalPurchased) || 0,
      totalOrders: Number(doc.totalOrders) || 0,
      currentBalance: Number(doc.currentBalance) || 0,
      creditLimit: Number(doc.creditLimit) || 0,
    }));

    // Compute live financial & operational statistics from database records
    const allSuppliers = search || type || status
      ? await col.find({}).toArray()
      : rawSuppliers;

    const totalSuppliers = allSuppliers.length;
    const activeSuppliers = allSuppliers.filter((s: any) => s.status === "Active").length;
    const inactiveSuppliers = totalSuppliers - activeSuppliers;
    const totalPurchases = allSuppliers.reduce((sum: number, s: any) => sum + (Number(s.totalPurchased) || 0), 0);
    const totalDues = allSuppliers.reduce((sum: number, s: any) => sum + (Number(s.currentBalance) || 0), 0);
    const totalPendingRma = allSuppliers.reduce((sum: number, s: any) => sum + (Number(s.pendingRmaCount) || 0), 0);

    const stats = {
      totalSuppliers,
      activeSuppliers,
      inactiveSuppliers,
      totalPurchases,
      totalDues,
      totalPendingRma,
    };

    return NextResponse.json({
      success: true,
      suppliers,
      stats,
    });
  } catch (error) {
    console.error("Suppliers GET failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch suppliers from backend database",
        details: String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<Supplier>;
    const col = getSuppliersCollection();

    if (!body.name && !body.companyName) {
      return NextResponse.json(
        { success: false, error: "Supplier name or company name is required." },
        { status: 400 }
      );
    }

    const count = await col.countDocuments();
    const nextCodeNumber = String(count + 101).padStart(3, "0");
    const supplierCode = body.supplierCode?.trim() || `SUP-00${nextCodeNumber}`;
    const id = `sup-${Date.now()}`;
    const today = new Date().toISOString().split("T")[0];

    const openingBalance = Number(body.currentBalance) || 0;
    const initialLedger =
      openingBalance > 0
        ? [
            {
              id: `led-${Date.now()}`,
              date: today,
              referenceNo: "OB-NEW",
              type: "Opening Balance" as const,
              debit: 0,
              credit: openingBalance,
              balance: openingBalance,
            },
          ]
        : [];

    const newSupplier: Supplier = {
      id,
      supplierCode,
      name: body.name || body.companyName || "Unnamed Supplier",
      companyName: body.companyName || body.name || "Unnamed Supplier",
      type: body.type || "Distributor",
      tradeLicense: body.tradeLicense || "",
      binNumber: body.binNumber || "",
      contactPerson: body.contactPerson || "",
      designation: body.designation || "Executive",
      phone: body.phone || "",
      alternatePhone: body.alternatePhone || "",
      email: body.email || "",
      address: body.address || "",
      city: body.city || "Dhaka",
      paymentTerms: body.paymentTerms || "Net 30",
      creditLimit: Number(body.creditLimit) || 500000,
      currentBalance: openingBalance,
      totalPurchased: Number(body.totalPurchased) || 0,
      totalOrders: Number(body.totalOrders) || 0,
      bankName: body.bankName || "",
      accountNumber: body.accountNumber || "",
      routingNumber: body.routingNumber || "",
      branchName: body.branchName || "",
      bkashNumber: body.bkashNumber || "",
      brands: Array.isArray(body.brands) ? body.brands : [],
      status: body.status || "Active",
      rating: Number(body.rating) || 5.0,
      pendingRmaCount: Number(body.pendingRmaCount) || 0,
      createdAt: body.createdAt || today,
      purchases: body.purchases || [],
      ledger: body.ledger && body.ledger.length > 0 ? body.ledger : initialLedger,
      rmaItems: body.rmaItems || [],
    };

    const insertResult = await col.insertOne(newSupplier as any);

    return NextResponse.json(
      {
        success: true,
        supplier: {
          ...newSupplier,
          _id: insertResult.insertedId.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Suppliers POST failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create supplier in database",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
