// src/components/common/EmptyState/EmptyState.jsx
import React from "react";
import styles from "./EmptyState.module.css";

const EmptyState = ({
  title = "Nothing to see here",
  description = "Add some data to get started",
  icon = "📭",
  action,
}) => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.icon}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
};

export default EmptyState;
