// src/components/transactions/TransactionFilters/TransactionFilters.jsx
import React, { useState } from "react";
import Input from "../../common/Input/Input";
import Select from "../../common/Select/Select";
import Button from "../../common/Button/Button";
import { TRANSACTION_TYPES } from "../../../constants/transactionTypes";
import { getAllCategories } from "../../../constants/categories.js";
import styles from "./TransactionFilters.module.css";

const TransactionFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClear = () => {
    setLocalFilters({});
    onClearFilters();
  };

  const typeOptions = [
    { value: "", label: "All Types" },
    { value: TRANSACTION_TYPES.INCOME, label: "Income" },
    { value: TRANSACTION_TYPES.EXPENSE, label: "Expense" },
  ];

  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...getAllCategories().map((cat) => ({ value: cat, label: cat })),
  ];

  return (
    <div className={styles.filters}>
      <div className={styles.row}>
        <div className={styles.field}>
          <Select
            value={localFilters.type || ""}
            onChange={(e) => handleChange("type", e.target.value)}
            options={typeOptions}
          />
        </div>
        <div className={styles.field}>
          <Select
            value={localFilters.category || ""}
            onChange={(e) => handleChange("category", e.target.value)}
            options={categoryOptions}
          />
        </div>
        <div className={styles.field}>
          <Input
            type="date"
            value={localFilters.startDate || ""}
            onChange={(e) => handleChange("startDate", e.target.value)}
            placeholder="Start Date"
          />
        </div>
        <div className={styles.field}>
          <Input
            type="date"
            value={localFilters.endDate || ""}
            onChange={(e) => handleChange("endDate", e.target.value)}
            placeholder="End Date"
          />
        </div>
        <div className={styles.field}>
          <Input
            type="text"
            value={localFilters.search || ""}
            onChange={(e) => handleChange("search", e.target.value)}
            placeholder="Search transactions..."
          />
        </div>
        <div className={styles.actions}>
          <Button variant="secondary" size="small" onClick={handleClear}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;
