// resources/js/components/DataTable.tsx
// Reusable DataTable component — TypeScript friendly.
// If you still see "Cannot find namespace 'JSX'", follow the project-level steps below.

import React, { useState, useMemo } from "react";

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  // Use React.ReactNode so we don't rely on global JSX namespace
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  initialSort?: keyof T;
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchKeys = [],
  initialSort,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof T | null>(initialSort ?? null);
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = useMemo(() => {
    let rows = [...data];

    // SEARCH FILTER
    if (search.trim() !== "") {
      rows = rows.filter((row) =>
        searchKeys.some((key) =>
          String(row[key] ?? "")
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      );
    }

    // SORTING
    if (sortKey) {
      rows.sort((a, b) => {
        const va = a[sortKey];
        const vb = b[sortKey];

        // handle null/undefined safely
        if (va == null && vb == null) return 0;
        if (va == null) return sortAsc ? -1 : 1;
        if (vb == null) return sortAsc ? 1 : -1;

        // compare strings/numbers/dates
        if (typeof va === "string" && typeof vb === "string") {
          return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
        }

        if (va < vb) return sortAsc ? -1 : 1;
        if (va > vb) return sortAsc ? 1 : -1;
        return 0;
      });
    }

    return rows;
  }, [data, search, sortKey, sortAsc, searchKeys]);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div className="w-full">
      {/* SEARCH BAR */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <input
          className="w-64 px-3 py-2 border rounded-lg text-gray-700 bg-white"
          placeholder="Cari..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <span className="text-sm text-gray-500">
          {filtered.length} dari {data.length} item
        </span>
      </div>

      {/* TABLE */}
      <table className="w-full bg-white">
        <thead className="bg-gray-100 text-gray-700 text-sm border-b">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="p-3 cursor-pointer select-none"
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {sortKey === col.key && <span>{sortAsc ? "▲" : "▼"}</span>}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 text-gray-800">
          {filtered.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50 transition">
              {columns.map((col) => (
                <td key={String(col.key)} className="p-3 align-top">
                  {col.render ? col.render(row) : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}

          {filtered.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="text-center p-6 text-gray-500">
                Tidak ada data.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
