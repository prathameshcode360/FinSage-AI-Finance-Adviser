// src/hooks/useTransactions.js
import { useState, useEffect, useCallback } from "react";
import transactionService from "../services/transaction.service";

export const useTransactions = (initialFilters = {}) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await transactionService.getTransactions(filters);
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (data) => {
    try {
      const newTransaction = await transactionService.createTransaction(data);
      setTransactions((prev) => [newTransaction, ...prev]);
      return { success: true, transaction: newTransaction };
    } catch (error) {
      console.error("Error adding transaction:", error);
      return { success: false, error: "Failed to add transaction" };
    }
  };

  const updateTransaction = async (id, data) => {
    try {
      const updated = await transactionService.updateTransaction(id, data);
      setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
      return { success: true, transaction: updated };
    } catch (error) {
      console.error("Error updating transaction:", error);
      return { success: false, error: "Failed to update transaction" };
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await transactionService.deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      return { success: true };
    } catch (error) {
      console.error("Error deleting transaction:", error);
      return { success: false, error: "Failed to delete transaction" };
    }
  };

  return {
    transactions,
    loading,
    error,
    filters,
    setFilters,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refresh: fetchTransactions,
  };
};
