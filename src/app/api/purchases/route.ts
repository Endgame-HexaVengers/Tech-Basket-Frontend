import { NextRequest, NextResponse } from "next/server";
import { catalogDatabase } from "@/lib/mongodb";
import { Purchase } from "@/types/purchase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const getPurchasesCollection = () => catalogDatabase.collection<Purchase>("purchases");

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const branchId = searchParams.get("branchId");

    const query: any = {};
    if (search) {
      query.$or = [
        { supplierName: { $regex: search, $options: "i" } },
        { id: { $regex: search, $options: "i" } },
        { referenceNo: { $regex: search, $options: "i" } },
      ];
    }
    if (status) {
      query.status = status;
    }
    if (branchId) {
      query.branchId = branchId;
    }

    const col = getPurchasesCollection();
    const rawPurchases = await col.find(query).sort({ createdAt: -1 }).toArray();

    // Fetch returns to calculate accurate net totals and returned quantities
    const returnsCol = catalogDatabase.collection("purchase_returns");
    let allReturns: any[] = [];
    try {
      allReturns = await returnsCol.find({}).toArray();
    } catch {
      allReturns = [];
    }

    const returnsByPurchase: Record<string, any[]> = {};
    for (const ret of allReturns) {
      const key1 = ret.purchaseInvoiceNo;
      const key2 = ret.purchaseId;
      if (key1) {
        if (!returnsByPurchase[key1]) returnsByPurchase[key1] = [];
        returnsByPurchase[key1].push(ret);
      }
      if (key2 && key2 !== key1) {
        if (!returnsByPurchase[key2]) returnsByPurchase[key2] = [];
        returnsByPurchase[key2].push(ret);
      }
    }

    const purchases = rawPurchases.map((doc: any) => {
      const docId = doc.id || doc.purchaseNumber || doc._id?.toString();
      const matched = (docId && returnsByPurchase[docId]) || (doc.id && returnsByPurchase[doc.id]) || [];

      if (matched.length > 0) {
        const totalRefund = matched.reduce(
          (sum: number, r: any) => sum + (Number(r.totalRefundAmount) || 0),
          0,
        );
        const origGrand = Number(doc.originalGrandTotal ?? doc.grandTotal) || 0;
        const origSub = Number(doc.originalSubTotal ?? doc.subTotal) || 0;
        const netGrand = Math.max(0, origGrand - totalRefund);
        const netSub = Math.max(0, origSub - totalRefund);

        const returnedQtyMap: Record<string, number> = {};
        matched.forEach((r: any) => {
          (r.items || []).forEach((it: any) => {
            const pId = it.productId;
            const q = Number(it.quantity || it.quantityReturned || 1);
            returnedQtyMap[pId] = (returnedQtyMap[pId] || 0) + q;
          });
        });

        const updatedItems = (doc.items || []).map((pItem: any) => {
          const retQty = returnedQtyMap[pItem.productId] || 0;
          const availQty = Math.max(0, (Number(pItem.quantity) || 1) - retQty);
          return {
            ...pItem,
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

    return NextResponse.json({
      success: true,
      purchases,
      totalCount: purchases.length,
    });
  } catch (error) {
    console.error("Purchases GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch purchases", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = (await request.json()) as Partial<Purchase>;

    if (!data.items || data.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing required field: items" },
        { status: 400 }
      );
    }

    const col = getPurchasesCollection();

    // Ensure any legacy documents without purchaseNumber are assigned one so unique index doesn't conflict
    try {
      await col.updateMany(
        { purchaseNumber: { $in: [null, undefined] }, id: { $exists: true } },
        [{ $set: { purchaseNumber: "$id" } }]
      );
    } catch {
      // ignore if not allowed
    }

    // Generate guaranteed unique ID e.g. PUR-YYYY-001 or PO-YYYY-001
    const year = new Date().getFullYear();
    let count = 0;
    try {
      count = await col.countDocuments();
    } catch {
      count = 0;
    }

    let seqNumber = count + 1;
    let newPurchaseId = `PUR-${year}-${seqNumber.toString().padStart(3, "0")}`;

    // Ensure collision-free ID
    try {
      let exists = await col.findOne({
        $or: [{ id: newPurchaseId }, { purchaseNumber: newPurchaseId }],
      });
      while (exists) {
        seqNumber++;
        newPurchaseId = `PUR-${year}-${seqNumber.toString().padStart(3, "0")}`;
        exists = await col.findOne({
          $or: [{ id: newPurchaseId }, { purchaseNumber: newPurchaseId }],
        });
      }
    } catch {
      // Fallback with timestamp if search fails
      newPurchaseId = `PUR-${year}-${Date.now().toString().slice(-4)}`;
    }

    // Calculate totals from items to ensure consistency
    const calculatedSubTotal = data.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const calculatedDiscount = data.items.reduce((sum, item) => sum + (item.discount || 0), 0);
    const calculatedTotal = calculatedSubTotal - calculatedDiscount + (data.totalTax || 0);

    const newPurchase: any = {
      id: newPurchaseId,
      purchaseNumber: newPurchaseId,
      supplier: data.supplierId || "SUP_UNKNOWN",
      supplierId: data.supplierId || "SUP_UNKNOWN",
      supplierName: data.supplierName || "",
      supplierPhone: data.supplierPhone || "",
      branch: data.branchId || "MAIN_BRANCH",
      branchId: data.branchId || "MAIN_BRANCH",
      branchName: data.branchName || "",
      purchasePerson: data.purchasePerson || "",
      employeeId: data.employeeId || "",
      purchaseDate: data.purchaseDate || new Date().toISOString().split("T")[0],
      referenceNo: data.referenceNo || "",
      items: data.items.map(item => ({
        id: item.id,
        productId: item.productId,
        product: item.productId,
        title: item.title,
        price: Number(item.price) || 0,
        unitCost: Number(item.price) || 0,
        quantity: Number(item.quantity) || 0,
        total: Number(item.total) || (Number(item.quantity) * Number(item.price) - (Number(item.discount) || 0)),
        subtotal: Number(item.total) || (Number(item.quantity) * Number(item.price) - (Number(item.discount) || 0)),
        tax: Number(item.tax) || 0,
        discount: Number(item.discount) || 0,
        discountPercent: item.discountPercent !== undefined ? Number(item.discountPercent) : 0,
        discountType: item.discountType || "percent",
        serialNumbers: [],
      })),
      subTotal: data.subTotal ?? calculatedSubTotal,
      totalTax: data.totalTax ?? 0,
      totalDiscount: data.totalDiscount ?? calculatedDiscount,
      grandTotal: data.grandTotal ?? calculatedTotal,
      totalAmount: data.grandTotal ?? calculatedTotal,
      paidAmount: data.paidAmount ?? 0,
      dueAmount: data.dueAmount ?? calculatedTotal,
      status: data.status || "Received",
      paymentStatus: (data.paymentStatus as any) || "Unpaid",
      invoiceGenerated: false,
      notes: data.notes || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await col.insertOne(newPurchase as any);

    return NextResponse.json(
      {
        success: true,
        purchase: {
          ...newPurchase,
          _id: result.insertedId.toString(),
        },
        message: "Purchase created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Purchases POST Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to create purchase", 
        details: error?.message || String(error) 
      },
      { status: 500 }
    );
  }
}
