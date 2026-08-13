// src/components/layout/Topbar/Topbar.jsx
import React from "react";
import { useAuth } from "../../../context/AuthContext";
import styles from "./Topbar.module.css";

const Topbar = () => {
  const { user } = useAuth();
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <h1 className={styles.title}>
          Welcome back{user?.name ? `, ${user.name}` : ""}!
        </h1>
        <p className={styles.date}>{currentDate}</p>
      </div>
      <div className={styles.right}>
        <span className={styles.greeting}>👋</span>
      </div>
    </header>
  );
};

export default Topbar;
