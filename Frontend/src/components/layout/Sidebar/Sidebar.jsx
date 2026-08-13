// src/components/layout/Sidebar/Sidebar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/dashboard", icon: "📊", label: "Dashboard" },
    { to: "/transactions", icon: "💳", label: "Transactions" },
    { to: "/budgets", icon: "💰", label: "Budgets" },
    { to: "/analytics", icon: "📈", label: "Analytics" },
    { to: "/ai-assistant", icon: "🤖", label: "AI Assistant" },
    { to: "/profile", icon: "👤", label: "Profile" },
  ];

  return (
    <>
      <button
        className={styles.mobileToggle}
        onClick={() => setIsMobileOpen(!isMobileOpen)}>
        {isMobileOpen ? "✕" : "☰"}
      </button>

      <nav className={`${styles.sidebar} ${isMobileOpen ? styles.open : ""}`}>
        <div className={styles.brand}>
          <span className={styles.logo}>🧠</span>
          <span className={styles.brandName}>FinSage</span>
          <span className={styles.brandTagline}>AI Finance Adviser</span>
        </div>

        <div className={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ""}`
              }
              onClick={() => setIsMobileOpen(false)}>
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className={styles.footer}>
          {user && (
            <div className={styles.userInfo}>
              <div className={styles.userName}>{user.name}</div>
              <div className={styles.userEmail}>{user.email}</div>
            </div>
          )}
          <button className={styles.logoutButton} onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </nav>

      {isMobileOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
