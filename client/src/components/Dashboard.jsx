import React from 'react';
import SummaryCards from './SummaryCards';
import TransactionTable from './TransactionTable';
import Charts from './Charts';

const Dashboard = ({ transactions, summary, onTransactionUpdate }) => {
    if (!summary) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <SummaryCards summary={summary} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Charts summary={summary} />
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Recent Activity
                    </h3>
                    <div className="space-y-3">
                        {transactions.slice(0, 5).map((transaction) => (
                            <div
                                key={transaction._id}
                                className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                            >
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {transaction.description}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(transaction.date).toLocaleDateString()} · {transaction.category}
                                    </p>
                                </div>
                                <span
                                    className={`text-sm font-medium ${transaction.type === 'income'
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                        }`}
                                >
                                    {transaction.type === 'income' ? '+' : '-'}$
                                    {Math.abs(transaction.amount).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <TransactionTable
                transactions={transactions}
                onTransactionUpdate={onTransactionUpdate}
            />
        </div>
    );
};

export default Dashboard;
