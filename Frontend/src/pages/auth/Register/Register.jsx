// src/pages/auth/Register/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Button from "../../../components/common/Button/Button";
import Input from "../../../components/common/Input/Input";
import styles from "./Register.module.css";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const result = await register(
      formData.name,
      formData.email,
      formData.password,
    );

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
            <h2 className={styles.title}>Create Account</h2>
            <p className={styles.subtitle}>
              Start managing your finances today
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
              {errors.general && (
                <div className={styles.errorMessage}>{errors.general}</div>
              )}

              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                error={errors.name}
                required
              />

              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                error={errors.email}
                required
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                error={errors.password}
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                error={errors.confirmPassword}
                required
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
                disabled={loading}>
                Create Account
              </Button>
            </form>

            <div className={styles.footer}>
              <p className={styles.text}>
                Already have an account?{" "}
                <Link to="/login" className={styles.link}>
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.illustration}>
            <div className={styles.illustrationContent}>
              <span className={styles.illustrationIcon}>🚀</span>
              <h2 className={styles.illustrationTitle}>
                Take Control of Your Finances
              </h2>
              <p className={styles.illustrationText}>
                Join thousands of users who use FinSage to track spending,
                create budgets, and get AI-powered financial advice.
              </p>
              <div className={styles.features}>
                <div className={styles.feature}>
                  <span>✅</span>
                  <span>Free to Start</span>
                </div>
                <div className={styles.feature}>
                  <span>🔒</span>
                  <span>Secure & Private</span>
                </div>
                <div className={styles.feature}>
                  <span>🧠</span>
                  <span>AI-Powered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
