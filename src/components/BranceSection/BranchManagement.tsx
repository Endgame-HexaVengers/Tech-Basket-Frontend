'use client';

import { useState, useEffect, useCallback } from 'react';
import { FiMoreVertical } from 'react-icons/fi';
import { LuCompass } from 'react-icons/lu';
import { Branch, FilterParams } from '@/types/branch';
import { FaStore } from 'react-icons/fa';
import SearchFilters from '../SearchSection/SearchFilters';
import FadeUp from '../FadeUp';



export default function BranchManagement() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Backend Fetch Function
  const fetchBranches = useCallback(async (filters?: FilterParams) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters?.search) queryParams.append('search', filters.search);
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.type) queryParams.append('type', filters.type);
      if (filters?.location) queryParams.append('location', filters.location);

      const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/api/branches?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      // Guard: ensure response is JSON before parsing
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error("Server returned a non-JSON response.");
      }

      const data = await response.json();
      setBranches(data.branches || []);
    } catch (error) {
      console.error('Failed to fetch branches:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBranches();
  }, [fetchBranches]);

  const handleFilterChange = (filters: FilterParams) => {
    fetchBranches(filters);
  };

  return (
    <FadeUp className="p-6">
      <div>
        {/* Filter Component */}
        <SearchFilters onFilterChange={handleFilterChange} />

        {/* Table Container */}
        <div className="overflow-hidden rounded-xl border border-dashed border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4 text-gray-500 dark:!text-white">
                    Branch
                  </th>

                  <th className="px-6 py-4 text-gray-500 dark:!text-white">
                    Code
                  </th>

                  <th className="px-6 py-4 text-gray-500 dark:!text-white">
                    Location
                  </th>

                  <th className="px-6 py-4 text-gray-500 dark:!text-white">
                    Type
                  </th>

                  <th className="px-6 py-4 text-gray-500 dark:!text-white">
                    Manager
                  </th>

                  <th className="px-6 py-4 text-gray-500 dark:!text-white">
                    Users
                  </th>

                  <th className="px-6 py-4 text-gray-500 dark:!text-white">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-gray-500 dark:!text-white">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-sm">
                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-8 text-center text-gray-500 dark:!text-white"
                    >
                      Loading branches...
                    </td>
                  </tr>
                ) : branches.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-8 text-center text-gray-500 dark:!text-white"
                    >
                      No branches found.
                    </td>
                  </tr>
                ) : (
                  branches.map((branch) => (
                    <tr
                      key={branch.id}
                      className="transition hover:bg-gray-50/50"
                    >
                      {/* Branch Name & Icon */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg border border-gray-200 bg-gray-100 p-2 text-gray-600">
                            {branch.type === "Service Center" ? (
                              <LuCompass className="text-lg" />
                            ) : (
                              <FaStore className="text-lg" />
                            )}
                          </div>

                          <span className="font-semibold text-gray-800 dark:!text-white">
                            {branch.name}
                          </span>
                        </div>
                      </td>

                      {/* Code */}
                      <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:!text-white">
                        {branch.code}
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4 text-gray-600 dark:!text-white">
                        {branch.location}
                      </td>

                      {/* Type */}
                      <td className="px-6 py-4 text-gray-600 dark:!text-white">
                        {branch.type}
                      </td>

                      {/* Manager */}
                      <td
                        className={`px-6 py-4 ${branch.manager === "Not Assigned"
                            ? "italic text-gray-400 dark:!text-white"
                            : "text-gray-700 dark:!text-white"
                          }`}
                      >
                        {branch.manager}
                      </td>

                      {/* Users */}
                      <td className="px-6 py-4 text-gray-600 dark:!text-white">
                        {branch.users}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${branch.status === "ACTIVE"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-gray-200 text-gray-600"
                            }`}
                        >
                          {branch.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button className="rounded-md p-1.5 text-gray-400 transition hover:text-gray-600 dark:!text-white">
                          <FiMoreVertical className="text-lg" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {/* 
      <div className="flex items-center justify-between border-t border-gray-100 p-4 text-xs text-gray-500">
        <span>
          Showing 1–{branches.length} of {totalCount} branches
        </span>

        <div className="flex items-center gap-1">
          <button className="rounded border border-gray-200 p-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-50">
            <FiChevronLeft className="text-base" />
          </button>

          <button className="rounded border border-gray-200 p-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-50">
            <FiChevronRight className="text-base" />
          </button>
        </div>
      </div>
      */}
        </div>
      </div>
    </FadeUp>
  );
}