"use client";

import React from "react";
import { motion } from "framer-motion";

interface FormData {
  complainerName: string;
  contact: string;
  relationship: string;
  address: string;
  complaintType: string;
  physicalCondition: string;
  accessories: string;
  problemDescription: string;
  remarks: string;
}

interface ComplaintFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSameAsCustomer: () => void;
}

export const ComplaintForm: React.FC<ComplaintFormProps> = ({ formData, setFormData, onSameAsCustomer }) => {
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Complainer Info */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm"
      >
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Complainer Information</h3>
          <button 
            type="button" 
            onClick={onSameAsCustomer}
            className="text-xs text-blue-600 font-medium hover:underline cursor-pointer"
          >
            Same as Customer
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-slate-500 mb-1 block">Complainer Name</label>
            <input
              type="text"
              placeholder="Enter Complainer Name"
              value={formData.complainerName}
              onChange={(e) => handleChange("complainerName", e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Contact</label>
            <input
              type="text"
              placeholder="Enter Contact"
              value={formData.contact}
              onChange={(e) => handleChange("contact", e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Relationship</label>
            <select
              value={formData.relationship}
              onChange={(e) => handleChange("relationship", e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-white"
            >
              <option value="">Select Relationship</option>
              <option value="Self">Self</option>
              <option value="Employee">Employee</option>
              <option value="Friend">Friend</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-slate-500 mb-1 block">Address</label>
            <input
              type="text"
              placeholder="Enter Address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
            />
          </div>
        </div>
      </motion.div>

      {/* Complaint Details */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4"
      >
        <h3 className="font-semibold text-slate-800 pb-2 border-b border-slate-100">Complaint Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Complaint Type</label>
            <select
              value={formData.complaintType}
              onChange={(e) => handleChange("complaintType", e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-white"
            >
              <option value="">Select Type</option>
              <option value="Hardware">Hardware Issue</option>
              <option value="Software">Software Issue</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Physical Condition</label>
            <input
              type="text"
              placeholder="e.g., Scratched, Clean, Broken"
              value={formData.physicalCondition}
              onChange={(e) => handleChange("physicalCondition", e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-slate-500 mb-1 block">Accessories Included</label>
            <input
              type="text"
              placeholder="e.g., Box, Cable, Manual"
              value={formData.accessories}
              onChange={(e) => handleChange("accessories", e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-slate-500 mb-1 block">Problem Description</label>
            <textarea
              rows={3}
              placeholder="Describe the issue..."
              value={formData.problemDescription}
              onChange={(e) => handleChange("problemDescription", e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition resize-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-slate-500 mb-1 block">Remarks (Internal)</label>
            <textarea
              rows={2}
              placeholder="Additional notes..."
              value={formData.remarks}
              onChange={(e) => handleChange("remarks", e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition resize-none"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};