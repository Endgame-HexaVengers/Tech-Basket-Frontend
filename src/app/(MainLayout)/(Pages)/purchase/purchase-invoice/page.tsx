"use client";

import FadeUp from "@/components/FadeUp";
import { InvoiceSearch } from "@/components/PurchesInvoiceSection/InvoiceSearch";
import { ProductGroup, ProductSerialCard } from "@/components/PurchesInvoiceSection/ProductSerialCard";
import { PurchaseInfoCard } from "@/components/PurchesInvoiceSection/PurchaseInfoCard";
import { PurchaseSummary } from "@/components/PurchesInvoiceSection/PurchaseSummary";


const samplePurchaseData = {
  invoiceNumber: "INV-2026-000125",
  purchaseOrder: "PO-2026-000045",
  supplier: "ABC Computer Ltd.",
  purchaseDate: "20 Aug 2026",
  branch: "Dhaka Main Branch",
};

const sampleProducts: ProductGroup[] = [
  {
    id: "p1",
    name: "Logitech B175 Mouse White",
    totalQuantity: 3,
    serials: [
      { id: 1, serialNumber: "SN-B175-00001", isValid: true },
      { id: 2, serialNumber: "SN-B175-00002", isValid: true },
      { id: 3, serialNumber: "SN-B175-00003", isValid: true },
    ],
  },
  {
    id: "p2",
    name: "Logitech K120 Keyboard Black",
    totalQuantity: 2,
    serials: [
      { id: 1, serialNumber: "SN-K120-00001", isValid: true },
      { id: 2, serialNumber: "", isValid: false, error: "Serial number is required" },
    ],
  },
];

export default function GenerateInvoicePage() {
  const handleSearch = (invoiceNum: string) => {
    console.log("Searching invoice:", invoiceNum);
  };

  const handleCancel = () => {
    console.log("Invoice process cancelled");
  };

  const handleGenerate = () => {
    console.log("Generating invoice...");
  };

  return (
    <FadeUp className=" bg-slate-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 ">Generate Invoice</h1>

      <InvoiceSearch onSearch={handleSearch} />
      
      <PurchaseInfoCard data={samplePurchaseData} />

      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Products & Serial Numbers</h2>
        {sampleProducts.map((product) => (
          <ProductSerialCard key={product.id} product={product} />
        ))}
      </div>

      <PurchaseSummary
        totalProducts={2}
        totalQuantity={5}
        subtotal={29000}
        grandTotal={29000}
        completedSerials={4}
        totalSerials={5}
        onCancel={handleCancel}
        onGenerate={handleGenerate}/>
    </FadeUp>
  );
}