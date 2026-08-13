// src/services/analytics.service.js
import api from "./api";

const analyticsService = {
  getSummary: async (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    const response = await api.get(`/analytics/summary?${params}`);
    return response.data;
  },

  getMonthlyTrend: async (year, month) => {
    const params = new URLSearchParams();
    if (year) params.append("year", year);
    if (month) params.append("month", month);
    const response = await api.get(`/analytics/monthly?${params}`);
    return response.data.data;
  },

  getCategoryBreakdown: async (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    const response = await api.get(`/analytics/categories?${params}`);
    return response.data.data;
  },
};

export default analyticsService;
