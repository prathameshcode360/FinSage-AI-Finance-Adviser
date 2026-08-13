// src/pages/Analytics/Analytics.jsx
import React, { useState, useEffect } from "react";
import analyticsService from "../../services/analytics.service";
import MonthlyTrendChart from "../../components/charts/MonthlyTrendChart/MonthlyTrendChart";
import CategoryBreakdownChart from "../../components/charts/CategoryBreakdownChart/CategoryBreakdownChart";
import IncomeExpenseChart from "../../components/charts/IncomeExpenseChart/IncomeExpenseChart";
import { formatCurrency } from "../../utils/formatCurrency";
import styles from "./Analytics.module.css";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [incomeExpenseData, setIncomeExpenseData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  useEffect(() => {
    fetchAnalytics();
  }, [selectedMonth]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [year, month] = selectedMonth.split("-").map(Number);
      const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
      const endDate = new Date(year, month, 0).toISOString().split("T")[0];

      const [summaryData, trendData, categoryData, trendDetailData] =
        await Promise.all([
          analyticsService.getSummary(startDate, endDate),
          analyticsService.getMonthlyTrend(year, month),
          analyticsService.getCategoryBreakdown(startDate, endDate),
          analyticsService.getMonthlyTrend(year, month),
        ]);

      setSummary(summaryData.summary);
      setMonthlyTrend(trendData);
      setCategoryBreakdown(categoryData);
      setIncomeExpenseData(trendDetailData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const getMonthOptions = () => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const label = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
      options.push({ value, label });
    }
    return options;
  };

  return (
    <div className={styles.analytics}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Analytics</h1>
          <p className={styles.subtitle}>Deep dive into your financial data</p>
        </div>
        <select
          value={selectedMonth}
          onChange={handleMonthChange}
          className={styles.monthSelect}>
          {getMonthOptions().map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.skeleton}></div>
          <div className={styles.skeleton}></div>
          <div className={styles.skeleton}></div>
        </div>
      ) : (
        <>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Total Income</span>
              <span className={`${styles.summaryValue} ${styles.income}`}>
                {formatCurrency(summary?.totalIncome || 0)}
              </span>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Total Expenses</span>
              <span className={`${styles.summaryValue} ${styles.expense}`}>
                {formatCurrency(summary?.totalExpenses || 0)}
              </span>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Balance</span>
              <span className={styles.summaryValue}>
                {formatCurrency(summary?.balance || 0)}
              </span>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Transactions</span>
              <span className={styles.summaryValue}>
                {summary?.transactionCount || 0}
              </span>
            </div>
          </div>

          <div className={styles.chartsGrid}>
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Monthly Trend</h3>
              <MonthlyTrendChart data={monthlyTrend} loading={loading} />
            </div>
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Income vs Expenses</h3>
              <IncomeExpenseChart data={incomeExpenseData} loading={loading} />
            </div>
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Category Breakdown</h3>
              <CategoryBreakdownChart
                data={categoryBreakdown}
                loading={loading}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
