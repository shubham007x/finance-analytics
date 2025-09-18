import React from 'react';

const SummaryCards = ({ summary }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const cards = [
        {
            title: 'Total Balance',
            value: formatCurrency(summary.netBalance),
            icon: '💰',
            color: summary.netBalance >= 0 ? 'text-green-600' : 'text-red-600',
            bgColor: summary.netBalance >= 0 ? 'bg-green-50' : 'bg-red-50',
            iconBg: summary.netBalance >= 0 ? 'bg-green-100' : 'bg-red-100',
        },
        {
            title: 'Total Income',
            value: formatCurrency(summary.totalIncome),
            icon: '📈',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            iconBg: 'bg-green-100',
        },
        {
            title: 'Total Expenses',
            value: formatCurrency(summary.totalExpenses),
            icon: '📉',
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            iconBg: 'bg-red-100',
        },
        {
            title: 'Transactions',
            value: summary.totalTransactions.toString(),
            icon: '📊',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            iconBg: 'bg-blue-100',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => (
                <div key={index} className={`${card.bgColor} rounded-lg p-6 shadow-sm border`}>
                    <div className="flex items-center">
                        <div className={`${card.iconBg} rounded-md p-3`}>
                            <span className="text-2xl">{card.icon}</span>
                        </div>
                        <div className="ml-4 flex-1">
                            <p className="text-sm font-medium text-gray-600">{card.title}</p>
                            <p className={`text-2xl font-bold ${card.color}`}>
                                {card.value}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;
