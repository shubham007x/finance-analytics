
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  }
  return import.meta.env.VITE_API_BASE_URL || 'https://finance-analytics-8zw1.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorJson.error || 'Something went wrong';
    } catch {
      errorMessage = errorText || `HTTP error! status: ${response.status}`;
    }
    throw new Error(errorMessage);
  }
  return response.json();
};

export const getTransactions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const getTransactionSummary = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/summary`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching summary:', error);
    return {
      totalTransactions: 0,
      totalIncome: 0,
      totalExpenses: 0,
      netBalance: 0,
      categoryBreakdown: {},
    };
  }
};

export const updateTransaction = async (id, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

export const deleteTransaction = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'DELETE',
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Test connection to backend
export const testConnection = async () => {
  try {
    const baseUrl = API_BASE_URL.replace('/api', '');
    const response = await fetch(`${baseUrl}/health`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Backend connection failed:', error);
    throw error;
  }
};
