import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Charts = ({ summary }) => {
  // Prepare data for category breakdown chart
  const categoryData = {
    labels: Object.keys(summary.categoryBreakdown),
    datasets: [
      {
        label: 'Expenses by Category',
        data: Object.values(summary.categoryBreakdown),
        backgroundColor: [
          '#ef4444', '#f97316', '#eab308', '#22c55e',
          '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for income vs expenses chart
  const incomeExpenseData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        label: 'Amount ($)',
        data: [summary.totalIncome, summary.totalExpenses],
        backgroundColor: ['#22c55e', '#ef4444'],
        borderColor: ['#16a34a', '#dc2626'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="space-y-6">
      {/* Income vs Expenses Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Income vs Expenses
        </h3>
        <div className="h-64">
          <Bar data={incomeExpenseData} options={chartOptions} />
        </div>
      </div>

      {/* Category Breakdown Chart */}
      {Object.keys(summary.categoryBreakdown).length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Expenses by Category
          </h3>
          <div className="h-64">
            <Doughnut data={categoryData} options={doughnutOptions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Charts;
