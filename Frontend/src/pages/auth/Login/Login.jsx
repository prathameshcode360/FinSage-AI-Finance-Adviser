// src/pages/auth/Login/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Button from "../../../components/common/Button/Button";
import Input from "../../../components/common/Input/Input";
import styles from "./Login.module.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setErrors({ general: result.error });
    }

    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.brand}>
            <span className={styles.logo}>🧠</span>
            <h1 className={styles.brandName}>FinSage</h1>
            <p className={styles.tagline}>AI Finance Adviser</p>
          </div>

          <div className={styles.card}>
            <h2 className={styles.title}>Welcome Back</h2>
            <p className={styles.subtitle}>Sign in to access your finances</p>

            <form onSubmit={handleSubmit} className={styles.form}>
              {errors.general && (
                <div className={styles.errorMessage}>{errors.general}</div>
              )}

              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
                disabled={loading}>
                Sign In
              </Button>
            </form>

            <div className={styles.footer}>
              <p className={styles.text}>
                Don't have an account?{" "}
                <Link to="/register" className={styles.link}>
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.illustration}>
            <div className={styles.illustrationContent}>
              <span className={styles.illustrationIcon}>📊</span>
              <h2 className={styles.illustrationTitle}>
                Manage Your Finances Smarter
              </h2>
              <p className={styles.illustrationText}>
                Get personalized AI insights, track your spending, and achieve
                your financial goals with FinSage.
              </p>
              <div className={styles.features}>
                <div className={styles.feature}>
                  <span>💰</span>
                  <span>Track Transactions</span>
                </div>
                <div className={styles.feature}>
                  <span>📈</span>
                  <span>Visual Analytics</span>
                </div>
                <div className={styles.feature}>
                  <span>🧠</span>
                  <span>AI Insights</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
