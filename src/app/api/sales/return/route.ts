import { NextRequest, NextResponse } from "next/server";
import { catalogDatabase } from "@/lib/mongodb";
import { SalesReturn } from "@/types/sale";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const getSalesReturnsCollection = () => catalogDatabase.collection<SalesReturn>("sales_returns");
const getSalesCollection = () => catalogDatabase.collection("sales");
const getCustomersCollection = () => catalogDatabase.collection("customers");
const getInventoryCollection = () => catalogDatabase.collection("inventory_items");

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const saleId = searchParams.get("saleId");

    const query: any = {};
    if (search) {
      query.$or = [
        { returnId: { $regex: search, $options: "i" } },
        { saleId: { $regex: search, $options: "i" } },
        { invoiceNo: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
        { customerPhone: { $regex: search, $options: "i" } },
      ];
    }
    if (status && status !== "all") {
      query.status = status;
    }
    if (saleId) {
      query.$or = [{ saleId }, { invoiceNo: saleId }];
    }

    const returnsCol = getSalesReturnsCollection();
    const rawReturns = await returnsCol.find(query).sort({ createdAt: -1 }).toArray();

    const returns = rawReturns.map((doc: any) => ({
      ...doc,
      _id: doc._id?.toString(),
    }));

    const allReturns = await returnsCol.find({}).toArray();
    const totalReturns = allReturns.length;
    const totalRefundAmount = allReturns.reduce((sum, r) => sum + (Number(r.totalRefundAmount) || 0), 0);
    const completedCount = allReturns.filter((r) => r.status === "Completed").length;
    const pendingCount = allReturns.filter((r) => r.status === "Pending").length;
    const uniqueCustomers = new Set(allReturns.map((r) => r.customerPhone).filter(Boolean)).size;

    return NextResponse.json({
      success: true,
      returns,
      stats: {
        totalReturns,
        totalRefundAmount,
        completedCount,
        pendingCount,
        uniqueCustomers,
      },
    });
  } catch (error) {
    console.error("Sales Return GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch sales returns", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      saleId,
      invoiceNo,
      customerId,
      customerName,
      customerPhone,
      branchName = "Dhaka Branch",
      items,
      settlementType = "cash_refund",
      returnReason = "Customer Return",
      notes = "",
    } = data;

    if (!saleId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (saleId, items)" },
        { status: 400 }
      );
    }

    const returnsCol = getSalesReturnsCollection();
    const salesCol = getSalesCollection();
    const customersCol = getCustomersCollection();
    const inventoryCol = getInventoryCollection();

    const year = new Date().getFullYear();
    const count = await returnsCol.countDocuments();
    const returnId = `SRET-${year}-${(count + 1).toString().padStart(4, "0")}`;

    let totalRefundAmount = 0;
    let totalReturnedQty = 0;

    const formattedItems = items.map((item: any) => {
      const q = Number(item.quantity || 1);
      const price = Number(item.unitPrice || item.price || 0);
      const refund = Number(item.refundAmount) || q * price;

      totalRefundAmount += refund;
      totalReturnedQty += q;

      return {
        productId: item.productId,
        productName: item.productName || item.title || "Product",
        quantity: q,
        unitPrice: price,
        refundAmount: refund,
        returnReason: item.returnReason || returnReason,
        serialNumbers: item.serialNumbers || [],
      };
    });

    const newReturn: SalesReturn = {
      returnId,
      saleId,
      invoiceNo: invoiceNo || saleId,
      customerId: customerId || "",
      customerName: customerName || "",
      customerPhone: customerPhone || "",
      branchName,
      returnDate: new Date().toISOString(),
      items: formattedItems,
      totalRefundAmount,
      totalReturnedQty,
      settlementType,
      returnReason,
      notes,
      status: "Completed",
      createdAt: new Date().toISOString(),
    };

    const result = await returnsCol.insertOne(newReturn);

    // Update original sale document
    try {
      const originalSale = await salesCol.findOne({
        $or: [{ id: saleId }, { invoiceNo: saleId }],
      });

      if (originalSale) {
        const origGrand = Number(originalSale.originalGrandTotal ?? originalSale.grandTotal) || 0;
        const origSub = Number(originalSale.originalSubTotal ?? originalSale.subTotal) || 0;
        const previousRefund = Number(originalSale.totalRefundAmount) || 0;
        const newTotalRefund = previousRefund + totalRefundAmount;
        const newGrandTotal = Math.max(0, origGrand - newTotalRefund);
        const newSubTotal = Math.max(0, origSub - newTotalRefund);

        const updatedItems = (originalSale.items || []).map((sItem: any) => {
          const retMatch = formattedItems.find((it: any) => it.productId === sItem.productId);
          const newlyReturned = retMatch ? Number(retMatch.quantity) : 0;
          const currentRetQty = (Number(sItem.returnedQuantity) || 0) + newlyReturned;
          const availQty = Math.max(0, (Number(sItem.quantity) || 1) - currentRetQty);
          return {
            ...sItem,
            returnedQuantity: currentRetQty,
            availableQuantity: availQty,
          };
        });

        const currentDue = Number(originalSale.dueAmount) || 0;
        let newDue = currentDue;
        if (settlementType === "adjust_due") {
          newDue = Math.max(0, currentDue - totalRefundAmount);
        } else if (settlementType === "cash_refund") {
          const paid = Number(originalSale.paidAmount) || 0;
          newDue = Math.max(0, Math.min(currentDue, newGrandTotal - paid));
        }

        const allReturned =
          updatedItems.length > 0 && updatedItems.every((i: any) => (i.availableQuantity || 0) <= 0);
        const newStatus = allReturned || newGrandTotal === 0 ? "Returned" : "Partially Returned";

        await salesCol.updateOne(
          { _id: originalSale._id },
          {
            $set: {
              originalGrandTotal: origGrand,
              originalSubTotal: origSub,
              grandTotal: newGrandTotal,
              subTotal: newSubTotal,
              totalRefundAmount: newTotalRefund,
              dueAmount: newDue,
              status: newStatus,
              items: updatedItems,
              updatedAt: new Date().toISOString(),
            },
          }
        );
      }
    } catch (saleErr) {
      console.warn("Failed to update original sale on return:", saleErr);
    }

    // Update customer balance
    try {
      if (customerPhone) {
        if (settlementType === "adjust_due") {
          await customersCol.updateOne(
            { phone: customerPhone.trim() },
            { $inc: { dueBalance: -totalRefundAmount } }
          );
        } else if (settlementType === "customer_credit") {
          await customersCol.updateOne(
            { phone: customerPhone.trim() },
            { $inc: { creditBalance: totalRefundAmount } }
          );
        }
      }
    } catch (custErr) {
      console.warn("Failed to update customer balance on return:", custErr);
    }

    // Restore inventory items to Available status
    try {
      const returnedSerials = formattedItems.flatMap((i) => i.serialNumbers || []).filter(Boolean);
      if (returnedSerials.length > 0) {
        await inventoryCol.updateMany(
          { serialNumber: { $in: returnedSerials } },
          { $set: { status: "Available", updatedAt: new Date().toISOString() } }
        );
      }
    } catch (invErr) {
      console.warn("Failed to restore inventory items:", invErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Sales return processed successfully",
        return: {
          ...newReturn,
          _id: result.insertedId.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Sales Return POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process sales return", details: String(error) },
      { status: 500 }
    );
  }
}
