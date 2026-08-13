// src/components/budgets/BudgetForm/BudgetForm.jsx
import React, { useState } from "react";
import Input from "../../common/Input/Input";
import Select from "../../common/Select/Select";
import Button from "../../common/Button/Button";
import { getAllCategories } from "../../../../constants/categories";
import styles from "./BudgetForm.module.css";

const BudgetForm = ({ budget, month, onSave, onCancel }) => {
  const isEditing = !!budget;

  const [formData, setFormData] = useState({
    category: budget?.category || "",
    amount: budget?.amount || "",
    month: budget?.month || month,
  });

  const [errors, setErrors] = useState({});

  const categoryOptions = getAllCategories().map((cat) => ({
    value: cat,
    label: cat,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    if (!formData.month) {
      newErrors.month = "Month is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = {
      ...formData,
      amount: parseFloat(formData.amount),
    };
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={categoryOptions}
          error={errors.category}
          required
        />
      </div>

      <div className={styles.field}>
        <Input
          label="Budget Amount"
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          min="0.01"
          error={errors.amount}
          required
        />
      </div>

      <div className={styles.field}>
        <Input
          label="Month"
          type="month"
          name="month"
          value={formData.month}
          onChange={handleChange}
          error={errors.month}
          required
        />
      </div>

      <div className={styles.actions}>
        <Button type="submit" variant="primary">
          {isEditing ? "Update" : "Create"} Budget
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default BudgetForm;
