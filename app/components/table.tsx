'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';

interface Column<T> {
  key: string;
  label: string;
  cell?: (value: any, row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  handleViewClick: (id: string) => void;
}

const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const Table = <T,>({ columns, data = [], handleViewClick }: TableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter((item) =>
    columns.some((column) => {
      const value = getNestedValue(item, column.key);
      return (
        typeof value === 'string' &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
  );

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
                      {column.cell
                        ? column.cell(getNestedValue(row, column.key), row)
                        : getNestedValue(row, column.key) || '-'}
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
                  className="py-2 px-4 border-b text-center"
                >
                  No data available
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
