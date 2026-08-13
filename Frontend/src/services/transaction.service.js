// src/services/transaction.service.js
import api from "./api";

const transactionService = {
  getTransactions: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    const response = await api.get(`/transactions?${params}`);
    return response.data.transactions;
  },

  createTransaction: async (data) => {
    const response = await api.post("/transactions", data);
    return response.data.transaction;
  },

  updateTransaction: async (id, data) => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data.transaction;
  },

  deleteTransaction: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },
};

export default transactionService;
