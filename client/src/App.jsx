// client/src/App.js
import React, { useState, useEffect } from 'react';

import Dashboard from './components/Dashboard';
import FileUpload from './components/FileUpload';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [activeTab, setActiveTab] = useState('upload'); // start on upload if no data

  // 🔹 Load data from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    const savedSummary = localStorage.getItem('summary');
    if (savedTransactions && savedSummary) {
      setTransactions(JSON.parse(savedTransactions));
      setSummary(JSON.parse(savedSummary));
      setActiveTab('dashboard'); // auto show dashboard if data exists
    }
  }, []);

  const handleFileUploadSuccess = (uploadResult) => {
    if (uploadResult && uploadResult.transactions) {
      setTransactions(uploadResult.transactions);

      // Calculate summary
      const summary = {
        totalTransactions: uploadResult.transactions.length,
        totalIncome: 0,
        totalExpenses: 0,
        netBalance: 0,
        categoryBreakdown: {},
      };

      uploadResult.transactions.forEach((transaction) => {
        if (transaction.type === 'income') {
          summary.totalIncome += Math.abs(transaction.amount);
        } else if (transaction.type === 'expense') {
          summary.totalExpenses += Math.abs(transaction.amount);
        }

        if (!summary.categoryBreakdown[transaction.category]) {
          summary.categoryBreakdown[transaction.category] = 0;
        }
        if (transaction.type === 'expense') {
          summary.categoryBreakdown[transaction.category] += Math.abs(transaction.amount);
        }
      });

      summary.netBalance = summary.totalIncome - summary.totalExpenses;
      setSummary(summary);

      // 🔹 Save to localStorage
      localStorage.setItem('transactions', JSON.stringify(uploadResult.transactions));
      localStorage.setItem('summary', JSON.stringify(summary));
    }

    // Redirect to dashboard
    setTimeout(() => {
      setActiveTab('dashboard');
    }, 1000);
  };

  // 🔹 Optional: clear data button
  const clearData = () => {
    localStorage.removeItem('transactions');
    localStorage.removeItem('summary');
    setTransactions([]);
    setSummary(null);
    setActiveTab('upload');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">AI Finance Tracker</h1>
            </div>
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                disabled={transactions.length === 0}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeTab === 'dashboard'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  } ${transactions.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Dashboard
                {transactions.length > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                    {transactions.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeTab === 'upload'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Upload Statement
              </button>
              {transactions.length > 0 && (
                <button
                  onClick={clearData}
                  className="ml-4 text-red-600 text-sm hover:underline"
                >
                  Clear Data
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' ? (
          <Dashboard transactions={transactions} summary={summary} />
        ) : (
          <FileUpload
            onUploadSuccess={handleFileUploadSuccess}
            onNavigateToDashboard={() => setActiveTab('dashboard')}
          />
        )}
      </main>
    </div>
  );
}

export default App;
