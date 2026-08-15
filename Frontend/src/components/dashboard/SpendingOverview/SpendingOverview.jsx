// src/components/dashboard/SpendingOverview/SpendingOverview.jsx
import React from "react";
import { formatCurrency } from "../../../utils/formatCurrency";
import styles from "./SpendingOverview.module.css";

const SpendingOverview = ({ data, loading }) => {
  if (loading) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Spending Overview</h3>
        <div className={styles.skeleton}>
          <div className={styles.skeletonBar}></div>
          <div className={styles.skeletonBar}></div>
          <div className={styles.skeletonBar}></div>
          <div className={styles.skeletonBar}></div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Spending Overview</h3>
        <div className={styles.empty}>
          <p>No spending data available</p>
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + parseFloat(item.amount), 0);

  const colors = [
    "#0ea5e9",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Spending Overview</h3>

      <div className={styles.bars}>
        {data.slice(0, 6).map((item, index) => {
          const amount = parseFloat(item.amount);
          const percentage = total > 0 ? (amount / total) * 100 : 0;

          return (
            <div key={item.category} className={styles.barGroup}>
              <div className={styles.barLabel}>
                <span className={styles.categoryName}>{item.category}</span>

                <span className={styles.amount}>{formatCurrency(amount)}</span>
              </div>

              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{
                    width: `${Math.min(percentage, 100)}%`,
                    backgroundColor: colors[index % colors.length],
                  }}
                />
              </div>

              <div className={styles.percentage}>{percentage.toFixed(0)}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpendingOverview;
