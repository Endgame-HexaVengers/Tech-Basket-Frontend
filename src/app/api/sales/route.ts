import { NextRequest, NextResponse } from "next/server";
import { catalogDatabase } from "@/lib/mongodb";
import { Sale } from "@/types/sale";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const getSalesCollection = () => catalogDatabase.collection<Sale>("sales");
const getCustomersCollection = () => catalogDatabase.collection("customers");
const getSalesReturnsCollection = () => catalogDatabase.collection("sales_returns");
const getInventoryCollection = () => catalogDatabase.collection("inventory_items");

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const invoiceStatus = searchParams.get("invoiceStatus");
    const branchId = searchParams.get("branchId");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const query: any = {};
    if (search) {
      query.$or = [
        { id: { $regex: search, $options: "i" } },
        { invoiceNo: { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
        { "customer.phone": { $regex: search, $options: "i" } },
        { "salesPerson.name": { $regex: search, $options: "i" } },
      ];
    }
    if (status && status !== "all") {
      query.status = status;
    }
    if (invoiceStatus && invoiceStatus !== "all") {
      query.invoiceStatus = invoiceStatus;
    }
    if (branchId) {
      query["branch.branchId"] = branchId;
    }
    if (dateFrom || dateTo) {
      query.saleDate = {};
      if (dateFrom) query.saleDate.$gte = dateFrom;
      if (dateTo) query.saleDate.$lte = dateTo;
    }

    const col = getSalesCollection();
    const rawSales = await col.find(query).sort({ createdAt: -1 }).toArray();

    // Fetch returns to calculate net values and return statuses
    const returnsCol = getSalesReturnsCollection();
    let allReturns: any[] = [];
    try {
      allReturns = await returnsCol.find({}).toArray();
    } catch {
      allReturns = [];
    }

    const returnsBySale: Record<string, any[]> = {};
    for (const ret of allReturns) {
      const key = ret.saleId || ret.invoiceNo;
      if (key) {
        if (!returnsBySale[key]) returnsBySale[key] = [];
        returnsBySale[key].push(ret);
      }
    }

    const sales = rawSales.map((doc: any) => {
      const docId = doc.id;
      const matchedReturns = (docId && returnsBySale[docId]) || (doc.invoiceNo && returnsBySale[doc.invoiceNo]) || [];

      if (matchedReturns.length > 0) {
        const totalRefund = matchedReturns.reduce(
          (sum: number, r: any) => sum + (Number(r.totalRefundAmount) || 0),
<<<<<<< Updated upstream
          0,
=======
          0
>>>>>>> Stashed changes
        );
        const origGrand = Number(doc.originalGrandTotal ?? doc.grandTotal) || 0;
        const origSub = Number(doc.originalSubTotal ?? doc.subTotal) || 0;
        const netGrand = Math.max(0, origGrand - totalRefund);
        const netSub = Math.max(0, origSub - totalRefund);

        const returnedQtyMap: Record<string, number> = {};
        matchedReturns.forEach((r: any) => {
          (r.items || []).forEach((it: any) => {
            const pId = it.productId;
            const q = Number(it.quantity || 1);
            returnedQtyMap[pId] = (returnedQtyMap[pId] || 0) + q;
          });
        });

        const updatedItems = (doc.items || []).map((sItem: any) => {
          const retQty = returnedQtyMap[sItem.productId] || 0;
          const availQty = Math.max(0, (Number(sItem.quantity) || 1) - retQty);
          return {
            ...sItem,
            returnedQuantity: retQty,
            availableQuantity: availQty,
          };
        });

        const allReturned =
          updatedItems.length > 0 && updatedItems.every((i: any) => (i.availableQuantity || 0) <= 0);

        return {
          ...doc,
          _id: doc._id?.toString(),
          originalGrandTotal: origGrand,
          originalSubTotal: origSub,
          grandTotal: netGrand,
          subTotal: netSub,
          totalRefundAmount: totalRefund,
          items: updatedItems,
          status: allReturned || netGrand === 0 ? "Returned" : doc.status === "Returned" ? "Returned" : (totalRefund > 0 ? "Partially Returned" : doc.status),
        };
      }

      return {
        ...doc,
        _id: doc._id?.toString(),
      };
    });

    // Summary stats
    const totalSalesCount = sales.length;
    const totalRevenue = sales.reduce((sum, s) => sum + (Number(s.grandTotal) || 0), 0);
    const totalPaid = sales.reduce((sum, s) => sum + (Number(s.paidAmount) || 0), 0);
    const totalDue = sales.reduce((sum, s) => sum + (Number(s.dueAmount) || 0), 0);
    const invoicedCount = sales.filter((s) => s.invoiceStatus === "Invoiced").length;
    const pendingInvoiceCount = sales.filter((s) => s.invoiceStatus !== "Invoiced").length;

    return NextResponse.json({
      success: true,
      sales,
      totalCount: sales.length,
      stats: {
        totalSalesCount,
        totalRevenue,
        totalPaid,
        totalDue,
        invoicedCount,
        pendingInvoiceCount,
      },
    });
  } catch (error) {
    console.error("Sales GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch sales", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      salesPerson = { name: "Sales Executive", employeeId: "EMP-001" },
      branch = { branchId: "MAIN_BRANCH", branchName: "Dhaka Branch" },
      customer,
      saleDate = new Date().toISOString().split("T")[0],
      items,
      paymentMethod = "Cash",
      paidAmount = 0,
      remarks = "",
      tax = 0,
    } = data;

    if (!customer || !customer.phone || !customer.name) {
      return NextResponse.json(
        { success: false, error: "Customer information (name and phone) is required" },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one product item is required" },
        { status: 400 }
      );
    }

    const col = getSalesCollection();
    const customersCol = getCustomersCollection();
    const inventoryCol = getInventoryCollection();

    // Generate unique guaranteed ID e.g. SALE-YYYY-0001
    const year = new Date().getFullYear();
    const count = await col.countDocuments();
    let seq = count + 1;
    let saleId = `SALE-${year}-${seq.toString().padStart(4, "0")}`;
    let invoiceNo = `INV-${year}-${seq.toString().padStart(4, "0")}`;

    let exists = await col.findOne({ id: saleId });
    while (exists) {
      seq++;
      saleId = `SALE-${year}-${seq.toString().padStart(4, "0")}`;
      invoiceNo = `INV-${year}-${seq.toString().padStart(4, "0")}`;
      exists = await col.findOne({ id: saleId });
    }

    // Calculate line totals and financial summary
    let subTotal = 0;
    let totalDiscount = 0;

    const formattedItems = items.map((it: any) => {
      const q = Math.max(1, Number(it.quantity) || 1);
      const price = Number(it.unitPrice || it.price) || 0;
      const disc = Number(it.discount) || 0;
      const itemSubtotal = q * price - disc;

      subTotal += q * price;
      totalDiscount += disc;

      return {
        productId: it.productId,
        productName: it.productName || it.title || "Product",
        sku: it.sku || it.productId,
        quantity: q,
        unitPrice: price,
        discount: disc,
        subtotal: itemSubtotal,
        returnedQuantity: 0,
        availableQuantity: q,
        serialNumbers: it.serialNumbers || [],
      };
    });

    const taxAmount = Number(tax) || 0;
    const grandTotal = Math.max(0, subTotal - totalDiscount + taxAmount);
    const paid = Number(paidAmount) || 0;
    const dueAmount = Math.max(0, grandTotal - paid);

    const paymentStatus: "Paid" | "Partial" | "Due" =
      dueAmount <= 0 ? "Paid" : paid > 0 ? "Partial" : "Due";

    const newSale: Sale = {
      id: saleId,
      invoiceNo,
      salesPerson: {
        name: salesPerson.name || "Sales Executive",
        employeeId: salesPerson.employeeId || "EMP-001",
        userId: salesPerson.userId,
      },
      branch: {
        branchId: branch.branchId || "MAIN_BRANCH",
        branchName: branch.branchName || "Dhaka Branch",
      },
      customer: {
        customerId: customer.customerId || `CUST-${year}-${Date.now().toString().slice(-4)}`,
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        type: customer.type || "Individual",
        address: customer.address || "",
      },
      saleDate,
      items: formattedItems,
      subTotal,
      originalSubTotal: subTotal,
      totalDiscount,
      tax: taxAmount,
      grandTotal,
      originalGrandTotal: grandTotal,
      totalRefundAmount: 0,
      paidAmount: paid,
      dueAmount,
      paymentMethod,
      paymentStatus,
      invoiceStatus: "Invoiced",
      status: "Completed",
      remarks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await col.insertOne(newSale);

    // Update or insert customer ledger
    try {
      await customersCol.updateOne(
        { phone: customer.phone.trim() },
        {
          $inc: {
            totalSalesCount: 1,
            totalSpent: grandTotal,
            dueBalance: dueAmount,
          },
          $set: {
            name: customer.name.trim(),
            type: customer.type || "Individual",
            address: customer.address || "",
            updatedAt: new Date().toISOString(),
          },
        },
        { upsert: true }
      );
    } catch (custErr) {
      console.warn("Failed to update customer stats:", custErr);
    }

    // Update inventory item statuses if serials were sold
    try {
      const allSerials = formattedItems.flatMap((i: any) => i.serialNumbers || []).filter(Boolean);
      if (allSerials.length > 0) {
        await inventoryCol.updateMany(
          { serialNumber: { $in: allSerials } },
          { $set: { status: "Sold", updatedAt: new Date().toISOString() } }
        );
      }
    } catch (invErr) {
      console.warn("Failed to mark inventory as Sold:", invErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Sale created successfully",
        sale: {
          ...newSale,
          _id: result.insertedId.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Sales POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create sale", details: String(error) },
      { status: 500 }
    );
  }
}
