// src/components/transactions/TransactionForm/TransactionForm.jsx
import React, { useState } from "react";
import Input from "../../common/Input/Input";
import Select from "../../common/Select/Select";
import Button from "../../common/Button/Button";
import { TRANSACTION_TYPES } from "../../../constants/transactionTypes";
import { getCategoriesByType } from "../../../constants/categories.js";
import styles from "./TransactionForm.module.css";

const TransactionForm = ({ transaction, onSave, onCancel }) => {
  const isEditing = !!transaction;

  const [formData, setFormData] = useState({
    type: transaction?.type || TRANSACTION_TYPES.EXPENSE,
    amount: transaction?.amount || "",
    category: transaction?.category || "",
    description: transaction?.description || "",
    date: transaction?.date
      ? transaction.date.split("T")[0]
      : new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState({});

  const typeOptions = [
    { value: TRANSACTION_TYPES.INCOME, label: "Income" },
    { value: TRANSACTION_TYPES.EXPENSE, label: "Expense" },
  ];

  const categoryOptions = getCategoriesByType(formData.type).map((cat) => ({
    value: cat,
    label: cat,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "type") {
      setFormData((prev) => ({ ...prev, category: "" }));
    }
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
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
      <div className={styles.row}>
        <div className={styles.field}>
          <Select
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            options={typeOptions}
            required
          />
        </div>
        <div className={styles.field}>
          <Input
            label="Amount"
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
      </div>

      <div className={styles.row}>
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
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            error={errors.date}
            required
          />
        </div>
      </div>

      <div className={styles.field}>
        <Input
          label="Description"
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter description (optional)"
        />
      </div>

      <div className={styles.actions}>
        <Button type="submit" variant="primary">
          {isEditing ? "Update" : "Add"} Transaction
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
