import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from Next.js

interface Column {
  key: string;
  label: string;
}

interface Referral {
  id: number;
  patient: {
    first_name: string;
    last_name: string;
  };
  test_type: string;
  lab_name: string;
}

interface TableProps {
  columns: Column[];
  data: Referral[];
  role: 'Admin' | 'Doctor' | 'Lab-technician';
}

const Table = ({ columns, data = [], role }: TableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter(); // Use Next.js router

  const filteredData = data.filter((row) =>
    columns.some((column) => {
      const value = (row as unknown as Record<string, unknown>)[column.key];
      if (column.key === 'patient' && typeof value === 'object' && value !== null) {
        const patient = value as Referral['patient'];
        const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      }
      return typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  const handleViewClick = (id: number) => {
    let path = '';
    switch (role) {
      case 'Admin':
        path = `/Dashboard/Admin/Patient/${id}`;
        break;
      case 'Doctor':
        path = `/Dashboard/Doctor/Patient/${id}`;
        break;
      case 'Lab-technician':
        path = `/Dashboard/Lab-technician/Referral/${id}`;
        break;
      default:
        path = '/';
    }
    router.push(path); // Use Next.js navigation
  };

  const getCellValue = (
    value: string | number | { first_name: string; last_name: string }
  ): React.ReactNode => {
    if (typeof value === 'object' && value !== null && 'first_name' in value && 'last_name' in value) {
      return `${value.first_name} ${value.last_name}`;
    }
    return value ?? '-';
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
              filteredData.map((row) => (
                <tr key={row.id}>
                  {columns.map((column) => (
                    <td key={column.key} className="py-2 px-4 border-b text-center">
                      {getCellValue(row[column.key as keyof Referral])}
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
                <td colSpan={columns.length + 1} className="text-center py-4 text-gray-500">
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
