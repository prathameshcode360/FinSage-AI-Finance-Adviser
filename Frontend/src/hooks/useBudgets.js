// src/hooks/useBudgets.js
import { useState, useEffect, useCallback } from "react";
import budgetService from "../services/budget.service";

export const useBudgets = (initialMonth = null) => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [month, setMonth] = useState(initialMonth);

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await budgetService.getBudgets(month);
      setBudgets(data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      setError("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const addBudget = async (data) => {
    try {
      const newBudget = await budgetService.createBudget(data);
      setBudgets((prev) => [...prev, newBudget]);
      return { success: true, budget: newBudget };
    } catch (error) {
      console.error("Error adding budget:", error);
      return { success: false, error: "Failed to add budget" };
    }
  };

  const updateBudget = async (id, data) => {
    try {
      const updated = await budgetService.updateBudget(id, data);
      setBudgets((prev) => prev.map((b) => (b.id === id ? updated : b)));
      return { success: true, budget: updated };
    } catch (error) {
      console.error("Error updating budget:", error);
      return { success: false, error: "Failed to update budget" };
    }
  };

  const deleteBudget = async (id) => {
    try {
      await budgetService.deleteBudget(id);
      setBudgets((prev) => prev.filter((b) => b.id !== id));
      return { success: true };
    } catch (error) {
      console.error("Error deleting budget:", error);
      return { success: false, error: "Failed to delete budget" };
    }
  };

  return {
    budgets,
    loading,
    error,
    month,
    setMonth,
    addBudget,
    updateBudget,
    deleteBudget,
    refresh: fetchBudgets,
  };
};
