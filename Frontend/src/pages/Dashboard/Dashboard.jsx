// src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import SummaryCards from "../../components/dashboard/SummaryCards/SummaryCards";
import RecentTransactions from "../../components/dashboard/RecentTransactions/RecentTransactions";
import SpendingOverview from "../../components/dashboard/SpendingOverview/SpendingOverview";
import AIInsight from "../../components/dashboard/AIInsight/AIInsight";
import MonthlyTrendChart from "../../components/charts/MonthlyTrendChart/MonthlyTrendChart";
import { useTransactions } from "../../hooks/useTransactions";
import analyticsService from "../../services/analytics.service";
import aiService from "../../services/ai.service";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [insight, setInsight] = useState(null);
  const [insightLoading, setInsightLoading] = useState(true);

  // UseTransactions hook for transactions
  const { transactions, loading: transactionsLoading } = useTransactions({
    limit: 10,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Get current month date range
        const now = new Date();

        const startDate = `${now.getFullYear()}-${String(
          now.getMonth() + 1,
        ).padStart(2, "0")}-01`;

        const endDate = `${now.getFullYear()}-${String(
          now.getMonth() + 1,
        ).padStart(2, "0")}-${String(
          new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(),
        ).padStart(2, "0")}`;

        // Fetch all data individually to handle failures gracefully
        try {
          const summaryData = await analyticsService.getSummary(
            startDate,
            endDate,
          );
          setSummary(summaryData.summary);
        } catch (error) {
          console.error("Error fetching summary:", error);
          setSummary(null);
        }

        try {
          const trendData = await analyticsService.getMonthlyTrend(
            now.getFullYear(),
            now.getMonth() + 1,
          );
          setMonthlyTrend(trendData);
        } catch (error) {
          console.error("Error fetching monthly trend:", error);
          setMonthlyTrend([]);
        }

        try {
          const categoryData = await analyticsService.getCategoryBreakdown(
            startDate,
            endDate,
          );
          setCategoryBreakdown(categoryData);
        } catch (error) {
          console.error("Error fetching category breakdown:", error);
          setCategoryBreakdown([]);
        }
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
            <RecentTransactions
              transactions={transactions}
              loading={transactionsLoading}
            />
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
