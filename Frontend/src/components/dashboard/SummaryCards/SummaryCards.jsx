// src/components/dashboard/SummaryCards/SummaryCards.jsx
import React from "react";
import { formatCurrency } from "../../../utils/formatCurrency";
import styles from "./SummaryCards.module.css";

const SummaryCards = ({ summary, loading }) => {
  if (loading) {
    return (
      <div className={styles.grid}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`${styles.card} ${styles.skeleton}`}>
            <div className={styles.skeletonTitle}></div>
            <div className={styles.skeletonValue}></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Balance",
      value: formatCurrency(summary?.balance || 0),
      icon: "💰",
      color: "primary",
    },
    {
      title: "Income",
      value: formatCurrency(summary?.totalIncome || 0),
      icon: "📈",
      color: "success",
    },
    {
      title: "Expenses",
      value: formatCurrency(summary?.totalExpenses || 0),
      icon: "📉",
      color: "danger",
    },
    {
      title: "Transactions",
      value: summary?.transactionCount || 0,
      icon: "🔄",
      color: "info",
    },
  ];

  return (
    <div className={styles.grid}>
      {cards.map((card, index) => (
        <div key={index} className={`${styles.card} ${styles[card.color]}`}>
          <div className={styles.cardHeader}>
            <span className={styles.icon}>{card.icon}</span>
            <span className={styles.title}>{card.title}</span>
          </div>
          <div className={styles.value}>{card.value}</div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
