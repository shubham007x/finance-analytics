import React, { useState } from 'react';
import { updateTransaction, deleteTransaction } from '../services/api';

const TransactionTable = ({ transactions, onTransactionUpdate }) => {
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [loading, setLoading] = useState(false);

    const categories = [
        'food', 'utilities', 'entertainment', 'transport',
        'healthcare', 'shopping', 'income', 'transfer', 'other'
    ];

    const types = ['expense', 'income', 'transfer'];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(Math.abs(amount));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleEdit = (transaction) => {
        setEditingId(transaction._id);
        setEditData({
            date: new Date(transaction.date).toISOString().split('T')[0],
            amount: Math.abs(transaction.amount),
            description: transaction.description,
            merchant: transaction.merchant,
            category: transaction.category,
            type: transaction.type,
        });
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            await updateTransaction(editingId, {
                ...editData,
                amount: editData.type === 'income' ? editData.amount : -editData.amount,
            });
            setEditingId(null);
            setEditData({});
            onTransactionUpdate();
        } catch (error) {
            console.error('Error updating transaction:', error);
            alert('Failed to update transaction');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditData({});
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                setLoading(true);
                await deleteTransaction(id);
                onTransactionUpdate();
            } catch (error) {
                console.error('Error deleting transaction:', error);
                alert('Failed to delete transaction');
            } finally {
                setLoading(false);
            }
        }
    };

    if (transactions.length === 0) {
        return (
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Transactions
                </h3>
                <div className="text-center py-8">
                    <span className="text-6xl">📊</span>
                    <p className="mt-4 text-gray-500">No transactions found</p>
                    <p className="text-sm text-gray-400">Upload a bank statement to get started</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                    All Transactions ({transactions.length})
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Merchant
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.map((transaction) => (
                            <tr key={transaction._id} className="hover:bg-gray-50">
                                {editingId === transaction._id ? (
                                    // Edit mode
                                    <>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="date"
                                                value={editData.date}
                                                onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                value={editData.description}
                                                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                value={editData.merchant}
                                                onChange={(e) => setEditData({ ...editData, merchant: e.target.value })}
                                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={editData.category}
                                                onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            >
                                                {categories.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={editData.type}
                                                onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            >
                                                {types.map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={editData.amount}
                                                onChange={(e) => setEditData({ ...editData, amount: parseFloat(e.target.value) })}
                                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={handleSave}
                                                    disabled={loading}
                                                    className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    onClick={handleCancel}
                                                    disabled={loading}
                                                    className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                                                >
                                                    ✗
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    // Display mode
                                    <>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatDate(transaction.date)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            <div className="max-w-xs truncate" title={transaction.description}>
                                                {transaction.description}
                                            </div>
                                            {transaction.isEdited && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                                                    Edited
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {transaction.merchant || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${transaction.category === 'income' ? 'bg-green-100 text-green-800' :
                                                    transaction.category === 'food' ? 'bg-orange-100 text-orange-800' :
                                                        transaction.category === 'utilities' ? 'bg-blue-100 text-blue-800' :
                                                            transaction.category === 'entertainment' ? 'bg-purple-100 text-purple-800' :
                                                                transaction.category === 'transport' ? 'bg-indigo-100 text-indigo-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {transaction.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${transaction.type === 'income' ? 'bg-green-100 text-green-800' :
                                                    transaction.type === 'expense' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {transaction.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <span className={
                                                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                            }>
                                                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(transaction)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(transaction._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionTable;
