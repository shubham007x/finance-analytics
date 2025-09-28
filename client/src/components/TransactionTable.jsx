import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { updateTransaction, deleteTransaction } from "../services/api";

const TransactionTable = ({ transactions, onTransactionUpdate }) => {
  const [sorting, setSorting] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [amountValue, setAmountValue] = useState("");
  const descriptionInputRef = useRef(null);
  const merchantInputRef = useRef(null);
  const categoryInputRef = useRef(null);
  const typeInputRef = useRef(null);
  const amountInputRef = useRef(null);

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

  // Focus on description when editing starts
  useEffect(() => {
    if (editingId && descriptionInputRef.current) {
      descriptionInputRef.current.focus();
    }
  }, [editingId]);

  // Edit handlers
  const handleEdit = (transaction) => {
    setEditingId(transaction._id);
    setEditedData({
      description: transaction.description,
      merchant: transaction.merchant,
      category: transaction.category,
      type: transaction.type,
    });
    setAmountValue(Math.abs(transaction.amount).toString());
  };

  const handleSave = async (id) => {
    try {
      const finalEditedData = {
        ...editedData,
        amount: parseFloat(amountValue) || 0,
      };
      await updateTransaction(id, finalEditedData);
      setEditingId(null);
      setEditedData({});
      setAmountValue("");
      onTransactionUpdate();
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedData({});
    setAmountValue("");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await deleteTransaction(id);
        onTransactionUpdate();
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  // Define table columns
  const columns = [
    {
      accessorKey: "date",
      header: () => "Date",
      cell: (info) => formatDate(info.getValue()),
      enableSorting: false, // Disable sorting for date
    },
    {
      accessorKey: "description",
      header: () => "Description",
      cell: (info) => {
        const isEditing = editingId === info.row.original._id;
        return isEditing ? (
          <input
            ref={descriptionInputRef}
            type="text"
            value={editedData.description || ""}
            onChange={(e) =>
              setEditedData({ ...editedData, description: e.target.value })
            }
            className="w-full px-2 py-1 border rounded text-sm"
          />
        ) : (
          info.getValue()
        );
      },
      enableSorting: false, // Disable sorting for description
    },
    {
      accessorKey: "merchant",
      header: () => "Merchant",
      cell: (info) => {
        const isEditing = editingId === info.row.original._id;
        return isEditing ? (
          <input
            type="text"
            value={editedData.merchant || ""}
            onChange={(e) =>
              setEditedData({ ...editedData, merchant: e.target.value })
            }
            className="w-full px-2 py-1 border rounded text-sm"
          />
        ) : (
          info.getValue()
        );
      },
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
      cell: (info) => {
        const isEditing = editingId === info.row.original._id;
        return isEditing ? (
          <select
            value={editedData.category || ""}
            onChange={(e) =>
              setEditedData({ ...editedData, category: e.target.value })
            }
            className="w-full px-2 py-1 border rounded text-sm"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        ) : (
          info.getValue()
        );
      },
      enableSorting: false, // Disable sorting for category
    },
    {
      accessorKey: "type",
      header: () => "Type",
      cell: (info) => {
        const isEditing = editingId === info.row.original._id;
        return isEditing ? (
          <select
            value={editedData.type || ""}
            onChange={(e) =>
              setEditedData({ ...editedData, type: e.target.value })
            }
            className="w-full px-2 py-1 border rounded text-sm"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        ) : (
          info.getValue()
        );
      },
      enableSorting: false, // Disable sorting for type
    },
    {
      accessorKey: "amount",
      header: () => "Amount",
      cell: (info) => {
        const isEditing = editingId === info.row.original._id;
        return isEditing ? (
          <input
            ref={amountInputRef}
            type="text"
            value={amountValue}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || /^\d*\.?\d*$/.test(value)) {
                const selectionStart = e.target.selectionStart;
                setAmountValue(value);
                // Restore cursor position after state update
                setTimeout(() => {
                  if (amountInputRef.current) {
                    amountInputRef.current.setSelectionRange(
                      selectionStart,
                      selectionStart
                    );
                  }
                }, 0);
              }
            }}
            onFocus={(e) => e.target.select()}
            className="w-full px-2 py-1 border rounded text-sm"
            placeholder="0.00"
            autoFocus
          />
        ) : (
          <span
            className={
              info.row.original.amount < 0 ? "text-red-600" : "text-green-600"
            }
          >
            {formatCurrency(info.getValue())}
          </span>
        );
      },
      enableSorting: true,
      enableMultiSort: false,
      sortDescFirst: false,
    },

    {
      id: "actions",
      header: () => "Actions",
      cell: (info) => {
        const isEditing = editingId === info.row.original._id;
        return (
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => handleSave(info.row.original._id)}
                  className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleEdit(info.row.original)}
                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(info.row.original._id)}
                  className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        );
      },
      enableSorting: false,
    },
  ];

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
      <div className="px-6 py-4 border-b border-gray-200">
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
