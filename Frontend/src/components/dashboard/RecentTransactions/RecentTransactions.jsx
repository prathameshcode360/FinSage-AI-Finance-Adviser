// src/components/dashboard/RecentTransactions/RecentTransactions.jsx
import React from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate } from "../../../utils/formatDate";
import styles from "./RecentTransactions.module.css";

const RecentTransactions = ({ transactions, loading }) => {
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>Recent Transactions</h3>
        </div>
        <div className={styles.list}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`${styles.item} ${styles.skeleton}`}>
              <div className={styles.skeletonIcon}></div>
              <div className={styles.skeletonInfo}>
                <div className={styles.skeletonText}></div>
                <div className={styles.skeletonText}></div>
              </div>
              <div className={styles.skeletonAmount}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>Recent Transactions</h3>
          <Link to="/transactions" className={styles.viewAll}>
            View All →
          </Link>
        </div>
        <div className={styles.empty}>
          <p>No transactions yet. Start tracking your finances!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Recent Transactions</h3>
        <Link to="/transactions" className={styles.viewAll}>
          View All →
        </Link>
      </div>
      <div className={styles.list}>
        {transactions.slice(0, 5).map((transaction) => (
          <div key={transaction.id} className={styles.item}>
            <div className={styles.icon}>
              {transaction.type === "income" ? "📈" : "💳"}
            </div>
            <div className={styles.info}>
              <div className={styles.description}>
                {transaction.description || transaction.category}
              </div>
              <div className={styles.meta}>
                <span className={styles.category}>{transaction.category}</span>
                <span className={styles.date}>
                  {formatDate(transaction.date)}
                </span>
              </div>
            </div>
            <div
              className={`${styles.amount} ${
                transaction.type === "income" ? styles.income : styles.expense
              }`}>
              {transaction.type === "income" ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
