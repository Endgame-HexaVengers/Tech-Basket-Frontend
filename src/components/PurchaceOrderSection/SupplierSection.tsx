'use client';

import { useState } from 'react';
import {
  TbSearch,
  TbMapPin,
  TbReceipt,
  TbPhone,
} from 'react-icons/tb';

import {
  Supplier,
  DUMMY_SUPPLIERS,
} from '@/types/purchase';

interface Props {
  selectedSupplier: Supplier | null;
  setSelectedSupplier: (supplier: Supplier | null) => void;
  invoiceNo: string;
  setInvoiceNo: (val: string) => void;
}

export default function SupplierSection({
  selectedSupplier,
  setSelectedSupplier,
  invoiceNo,
  setInvoiceNo,
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredSuppliers = DUMMY_SUPPLIERS.filter((supplier) =>
    supplier.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleSelect = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setSearchTerm(supplier.name);
    setShowDropdown(false);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 mb-6">

      <h2 className="text-lg font-bold text-slate-800 mb-4">
        Supplier Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Search Supplier */}
        <div className="relative">

          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Search Supplier{' '}
            <span className="text-red-500">*</span>
          </label>

          <div className="relative flex items-center">

            <TbSearch className="absolute left-3 text-slate-400 text-lg" />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;

                setSearchTerm(value);
                setShowDropdown(true);

                if (!value) {
                  setSelectedSupplier(null);
                }
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search supplier..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
            />

          </div>

          {/* Supplier Dropdown */}
          {showDropdown &&
            searchTerm &&
            filteredSuppliers.length > 0 && (
              <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">

                {filteredSuppliers.map((supplier) => (
                  <div
                    key={supplier.id}
                    onClick={() => handleSelect(supplier)}
                    className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-sm text-slate-700 transition"
                  >
                    <div>
                      <p className="font-medium">
                        {supplier.name}
                      </p>

                      <p className="text-xs text-slate-400">
                        {supplier.location}
                      </p>
                    </div>
                  </div>
                ))}

              </div>
            )}

        </div>

        {/* Phone Number */}
        <div>

          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Phone Number{' '}
            <span className="text-red-500">*</span>
          </label>

          <div className="relative flex items-center">

            <TbPhone className="absolute left-3 text-slate-400 text-lg" />

            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
            />

          </div>

        </div>

        {/* Supplier Location */}
        <div>

          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Supplier Location{' '}
            <span className="text-red-500">*</span>
          </label>

          <div className="relative flex items-center">

            <TbMapPin className="absolute left-3 text-slate-400 text-lg" />

            <input
              type="text"
              readOnly
              value={selectedSupplier?.location || ''}
              placeholder="Location will auto-fill"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-600 cursor-not-allowed"
            />

          </div>

        </div>

        {/* Invoice Number */}
        <div>

          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Invoice Number{' '}
            <span className="text-red-500">*</span>
          </label>

          <div className="relative flex items-center">

            <TbReceipt className="absolute left-3 text-slate-400 text-lg" />

            <input
              type="text"
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
              placeholder="Enter invoice number"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
            />

          </div>

        </div>

      </div>

    </div>
  );
}