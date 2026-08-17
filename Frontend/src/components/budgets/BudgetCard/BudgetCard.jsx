// src/components/budgets/BudgetCard/BudgetCard.jsx
import React from "react";
import { formatCurrency } from "../../../utils/formatCurrency.js";
import { getStatusColor, getStatusLabel } from "../../../utils/calculations.js";
import Button from "../../common/Button/Button";
import styles from "./BudgetCard.module.css";

const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const {
    category,
    amount,
    spent = 0,
    remaining = 0,
    utilization_percentage = 0,
  } = budget;

  const utilization = Number(utilization_percentage) || 0;

  const status =
    utilization >= 100
      ? "over-budget"
      : utilization >= 90
        ? "near-limit"
        : utilization >= 70
          ? "moderate"
          : "healthy";

  const statusColor = getStatusColor(status);
  const statusLabel = getStatusLabel(status);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.category}>{category}</h3>
        <div className={styles.actions}>
          <Button size="small" variant="ghost" onClick={() => onEdit(budget)}>
            ✏️
          </Button>
          <Button
            size="small"
            variant="ghost"
            onClick={() => onDelete(budget.id)}>
            🗑️
          </Button>
        </div>
      </div>

      <div className={styles.amounts}>
        <div className={styles.amountItem}>
          <span className={styles.amountLabel}>Budget</span>
          <span className={styles.amountValue}>{formatCurrency(amount)}</span>
        </div>
        <div className={styles.amountItem}>
          <span className={styles.amountLabel}>Spent</span>
          <span className={styles.amountValue}>{formatCurrency(spent)}</span>
        </div>
        <div className={styles.amountItem}>
          <span className={styles.amountLabel}>Remaining</span>
          <span
            className={styles.amountValue}
            style={{
              color: remaining < 0 ? "var(--danger)" : "var(--success)",
            }}>
            {formatCurrency(remaining)}
          </span>
        </div>
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${Math.min(utilization, 100)}%`,
              backgroundColor: statusColor,
            }}
          />
        </div>
        <div className={styles.progressInfo}>
          <span className={styles.utilization}>
            {utilization.toFixed(0)}% used
          </span>
          <span className={`${styles.status} ${styles[status]}`}>
            {statusLabel}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
