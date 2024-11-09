'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface Column {
  key: string;
  label: string;
}

interface TableProps<T> {
  columns: Column[];
  data: T[];
  role: 'Admin' | 'Doctor' | 'LabTechnician';
}

const Table = <T extends { id: number }>({
  columns,
  data = [],
  role,
}: TableProps<T>) => {
  const router = useRouter(); // Move useRouter to the top of the component
  const [searchTerm, setSearchTerm] = useState('');
  const [isMounted, setIsMounted] = useState(false); // Track client-side rendering

  useEffect(() => {
    setIsMounted(true); // Set to true after mounting, confirming client-side render
  }, []);

  const filteredData = Array.isArray(data)
    ? data.filter((row) =>
        columns.some((column) => {
          const value = (row as Record<string, unknown>)[column.key];
          return (
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          );
        })
      )
    : [];

  const handleViewClick = (id: number) => {
    let path = '';

    switch (role) {
      case 'Admin':
        path = `/Dashboard/Patient/${id}`;
        break;
      case 'Doctor':
        path = `/Doctor/${id}`;
        break;
      case 'LabTechnician':
        path = `/lab/patients/${id}`;
        break;
      default:
        path = '/';
    }

    router.push(path); // Navigate to the dynamic path
  };

  // Only render the table if `isMounted` is true, ensuring client-side rendering
  if (!isMounted) return null;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Data Table</h2>

      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
      />

      <div className="overflow-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="py-2 px-4 border-b">
                  {column.label}
                </th>
              ))}
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="py-2 px-4 border-b text-center"
                    >
                      {row[column.key as keyof T] !== undefined
                        ? (row[column.key as keyof T] as ReactNode)
                        : '-'}
                    </td>
                  ))}
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      onClick={() => handleViewClick(row.id)}
                      className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-1 rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="text-center py-4 text-gray-500"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
