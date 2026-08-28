"use client";

import React, { useState } from "react";
import { Button } from "@heroui/react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { FiSave, FiPrinter, FiX, FiRefreshCw, FiShield } from "react-icons/fi";
import { SearchHeader } from "@/components/RMA/SearchHeader";
import { InfoCard } from "@/components/RMA/InfoCard";
import { ComplaintForm } from "@/components/RMA/ComplaintForm";



export default function ComplaintReceviedPage() {
  const [formData, setFormData] = useState({
    complainerName: "",
    contact: "",
    relationship: "",
    address: "",
    complaintType: "",
    physicalCondition: "",
    accessories: "",
    problemDescription: "",
    remarks: "",
  });

  const handleSearch = (query: string) => {
    toast.success(`Searching serial: ${query}`);
  };

  const handleClear = () => {
    setFormData({
      complainerName: "",
      contact: "",
      relationship: "",
      address: "",
      complaintType: "",
      physicalCondition: "",
      accessories: "",
      problemDescription: "",
      remarks: "",
    });
    toast("Form cleared", { icon: "🧹" });
  };

  const handleSameAsCustomer = () => {
    setFormData((prev) => ({
      ...prev,
      complainerName: "Karim Traders",
      contact: "01712345678",
      address: "Dhaka, Bangladesh",
      relationship: "Self",
    }));
    toast.success("Copied customer details");
  };

  const handleSaveDraft = () => {
    toast.success("Draft saved successfully!");
  };

  const handleGenerateReport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: "Generating Report & Saving...",
        success: "Report Generated and Saved Successfully!",
        error: "Failed to save",
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-800 font-sans">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Page Title */}
        <motion.h1 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-slate-800 tracking-tight"
        >
          RMA Complaint Received
        </motion.h1>

        {/* Top Search */}
        <SearchHeader onSearch={handleSearch} onClear={handleClear} />

        {/* Top Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard
            title="Sale Information"
            fields={[
              { label: "Invoice", value: "INV-000215" },
              { label: "Sale ID", value: "SALE-000215" },
              { label: "Date", value: "25 Aug 2026" },
              { label: "Branch", value: "Dhaka Branch" },
              { label: "Sales Person", value: "Ahmed Rahman" },
              { label: "Status", value: "Completed", isBadge: true },
            ]}
          />
          <InfoCard
            title="Customer Information"
            fields={[
              { label: "Customer ID", value: "CUS-000245" },
              { label: "Phone", value: "01712345678" },
              { label: "Name", value: "Karim Traders" },
              { label: "Address", value: "Dhaka, Bangladesh" },
            ]}
          />
        </div>

        {/* Product Information & Warranty */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <InfoCard
              title="Product Information"
              fields={[
                { label: "Product Name", value: "Logitech B175 Mouse" },
                { label: "SKU", value: "LGT-B175" },
                { label: "Serial", value: "SN-LGT-001928" },
                { label: "Sale Price", value: "৳650" },
                { label: "Warranty", value: "1 Year" },
              ]}
            />
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-2">
                <FiShield className="text-xl" /> Warranty Status
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-600 text-white font-semibold text-xs tracking-wide">
                IN WARRANTY
              </span>
            </div>
            <div className="text-xs text-slate-500 space-y-1 mt-4">
              <div><strong>Start:</strong> 25 Aug 2026</div>
              <div><strong>End:</strong> 25 Aug 2027</div>
            </div>
          </motion.div>
        </div>

        {/* Form Sections */}
        <ComplaintForm 
          formData={formData} 
          setFormData={setFormData} 
          onSameAsCustomer={handleSameAsCustomer} 
        />

        {/* RMA Tracking Info */}
        <InfoCard
          title="RMA Tracking Info"
          fields={[
            { label: "RMA ID", value: "RMA-000125" },
            { label: "Date", value: "25 Aug 2026" },
            { label: "Received By", value: "Admin User" },
            { label: "Status", value: "Complaint Received", isBadge: true },
          ]}
        />

        {/* Footer Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-200"
        >
          <Button 
            onClick={handleClear}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium px-4 py-2 rounded-xl transition-all"
          >
            <FiX className="mr-1" /> Cancel
          </Button>
          <Button 
            onClick={handleClear}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium px-4 py-2 rounded-xl transition-all"
          >
            <FiRefreshCw className="mr-1" /> Clear
          </Button>
          <Button 
            onClick={handleSaveDraft}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-xl shadow-md shadow-blue-500/20 transition-all active:scale-95"
          >
            <FiSave className="mr-1" /> Save Draft
          </Button>
          <Button 
            onClick={handleGenerateReport}
            className="bg-slate-900 hover:bg-black text-white font-medium px-5 py-2 rounded-xl shadow-md transition-all active:scale-95"
          >
            <FiPrinter className="mr-1" /> Generate Report & Save
          </Button>
        </motion.div>

      </div>
    </div>
  );
}