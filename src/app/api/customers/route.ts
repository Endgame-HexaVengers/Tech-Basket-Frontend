import { NextRequest, NextResponse } from "next/server";
import { catalogDatabase } from "@/lib/mongodb";
import { Customer } from "@/types/sale";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const getCustomersCollection = () => catalogDatabase.collection<Customer>("customers");

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");
    const search = searchParams.get("search");

    const col = getCustomersCollection();
    const query: any = {};

    if (phone) {
      // Find by exact or partial phone
      const cleanPhone = phone.trim();
      const customer = await col.findOne({ phone: cleanPhone });
      if (customer) {
        return NextResponse.json({
          success: true,
          customer: {
            ...customer,
            _id: customer._id?.toString(),
          },
        });
      }
      // If exact not found, try regex
      const partialCustomer = await col.findOne({ phone: { $regex: cleanPhone, $options: "i" } });
      if (partialCustomer) {
        return NextResponse.json({
          success: true,
          customer: {
            ...partialCustomer,
            _id: partialCustomer._id?.toString(),
          },
        });
      }
      return NextResponse.json({ success: false, message: "Customer not found" });
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { customerId: { $regex: search, $options: "i" } },
      ];
    }

    const customers = await col.find(query).sort({ createdAt: -1 }).limit(50).toArray();

    return NextResponse.json({
      success: true,
      customers: customers.map((c: any) => ({
        ...c,
        _id: c._id?.toString(),
      })),
    });
  } catch (error) {
    console.error("Customers GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch customers", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, phone, type = "Individual", address = "", email = "" } = data;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: "Customer name and phone number are required" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim();
    const col = getCustomersCollection();

    // Check if phone already exists
    const existing = await col.findOne({ phone: cleanPhone });
    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Customer already exists",
        customer: {
          ...existing,
          _id: existing._id?.toString(),
        },
      });
    }

    const year = new Date().getFullYear();
    const count = await col.countDocuments();
    const customerId = `CUST-${year}-${(count + 1).toString().padStart(4, "0")}`;

    const newCustomer: Customer = {
      customerId,
      name: name.trim(),
      phone: cleanPhone,
      email: email.trim(),
      type,
      address: address.trim(),
      totalSalesCount: 0,
      totalSpent: 0,
      dueBalance: 0,
      creditBalance: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await col.insertOne(newCustomer);

    return NextResponse.json(
      {
        success: true,
        message: "Customer created successfully",
        customer: {
          ...newCustomer,
          _id: result.insertedId.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Customers POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create customer", details: String(error) },
      { status: 500 }
    );
  }
}
