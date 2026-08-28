"use client";

import React, { useState } from "react";
import { Button } from "@heroui/react";
import { FiSearch, FiRotateCcw } from "react-icons/fi";
import { motion } from "framer-motion";

interface SearchHeaderProps {
  onSearch: (query: string) => void;
  onClear: () => void;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({ onSearch, onClear }) => {
  const [query, setQuery] = useState("SN-LGT-001928");

  const handleClear = () => {
    setQuery("");
    onClear();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }} 
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-slate-100 mb-6"
    >
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Serial Number..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium text-slate-700 bg-slate-50/50"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <Button 
            onClick={() => onSearch(query)} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 rounded-xl shadow-md shadow-blue-500/20 active:scale-95 transition-all"
          >
            <FiSearch className="mr-1" /> Search
          </Button>
          <Button 
            onClick={handleClear}
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium px-4 rounded-xl active:scale-95 transition-all"
          >
            <FiRotateCcw className="mr-1" /> Clear
          </Button>
        </div>
      </div>
    </motion.div>
  );
};