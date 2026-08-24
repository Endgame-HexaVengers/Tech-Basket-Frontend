'use client';

import { useState } from 'react';
import { FiSearch, FiSliders, FiChevronDown } from 'react-icons/fi';
import { FilterParams } from '@/types/branch';

interface Props {
  onFilterChange: (filters: FilterParams) => void;
}

const SearchFilters = ({ onFilterChange }: Props) => {

const [filters, setFilters] = useState<FilterParams>({
    search: '',
    status: '',
    type: '',
    location: '',
  });

  const handleChange = (key: keyof FilterParams, value: string) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onFilterChange(updated);
  };


  return (
    <div className="bg-white p-4 rounded border border-dashed border-gray-200 shadow-sm mb-6 flex flex-wrap gap-3 items-center justify-between">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[280px]">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        <input
          type="text"
          placeholder="Search by branch name, code, city..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-500 focus:bg-white transition"
        />
      </div>

      {/* Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Dropdown */}
        <div className="relative">
          <select
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg text-sm outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Branch Types Dropdown */}
        <div className="relative">
          <select
            value={filters.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg text-sm outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Branch Types</option>
            <option value="Retail Store">Retail Store</option>
            <option value="Service Center">Service Center</option>
            <option value="Warehouse">Warehouse</option>
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Locations Dropdown */}
        <div className="relative">
          <select
            value={filters.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg text-sm outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Locations</option>
            <option value="Dhaka">Dhaka</option>
            <option value="Uttara">Uttara</option>
            <option value="Bogura">Bogura</option>
            <option value="Tangail">Tangail</option>
            <option value="Cumilla">Cumilla</option>
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Filter Toggle Button */}
        <button className="p-2.5 text-gray-500 border border-gray-200 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
          <FiSliders className="text-base" />
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;