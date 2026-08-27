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

      // Your API Endpoint
      const response = await fetch(`/api/branches?${queryParams.toString()}`);
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
    <FadeUp className="p-6 bg-gray-50">
      <div>

        {/* Filter Component */}
        <SearchFilters onFilterChange={handleFilterChange} />

        {/* Table Container */}
        <div className="bg-white rounded-xl border border-dashed border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  <th className="py-4 px-6">Branch</th>
                  <th className="py-4 px-6">Code</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Type</th>
                  <th className="py-4 px-6">Manager</th>
                  <th className="py-4 px-6">Users</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500">
                      Loading branches...
                    </td>
                  </tr>
                ) : branches.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500">
                      No branches found.
                    </td>
                  </tr>
                ) : (
                  branches.map((branch) => (
                    <tr key={branch.id} className="hover:bg-gray-50/50 transition">
                      {/* Name & Icon */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-600">
                            {branch.type === 'Service Center' ? (
                              <LuCompass className="text-lg" />
                            ) : (
                              <FaStore  className="text-lg" />
                            )}
                          </div>
                          <span className="font-semibold text-gray-800">{branch.name}</span>
                        </div>
                      </td>

                      {/* Code */}
                      <td className="py-4 px-6 text-gray-500 font-mono text-xs">{branch.code}</td>

                      {/* Location */}
                      <td className="py-4 px-6 text-gray-600">{branch.location}</td>

                      {/* Type */}
                      <td className="py-4 px-6 text-gray-600">{branch.type}</td>

                      {/* Manager */}
                      <td className={`py-4 px-6 ${branch.manager === 'Not Assigned' ? 'italic text-gray-400' : 'text-gray-700'}`}>
                        {branch.manager}
                      </td>

                      {/* Users */}
                      <td className="py-4 px-6 text-gray-600">{branch.users}</td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                            branch.status === 'ACTIVE'
                              ? 'bg-blue-50 text-blue-600'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {branch.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md">
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
          {/* <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Showing 1–{branches.length} of {totalCount} branches</span>
            <div className="flex items-center gap-1">
              <button className="p-1.5 border border-gray-200 rounded hover:bg-gray-50 text-gray-600 disabled:opacity-50">
                <FiChevronLeft className="text-base" />
              </button>
              <button className="p-1.5 border border-gray-200 rounded hover:bg-gray-50 text-gray-600 disabled:opacity-50">
                <FiChevronRight className="text-base" />
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </FadeUp >
  );
}