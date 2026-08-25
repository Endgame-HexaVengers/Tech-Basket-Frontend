import React, { useState } from "react";
import { RefreshCcw, Search, ChevronDown, Check } from "lucide-react";
import FadeUp from "../FadeUp";

// 1. Filter Options Data Arrays
const STATUS_OPTIONS = ["All", "Active", "Draft", "Inactive"];
const ROLE_OPTIONS = ["All", "Store Manager", "System Admin", "Inventory Staff"];
const BRANCH_OPTIONS = [
  "All",
  "NY Hub 001",
  "MPL Shop 1316",
  "LA Distribution 99",
  "OUL Express 12",
];

interface UserFiltersProps {
  onFilterChange?: (filters: {
    search: string;
    status: string;
    role: string;
    branch: string;
  }) => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({ onFilterChange }) => {
  // Filter States
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedBranch, setSelectedBranch] = useState("All");

  // Reset Function
  const handleReset = () => {
    setSearch("");
    setSelectedStatus("All");
    setSelectedRole("All");
    setSelectedBranch("All");

    if (onFilterChange) {
      onFilterChange({
        search: "",
        status: "All",
        role: "All",
        branch: "All",
      });
    }
  };

  return (
    <div className="border-b border-gray-200 bg-white p-4">
      <FadeUp className="flex flex-col gap-3 xl:flex-row xl:items-center">
        {/* Search Input */}
        <div className="relative w-full xl:max-w-[300px]">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Dynamic Filter Dropdowns */}
        <FilterDropdown
          prefix="Status"
          options={STATUS_OPTIONS}
          selectedValue={selectedStatus}
          onSelect={setSelectedStatus}
        />

        <FilterDropdown
          prefix="Role"
          options={ROLE_OPTIONS}
          selectedValue={selectedRole}
          onSelect={setSelectedRole}
        />

        <FilterDropdown
          prefix="Branch"
          options={BRANCH_OPTIONS}
          selectedValue={selectedBranch}
          onSelect={setSelectedBranch}
        />

        {/* Reset Button */}
        <button
          type="button"
          onClick={handleReset}
          className="flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-blue-600 transition hover:bg-blue-50 cursor-pointer"
        >
          <RefreshCcw size={15} />
          Reset Filters
        </button>
      </FadeUp>
    </div>
  );
};

// Reusable Filter Dropdown Component
interface FilterDropdownProps {
  prefix: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  prefix,
  options,
  selectedValue,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-10 min-w-[140px] items-center justify-between gap-3 rounded-lg border px-3 text-sm transition cursor-pointer ${
          selectedValue !== "All"
            ? "border-blue-500 bg-blue-50/40 text-blue-700 font-medium"
            : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50/50"
        }`}
      >
        <span className="truncate">
          {prefix}: <span className="font-semibold">{selectedValue}</span>
        </span>
        <ChevronDown
          size={15}
          className={`text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Overlay for closing menu when clicking outside */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute left-0 top-12 z-20 w-48 rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg">
            {options.map((option) => {
              const isSelected = selectedValue === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onSelect(option);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs transition cursor-pointer ${
                    isSelected
                      ? "bg-blue-50 font-semibold text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {option}
                  {isSelected && <Check size={14} className="text-blue-600" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default UserFilters;