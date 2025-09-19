import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import FileUpload from './components/FileUpload';
import { getTransactions, getTransactionSummary, testConnection } from './services/api.js';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [error, setError] = useState(null);
  const [backendConnected, setBackendConnected] = useState(false);
  const [skipFetchOnce, setSkipFetchOnce] = useState(true);

  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      await testConnection();
      setBackendConnected(true);
      fetchData();
    } catch (error) {
      setBackendConnected(false);
      setError('Cannot connect to backend server. Make sure the server is running on http://localhost:5000');
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [transactionsData, summaryData] = await Promise.all([
        getTransactions(),
        getTransactionSummary()
      ]);
      setTransactions(transactionsData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUploadSuccess = (uploadResult) => {
    if (skipFetchOnce) {
      // Clear previous data on first upload success to start fresh
      setTransactions([]);
      setSummary(null);
      setSkipFetchOnce(false);
    }
    // Always refetch data from API after upload to ensure consistency
    fetchData();
    // Auto-redirect to dashboard after 2 seconds
    setTimeout(() => {
      setActiveTab('dashboard');
    }, 2000);
  };

  if (!backendConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Backend Not Connected</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={checkBackendConnection}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry Connection
          </button>
          <div className="mt-6 text-left bg-gray-100 p-4 rounded text-sm">
            <h4 className="font-bold mb-2">To start the backend:</h4>
            <code className="block">cd server</code>
            <code className="block">npm install</code>
            <code className="block">npm start</code>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">AI Finance Tracker</h1>
              <div className="ml-4 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-500">Connected</span>
              </div>
            </div>
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === 'dashboard'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
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
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === 'upload'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Upload Statement
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' ? (
          <Dashboard transactions={transactions} summary={summary} onTransactionUpdate={fetchData} />
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
