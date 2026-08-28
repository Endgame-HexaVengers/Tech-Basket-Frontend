

import React from "react";
import { motion } from "framer-motion";

interface InfoField {
  label: string;
  value: string;
  isBadge?: boolean;
}

interface InfoCardProps {
  title: string;
  fields: InfoField[];
  extraHeader?: React.ReactNode;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, fields, extraHeader }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow h-full"
    >
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800 text-base">{title}</h3>
        {extraHeader}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {fields.map((field, idx) => (
          <div key={idx} className={field.isBadge ? "col-span-2" : ""}>
            <span className="text-xs font-medium text-slate-400 block mb-1">{field.label}</span>
            {field.isBadge ? (
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-medium text-xs border border-emerald-200/50">
                {field.value}
              </span>
            ) : (
              <span className="text-sm font-medium text-slate-700 block">{field.value || "-"}</span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};