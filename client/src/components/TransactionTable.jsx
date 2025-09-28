import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

const TransactionTable = ({ transactions }) => {
  const [sorting, setSorting] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = [
    "food",
    "utilities",
    "entertainment",
    "transport",
    "healthcare",
    "shopping",
    "income",
    "transfer",
    "other",
  ];

  // Format helpers
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(Math.abs(amount));

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // Apply category filter before passing to table
  const filteredData = useMemo(() => {
    if (categoryFilter === "all") return transactions;
    return transactions.filter((t) => t.category === categoryFilter);
  }, [transactions, categoryFilter]);

  // Define table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: "date",
        header: () => "Date",
        cell: (info) => formatDate(info.getValue()),
        enableSorting: false, // Disable sorting for date
      },
      {
        accessorKey: "description",
        header: () => "Description",
        cell: (info) => info.getValue(),
        enableSorting: false, // Disable sorting for description
      },
      {
        accessorKey: "merchant",
        header: () => "Merchant",
        cell: (info) => info.getValue(),
        enableSorting: false, // Disable sorting for merchant
      },
      {
        accessorKey: "category",
        header: () => (
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border rounded px-1 py-0.5 text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        ),
        cell: (info) => info.getValue(),
        enableSorting: false, // Disable sorting for category
      },
      {
        accessorKey: "type",
        header: () => "Type",
        cell: (info) => info.getValue(),
        enableSorting: false, // Disable sorting for type
      },
      {
        accessorKey: "amount",
        header: () => "Amount",
        cell: (info) => (
          <span
            className={
              info.row.original.amount < 0 ? "text-red-600" : "text-green-600"
            }
          >
            {formatCurrency(info.getValue())}
          </span>
        ),
        enableSorting: true, // Enable sorting only for amount
        enableMultiSort: false, // Disable multi-column sorting
        sortDescFirst: false, // Start with ascending sort
      },
    ],
    [categoryFilter]
  );

  // Initialize table
  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: false, // Disable the ability to remove sorting (always keep either asc or desc)
  });

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          All Transactions ({filteredData.length})
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider select-none ${
                      header.column.getCanSort()
                        ? "cursor-pointer hover:bg-gray-100"
                        : "cursor-default"
                    }`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getCanSort() && (
                      <>
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted()] ?? " 🔼"}
                      </>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
