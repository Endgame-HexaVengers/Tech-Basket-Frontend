'use client';

import { useState } from 'react';
import SupplierSection from '@/components/PurchaceOrderSection/SupplierSection';
import ProductsSection from '@/components/PurchaceOrderSection/ProductsSection';
import PurchaseSummary from '@/components/PurchaceOrderSection/PurchaseSummary';
import { AdditionalDetails } from '@/components/PurchaceOrderSection/AdditionalDetails';

import {
  Supplier,
  PurchaseItem,
  DUMMY_PRODUCTS,
} from '@/types/purchase';
import FadeUp from '@/components/FadeUp';

export default function Home() {
  const [selectedSupplier, setSelectedSupplier] =
    useState<Supplier | null>(null);

  const [invoiceNo, setInvoiceNo] = useState('');

  const [items, setItems] = useState<PurchaseItem[]>([
    {
      id: '1',
      productId: DUMMY_PRODUCTS[0].id,
      title: DUMMY_PRODUCTS[0].title,
      price: DUMMY_PRODUCTS[0].defaultPrice,
      quantity: 5,
      total: DUMMY_PRODUCTS[0].defaultPrice * 5,
    },
    {
      id: '2',
      productId: DUMMY_PRODUCTS[1].id,
      title: DUMMY_PRODUCTS[1].title,
      price: DUMMY_PRODUCTS[1].defaultPrice,
      quantity: 10,
      total: DUMMY_PRODUCTS[1].defaultPrice * 10,
    },
  ]);

  const [reference, setReference] = useState('');
  const [remarks, setRemarks] = useState('');

  // Reset Purchase Order
  const handleReset = () => {
    setSelectedSupplier(null);
    setInvoiceNo('');
    setItems([]);
    setReference('');
    setRemarks('');
  };

  // Save Purchase Order
  const handleSave = () => {
    const backendData = {
      supplierId: selectedSupplier?.id,
      invoiceNo,
      items,
      reference,
      remarks,
    };

    console.log('Backend Data Object:', backendData);
  };

  return (
    <div className="bg-slate-50/50 p-4 md:p-8">

      <FadeUp className="container mx-auto space-y-6">

        {/* Supplier Section */}
        <SupplierSection
          selectedSupplier={selectedSupplier}
          setSelectedSupplier={setSelectedSupplier}
          invoiceNo={invoiceNo}
          setInvoiceNo={setInvoiceNo}
        />

        {/* Products Section */}
        <ProductsSection
          items={items}
          setItems={setItems}
        />

        {/* Additional Details */}
        <AdditionalDetails
          reference={reference}
          remarks={remarks}
          onReferenceChange={setReference}
          onRemarksChange={setRemarks}
        />

        {/* Purchase Summary */}
        <PurchaseSummary
          items={items}
          onReset={handleReset}
          onSave={handleSave}
        />

      </FadeUp>
    </div>
  );
}