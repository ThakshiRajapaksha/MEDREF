'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Button } from '../components/ui/button'; // Adjust the import path as necessary

interface Column<T> {
  key: string; // Allow nested keys
  label: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  role: 'Admin' | 'Doctor' | 'Lab-technician';
}

// Utility function to resolve nested values
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const Table = <T,>({ columns, data = [], role }: TableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const params = useParams();
  const doctorId = role === 'Doctor' ? params.id : null;

  useEffect(() => {
    console.log('doctorId:', doctorId);
  }, [doctorId]);

  const filteredData = data.filter((row) =>
    columns.some((column) => {
      const value = getNestedValue(row, column.key);
      return (
        typeof value === 'string' &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
  );

  const handleViewClick = (id: number) => {
    let path = '';
    switch (role) {
      case 'Admin':
        path = `/Dashboard/Admin/Patient/${id}`;
        break;
      case 'Doctor':
        if (doctorId) {
          path = `/Dashboard/Doctor/${doctorId}/Patient/${id}`;
        }
        break;
      case 'Lab-technician':
        path = `/Dashboard/Lab-technician/Referral/${id}`;
        break;
      default:
        path = '/';
    }
    console.log('Navigating to:', path);
    router.push(path);
  };

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
              filteredData.map((row, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="py-2 px-4 border-b text-center"
                    >
                      {getNestedValue(row, column.key) || '-'}
                    </td>
                  ))}
                  <td className="py-2 px-4 border-b text-center">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleViewClick((row as any).id)}
                    >
                      View
                    </Button>
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
