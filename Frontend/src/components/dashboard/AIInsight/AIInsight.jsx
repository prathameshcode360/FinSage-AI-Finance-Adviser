// src/components/dashboard/AIInsight/AIInsight.jsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "./AIInsight.module.css";

const AIInsight = ({ insight, loading }) => {
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.icon}>🧠</span>
          <h3 className={styles.title}>FinSage Insight</h3>
        </div>
        <div className={styles.skeleton}>
          <div className={styles.skeletonText}></div>
          <div className={styles.skeletonText}></div>
        </div>
      </div>
    );
  }

  if (!insight) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.icon}>🧠</span>
          <h3 className={styles.title}>FinSage Insight</h3>
        </div>
        <div className={styles.empty}>
          <p>
            No insights available yet. Add more transactions to get started.
          </p>
        </div>
        <Link to="/ai-assistant" className={styles.askButton}>
          Ask FinSage →
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.icon}>🧠</span>
        <h3 className={styles.title}>FinSage Insight</h3>
      </div>
      <div className={styles.content}>
        <p className={styles.insight}>{insight.insight}</p>
        {insight.recommendation && (
          <p className={styles.recommendation}>💡 {insight.recommendation}</p>
        )}
        {insight.type && (
          <div className={`${styles.badge} ${styles[insight.type]}`}>
            {insight.type === "warning" && "⚠️ Attention Needed"}
            {insight.type === "action" && "🎯 Action Required"}
            {insight.type === "positive" && "✅ On Track"}
            {insight.type === "info" && "ℹ️ Information"}
          </div>
        )}
      </div>
      <Link to="/ai-assistant" className={styles.askButton}>
        Ask FinSage →
      </Link>
    </div>
  );
};

export default AIInsight;
