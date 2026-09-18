"use client";

import { useState, useEffect, useCallback } from "react";
import FadeUp from "@/components/FadeUp";
import { InvoiceSearch } from "@/components/PurchesInvoiceSection/InvoiceSearch";
import { ProductGroup, ProductSerialCard } from "@/components/PurchesInvoiceSection/ProductSerialCard";
import { PurchaseInfoCard } from "@/components/PurchesInvoiceSection/PurchaseInfoCard";
import { PurchaseSummary } from "@/components/PurchesInvoiceSection/PurchaseSummary";
import { Purchase, PurchaseItem } from "@/types/purchase";
import { useTabs } from "@/context/TabContext";

export default function PurchaseInvoiceClient() {
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [recentPurchases, setRecentPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [currentSearchId, setCurrentSearchId] = useState("");
  
  // Track serial numbers for each item
  const [products, setProducts] = useState<ProductGroup[]>([]);

  let activeTab = "";
  try {
    const tabContext = useTabs();
    activeTab = tabContext.activeTab;
  } catch {
    // Outside TabProvider fallback
  }

  // Fetch recent purchases on mount
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await fetch("/api/purchases");
        const data = await res.json();
        if (data.success) {
          setRecentPurchases(data.purchases);
        }
      } catch (err) {
        console.error("Failed to fetch recent purchases", err);
      }
    };
    fetchRecent();
  }, []);

  const handleSearch = useCallback(async (invoiceNum: string) => {
    if (!invoiceNum.trim()) return;
    setLoading(true);
    setError("");
    setMessage("");
    setPurchase(null);
    setCurrentSearchId(invoiceNum);
    
    try {
      // Find purchase by ID or ReferenceNo
      const res = await fetch(`/api/purchases?search=${encodeURIComponent(invoiceNum)}`);
      const data = await res.json();
      
      if (data.success && data.purchases.length > 0) {
        const foundPurchase = data.purchases[0] as Purchase;
        setPurchase(foundPurchase);
        
        if (foundPurchase.invoiceGenerated) {
          setMessage("Invoice and Serial Numbers for this Purchase have already been generated.");
        }
        
        // Initialize ProductGroups for Serial Number entry
        const groups: ProductGroup[] = foundPurchase.items.map((item: PurchaseItem) => {
          const qty = Math.min(Number(item.quantity) || 1, 500); // Prevent OOM if qty is huge
          return {
            id: item.productId,
            name: item.title,
            totalQuantity: Number(item.quantity),
            serials: Array.from({ length: qty }).map((_, i) => ({
              id: i + 1,
              serialNumber: "", // Empty initially
              isValid: false
            }))
          };
        });
        
        setProducts(groups);
      } else {
        setError("Purchase Invoice not found.");
      }
    } catch (err) {
      setError("Failed to fetch purchase details.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-search if query param 'id' or 'search' is present in URL or Tab
  useEffect(() => {
    let targetId = "";
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      targetId = params.get("id") || params.get("search") || "";
    }
    if (!targetId && activeTab) {
      const queryStr = activeTab.split("?")[1];
      if (queryStr) {
        const params = new URLSearchParams(queryStr);
        targetId = params.get("id") || params.get("search") || "";
      }
    }
    if (targetId && targetId !== currentSearchId) {
      handleSearch(targetId);
    }
  }, [activeTab, currentSearchId, handleSearch]);

  const handleSerialChange = (productId: string, index: number, value: string) => {
    setProducts(current => 
      current.map(group => {
        if (group.id === productId) {
          const newSerials = [...group.serials];
          newSerials[index] = {
            ...newSerials[index],
            serialNumber: value,
            isValid: value.trim().length > 0
          };
          return { ...group, serials: newSerials };
        }
        return group;
      })
    );
  };

  const handleCancel = () => {
    setPurchase(null);
    setProducts([]);
    setError("");
    setMessage("");
  };

  const handleGenerate = async () => {
    if (!purchase) return;
    
    setLoading(true);
    setError("");
    setMessage("");
    
    // Validate all serials are filled
    const allFilled = products.every(p => p.serials.every(s => s.isValid));
    if (!allFilled) {
      setError("Please fill all serial numbers before generating.");
      setLoading(false);
      return;
    }

    // Format items for the API
    const itemsForApi = products.map(p => ({
      productId: p.id,
      productName: p.name,
      quantity: p.totalQuantity,
      serialNumbers: p.serials.map(s => s.serialNumber)
    }));

    try {
      const res = await fetch("/api/inventory/receive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purchaseId: purchase.id || purchase._id,
          branchId: purchase.branchId,
          items: itemsForApi
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setMessage(data.message);
        setPurchase(prev => prev ? { ...prev, invoiceGenerated: true } : null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to generate invoice and receive inventory.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const totalProducts = products.length;
  const totalQuantity = products.reduce((sum, p) => sum + p.totalQuantity, 0);
  const completedSerials = products.reduce((sum, p) => sum + p.serials.filter(s => s.isValid).length, 0);
  const totalSerials = totalQuantity;

  return (
    <FadeUp className="bg-slate-50 p-6 min-h-[calc(100vh-64px)]">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Generate Invoice & Receive Items</h1>

      <InvoiceSearch onSearch={handleSearch} initialValue={currentSearchId} />
      
      {loading && <div className="text-center py-4 text-blue-600">Loading...</div>}
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
          {error}
        </div>
      )}
      
      {message && (
        <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-sm rounded border border-emerald-200">
          {message}
        </div>
      )}

      {purchase ? (
        <>
          <PurchaseInfoCard data={{
            invoiceNumber: purchase.id || "",
            purchaseOrder: purchase.referenceNo || "N/A",
            supplier: purchase.supplierName,
            purchaseDate: purchase.purchaseDate,
            branch: purchase.branchName
          }} />

          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Products & Serial Numbers</h2>
            {products.map((product, idx) => (
              <div key={`${product.id}-${idx}`} className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-800">{product.name}</h3>
                    <p className="text-sm text-slate-500">Quantity: {product.totalQuantity}</p>
                  </div>
                  <div className="text-sm">
                    <span className="text-emerald-600 font-medium">
                      {product.serials.filter(s => s.isValid).length} / {product.totalQuantity} Completed
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {product.serials.map((serial, index) => (
                    <div key={serial.id} className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-400 w-6">
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                      <div className="flex-1">
                        <input
                          type="text"
                          disabled={purchase.invoiceGenerated}
                          value={serial.serialNumber}
                          onChange={(e) => handleSerialChange(product.id, index, e.target.value)}
                          placeholder="Enter or scan serial number"
                          className={`w-full h-10 px-3 rounded border outline-none text-sm font-mono focus:border-blue-500 ${
                            serial.isValid ? 'border-slate-200 bg-slate-50' : 'border-red-200 bg-red-50/30'
                          }`}
                        />
                        {!serial.isValid && (
                          <p className="text-[10px] text-red-500 mt-1">Serial number is required</p>
                        )}
                      </div>
                      <div className="w-20 flex justify-end">
                        {serial.isValid ? (
                          <span className="inline-flex items-center px-2 py-1 rounded bg-emerald-50 text-emerald-600 text-xs font-medium border border-emerald-200">
                            Valid
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-500 text-xs font-medium border border-slate-200">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <PurchaseSummary
            totalProducts={totalProducts}
            totalQuantity={totalQuantity}
            subtotal={purchase.originalSubTotal ?? purchase.subTotal ?? 0}
            grandTotal={purchase.grandTotal ?? 0}
            totalRefundAmount={purchase.totalRefundAmount || 0}
            completedSerials={completedSerials}
            totalSerials={totalSerials}
            onCancel={handleCancel}
            onGenerate={handleGenerate}
          />
        </>
      ) : (
        !loading && !error && !message && (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center mt-6">
            <h2 className="text-xl font-medium text-slate-700 mb-2">No Purchase Selected</h2>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Please search for a Purchase Invoice Number above, or select one from the recent purchases below to begin generating an invoice and receiving items.
            </p>
            
            {recentPurchases.length > 0 ? (
              <div className="text-left mt-8">
                <h3 className="font-semibold text-slate-800 mb-4 border-b pb-2">Recent Pending Purchases</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="py-2 px-3">ID</th>
                        <th className="py-2 px-3">Supplier</th>
                        <th className="py-2 px-3">Date</th>
                        <th className="py-2 px-3">Status</th>
                        <th className="py-2 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPurchases.map(rp => (
                        <tr key={rp.id || rp._id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-2 px-3 font-mono font-medium text-blue-600">{rp.id}</td>
                          <td className="py-2 px-3">{rp.supplierName}</td>
                          <td className="py-2 px-3">{rp.purchaseDate}</td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${rp.invoiceGenerated ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                              {rp.invoiceGenerated ? "Completed" : "Pending"}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right">
                            <button 
                              onClick={() => handleSearch(rp.id || "")}
                              className="text-blue-600 hover:underline font-medium"
                            >
                              Load
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-lg text-slate-500 text-sm mt-4 inline-block">
                No recent purchases found. Create one in Purchase Entry first.
              </div>
            )}
          </div>
        )
      )}
    </FadeUp>
  );
}
