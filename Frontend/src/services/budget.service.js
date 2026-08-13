// src/services/budget.service.js
import api from "./api";

const budgetService = {
  getBudgets: async (month = null) => {
    const url = month ? `/budgets?month=${month}` : "/budgets";
    const response = await api.get(url);
    return response.data.budgets;
  },

  createBudget: async (data) => {
    const response = await api.post("/budgets", data);
    return response.data.budget;
  },

  updateBudget: async (id, data) => {
    const response = await api.put(`/budgets/${id}`, data);
    return response.data.budget;
  },

  deleteBudget: async (id) => {
    const response = await api.delete(`/budgets/${id}`);
    return response.data;
  },
};

export default budgetService;
