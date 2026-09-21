import { NextRequest, NextResponse } from "next/server";
import { catalogDatabase } from "@/lib/mongodb";
import { PurchaseReturn } from "@/types/purchase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const getReturnCollection = () => catalogDatabase.collection<PurchaseReturn>("purchase_returns");
const getPurchasesCollection = () => catalogDatabase.collection("purchases");
const getInventoryCollection = () => catalogDatabase.collection("inventory_items");

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const purchaseId = searchParams.get("purchaseId");

    const query: any = {};
    if (search) {
      query.$or = [
        { returnId: { $regex: search, $options: "i" } },
        { purchaseId: { $regex: search, $options: "i" } },
        { purchaseInvoiceNo: { $regex: search, $options: "i" } },
        { supplierName: { $regex: search, $options: "i" } },
      ];
    }
    if (status && status !== "all") {
      query.status = status;
    }
    if (purchaseId) {
      query.purchaseId = purchaseId;
    }

    const returnsCol = getReturnCollection();
    const rawReturns = await returnsCol.find(query).sort({ createdAt: -1 }).toArray();

    const returns = rawReturns.map((doc: any) => ({
      ...doc,
      _id: doc._id?.toString(),
    }));

    // Calculate aggregated metrics
    const allReturns = await returnsCol.find({}).toArray();
    const totalReturns = allReturns.length;
    const totalRefundAmount = allReturns.reduce((sum, r) => sum + (Number(r.totalRefundAmount) || 0), 0);
    const pendingCount = allReturns.filter(r => r.status === "Pending").length;
    const completedCount = allReturns.filter(r => r.status === "Completed").length;
    
    // Unique suppliers involved
    const supplierSet = new Set(allReturns.map(r => r.supplierName).filter(Boolean));

    return NextResponse.json({
      success: true,
      returns,
      stats: {
        totalReturns,
        totalRefundAmount,
        pendingCount,
        completedCount,
        uniqueSuppliersCount: supplierSet.size,
      },
    });
  } catch (error) {
    console.error("Purchase Return GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch returns", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      purchaseId,
      purchaseInvoiceNo,
      supplierId,
      supplierName,
      supplierPhone,
      branchName,
      items,
      settlementType = "adjust_due",
      returnReason = "General Return",
      notes = "",
    } = data;

    if (!purchaseId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (purchaseId, items)" },
        { status: 400 }
      );
    }

    const returnsCol = getReturnCollection();
    const purchasesCol = getPurchasesCollection();
    const inventoryCol = getInventoryCollection();

    const returnId = `RET-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
    
    let totalRefundAmount = 0;
    let totalReturnedQty = 0;
    
    for (const item of items) {
      const itemRefund = Number(item.refundAmount) || (Number(item.quantity || item.quantityReturned || 1) * Number(item.price || item.unitPrice || 0));
      totalRefundAmount += itemRefund;
      totalReturnedQty += Number(item.quantity || item.quantityReturned || 1);
      
      // Update inventory items to Returned status if serial numbers are present
      if (item.serialNumbers && item.serialNumbers.length > 0) {
        await inventoryCol.updateMany(
          { 
            productId: item.productId,
            serialNumber: { $in: item.serialNumbers }
          },
          { $set: { status: "Returned", updatedAt: new Date().toISOString() } }
        );
      }
    }

    const newReturn: PurchaseReturn = {
      returnId,
      purchaseId,
      purchaseInvoiceNo: purchaseInvoiceNo || purchaseId,
      supplierId: supplierId || "",
      supplierName: supplierName || "",
      supplierPhone: supplierPhone || "",
      branchName: branchName || "",
      returnDate: new Date().toISOString(),
      items: items.map((item: any) => ({
        purchaseItemId: item.purchaseItemId || item.id,
        productId: item.productId,
        productName: item.productName || item.title || "",
        quantity: Number(item.quantity || item.quantityReturned || 1),
        price: Number(item.price || item.unitPrice || 0),
        unitPrice: Number(item.price || item.unitPrice || 0),
        refundAmount: Number(item.refundAmount) || (Number(item.quantity || item.quantityReturned || 1) * Number(item.price || item.unitPrice || 0)),
        returnReason: item.returnReason || returnReason,
        serialNumbers: item.serialNumbers || [],
      })),
      totalRefundAmount,
      totalReturnedQty,
      settlementType,
      returnReason,
      notes,
      status: "Completed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await returnsCol.insertOne(newReturn);

    // Update original purchase document: deduct prices, update returned items and due
    try {
      const originalPurchase = await purchasesCol.findOne({
        $or: [
          { id: purchaseId },
          { purchaseNumber: purchaseId },
          { referenceNo: purchaseId },
        ],
      });

      if (originalPurchase) {
        const origGrand = Number(originalPurchase.originalGrandTotal ?? originalPurchase.grandTotal) || 0;
        const origSub = Number(originalPurchase.originalSubTotal ?? originalPurchase.subTotal) || 0;
        const previousRefund = Number(originalPurchase.totalRefundAmount) || 0;
        const newTotalRefund = previousRefund + totalRefundAmount;
        const newGrandTotal = Math.max(0, origGrand - newTotalRefund);
        const newSubTotal = Math.max(0, origSub - newTotalRefund);

        const updatedItems = (originalPurchase.items || []).map((pItem: any) => {
          const retMatch = items.find((it: any) => it.productId === pItem.productId);
          const newlyReturned = retMatch ? Number(retMatch.quantity || retMatch.quantityReturned || 1) : 0;
          const currentRetQty = (Number(pItem.returnedQuantity) || 0) + newlyReturned;
          const availQty = Math.max(0, (Number(pItem.quantity) || 1) - currentRetQty);
          return {
            ...pItem,
            returnedQuantity: currentRetQty,
            availableQuantity: availQty,
          };
        });

        const currentDue = Number(originalPurchase.dueAmount) || 0;
        let newDue = currentDue;
        if (settlementType === "adjust_due" || settlementType === "supplier_credit") {
          newDue = Math.max(0, currentDue - totalRefundAmount);
        } else if (settlementType === "cash_refund") {
          const paid = Number(originalPurchase.paidAmount) || 0;
          newDue = Math.max(0, Math.min(currentDue, newGrandTotal - paid));
        }

        const allReturned =
          updatedItems.length > 0 && updatedItems.every((i: any) => (i.availableQuantity || 0) <= 0);
        const newStatus = allReturned || newGrandTotal === 0 ? "Returned" : "Partially Returned";

        await purchasesCol.updateOne(
          { _id: originalPurchase._id },
          {
            $set: {
              originalGrandTotal: origGrand,
              originalSubTotal: origSub,
              grandTotal: newGrandTotal,
              subTotal: newSubTotal,
              totalRefundAmount: newTotalRefund,
              returnedAmount: newTotalRefund,
              dueAmount: newDue,
              status: newStatus,
              items: updatedItems,
              updatedAt: new Date().toISOString(),
            },
          }
        );
      }
    } catch (purchaseUpdateErr) {
      console.warn("Failed to update original purchase calculations:", purchaseUpdateErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Purchase return created successfully",
        return: { ...newReturn, _id: result.insertedId.toString() }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Purchase Return POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process return", details: String(error) },
      { status: 500 }
    );
  }
}
