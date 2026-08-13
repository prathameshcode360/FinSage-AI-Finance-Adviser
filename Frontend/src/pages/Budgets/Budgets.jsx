// src/pages/Budgets/Budgets.jsx
import React, { useState, useEffect } from "react";
import budgetService from "../../services/budget.service";
import BudgetCard from "../../components/budgets/BudgetCard/BudgetCard";
import BudgetForm from "../../components/budgets/BudgetForm/BudgetForm";
import Button from "../../components/common/Button/Button";
import Modal from "../../components/common/Modal/Modal";
import EmptyState from "../../components/common/EmptyState/EmptyState";
import { getMonthYear } from "../../utils/formatDate";
import styles from "./Budgets.module.css";

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBudgets();
  }, [selectedMonth]);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await budgetService.getBudgets(selectedMonth);
      setBudgets(data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      setError("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBudget = () => {
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const handleDeleteBudget = async (id) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) return;

    try {
      await budgetService.deleteBudget(id);
      await fetchBudgets();
    } catch (error) {
      console.error("Error deleting budget:", error);
      setError("Failed to delete budget");
    }
  };

  const handleSaveBudget = async (data) => {
    try {
      if (editingBudget) {
        await budgetService.updateBudget(editingBudget.id, data);
      } else {
        await budgetService.createBudget(data);
      }
      setIsModalOpen(false);
      setEditingBudget(null);
      await fetchBudgets();
    } catch (error) {
      console.error("Error saving budget:", error);
      setError("Failed to save budget");
      throw error;
    }
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const getMonthOptions = () => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const label = getMonthYear(date.toISOString());
      options.push({ value, label });
    }
    return options;
  };

  return (
    <div className={styles.budgets}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Budgets</h1>
          <p className={styles.subtitle}>Plan and track your spending</p>
        </div>
        <div className={styles.actions}>
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className={styles.monthSelect}>
            {getMonthOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Button variant="primary" onClick={handleAddBudget}>
            + Create Budget
          </Button>
        </div>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.skeleton}></div>
          <div className={styles.skeleton}></div>
          <div className={styles.skeleton}></div>
        </div>
      ) : budgets.length === 0 ? (
        <EmptyState
          title="No Budgets Yet"
          description="Create your first budget to start tracking your spending"
          icon="💰"
          action={
            <Button variant="primary" onClick={handleAddBudget}>
              Create Budget
            </Button>
          }
        />
      ) : (
        <div className={styles.grid}>
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onEdit={handleEditBudget}
              onDelete={handleDeleteBudget}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBudget(null);
        }}
        title={editingBudget ? "Edit Budget" : "Create Budget"}>
        <BudgetForm
          budget={editingBudget}
          month={selectedMonth}
          onSave={handleSaveBudget}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingBudget(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Budgets;
