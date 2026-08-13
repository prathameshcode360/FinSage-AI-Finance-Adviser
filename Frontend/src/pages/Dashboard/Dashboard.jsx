// src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import SummaryCards from "../../components/dashboard/SummaryCards/SummaryCards";
import RecentTransactions from "../../components/dashboard/RecentTransactions/RecentTransactions";
import SpendingOverview from "../../components/dashboard/SpendingOverview/SpendingOverview";
import AIInsight from "../../components/dashboard/AIInsight/AIInsight";
import MonthlyTrendChart from "../../components/charts/MonthlyTrendChart/MonthlyTrendChart";
import transactionService from "../../services/transaction.service";
import analyticsService from "../../services/analytics.service";
import aiService from "../../services/ai.service";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [insight, setInsight] = useState(null);
  const [insightLoading, setInsightLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Get current month date range
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          .toISOString()
          .split("T")[0];
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
          .toISOString()
          .split("T")[0];

        // Fetch all data in parallel
        const [summaryData, transactionsData, trendData, categoryData] =
          await Promise.all([
            analyticsService.getSummary(startDate, endDate),
            transactionService.getTransactions({ limit: 10 }),
            analyticsService.getMonthlyTrend(
              now.getFullYear(),
              now.getMonth() + 1,
            ),
            analyticsService.getCategoryBreakdown(startDate, endDate),
          ]);

        setSummary(summaryData.summary);
        setTransactions(transactionsData);
        setMonthlyTrend(trendData);
        setCategoryBreakdown(categoryData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        setInsightLoading(true);
        const data = await aiService.getInsight();
        setInsight(data);
      } catch (error) {
        console.error("Error fetching AI insight:", error);
      } finally {
        setInsightLoading(false);
      }
    };

    fetchInsight();
  }, []);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>
          Welcome back{user?.name ? `, ${user.name}` : ""}! Here's your
          financial overview.
        </p>
      </div>

      <div className={styles.summarySection}>
        <SummaryCards summary={summary} loading={loading} />
      </div>

      <div className={styles.grid}>
        <div className={styles.gridLeft}>
          <div className={styles.chartCard}>
            <h3 className={styles.cardTitle}>Monthly Trend</h3>
            <MonthlyTrendChart data={monthlyTrend} loading={loading} />
          </div>
          <div className={styles.chartCard}>
            <RecentTransactions transactions={transactions} loading={loading} />
          </div>
        </div>
        <div className={styles.gridRight}>
          <div className={styles.chartCard}>
            <SpendingOverview data={categoryBreakdown} loading={loading} />
          </div>
          <div className={styles.chartCard}>
            <AIInsight insight={insight} loading={insightLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
