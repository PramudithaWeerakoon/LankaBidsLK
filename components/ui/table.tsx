// Table.tsx
import React from "react";

interface TableProps {
  headers: string[];
  rows: Array<{ [key: string]: React.ReactNode }>;
  editableRow?: number | null;
  onEditableChange?: (key: string, value: any) => void;
  onSave?: () => void;
  onCancel?: () => void;
}

export function Table({ headers, rows, editableRow, onEditableChange, onSave, onCancel }: TableProps) {
  return (
    <div className="overflow-x-auto shadow-lg rounded-lg">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100 border-b border-gray-300">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
            {/* Single Actions column header */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header, colIndex) => (
                <td key={colIndex} className="px-6 py-4 text-sm text-gray-700">
                  {editableRow === rowIndex && onEditableChange ? (
                    typeof row[header] === "string" || typeof row[header] === "number" ? (
                      <input
                        type="text"
                        value={row[header] as string}
                        onChange={(e) => onEditableChange(header, e.target.value)}
                        className="border p-1 w-full"
                      />
                    ) : (
                      row[header]
                    )
                  ) : (
                    row[header]
                  )}
                </td>
              ))}
              <td className="px-6 py-4 text-sm">
                {editableRow === rowIndex ? (
                  <>
                    <button onClick={onSave} className="mr-2 bg-green-500 text-white px-2 py-1 rounded-full">
                      Save
                    </button>
                    <button onClick={onCancel} className="my-1 bg-red-500 text-white px-2 py-1 rounded-full">
                      Cancel
                    </button>
                  </>
                ) : (
                  row["Actions"]
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
