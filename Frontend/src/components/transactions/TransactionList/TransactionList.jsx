// src/components/transactions/TransactionList/TransactionList.jsx
import React from "react";
import TransactionItem from "../TransactionItem/TransactionItem";
import EmptyState from "../../common/EmptyState/EmptyState";
import styles from "./TransactionList.module.css";

const TransactionList = ({ transactions, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
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
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <EmptyState
        title="No Transactions Found"
        description="Start tracking your finances by adding your first transaction"
        icon="💳"
      />
    );
  }

  return (
    <div className={styles.list}>
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TransactionList;
