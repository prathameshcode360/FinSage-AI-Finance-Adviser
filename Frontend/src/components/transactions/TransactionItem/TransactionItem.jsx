// src/components/transactions/TransactionItem/TransactionItem.jsx
import React from "react";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate } from "../../../utils/formatDate";
import Button from "../../common/Button/Button";
import styles from "./TransactionItem.module.css";

const TransactionItem = ({ transaction, onEdit, onDelete }) => {
  const isIncome = transaction.type === "income";

  return (
    <div className={styles.item}>
      <div className={styles.icon}>{isIncome ? "📈" : "💳"}</div>
      <div className={styles.info}>
        <div className={styles.description}>
          {transaction.description || transaction.category}
        </div>
        <div className={styles.meta}>
          <span className={styles.category}>{transaction.category}</span>
          <span className={styles.date}>{formatDate(transaction.date)}</span>
        </div>
      </div>
      <div
        className={`${styles.amount} ${isIncome ? styles.income : styles.expense}`}>
        {isIncome ? "+" : "-"}
        {formatCurrency(transaction.amount)}
      </div>
      <div className={styles.actions}>
        <Button
          size="small"
          variant="ghost"
          onClick={() => onEdit(transaction)}>
          ✏️
        </Button>
        <Button
          size="small"
          variant="ghost"
          onClick={() => onDelete(transaction.id)}>
          🗑️
        </Button>
      </div>
    </div>
  );
};

export default TransactionItem;
