// src/pages/Transactions/Transactions.jsx
import React, { useState, useEffect } from "react";
import transactionService from "../../services/transaction.service";
import TransactionList from "../../components/transactions/TransactionList/TransactionList";
import TransactionForm from "../../components/transactions/TransactionForm/TransactionForm";
import Button from "../../components/common/Button/Button";
import Modal from "../../components/common/Modal/Modal";
import styles from "./Transactions.module.css";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await transactionService.getTransactions();

      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      await transactionService.deleteTransaction(id);
      await fetchTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      setError("Failed to delete transaction");
    }
  };

  const handleSaveTransaction = async (data) => {
    try {
      if (editingTransaction) {
        await transactionService.updateTransaction(editingTransaction.id, data);
      } else {
        await transactionService.createTransaction(data);
      }

      setIsModalOpen(false);
      setEditingTransaction(null);

      await fetchTransactions();
    } catch (error) {
      console.error("Error saving transaction:", error);
      setError("Failed to save transaction");
      throw error;
    }
  };

  return (
    <div className={styles.transactions}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Transactions</h1>
          <p className={styles.subtitle}>
            Manage and track all your financial transactions
          </p>
        </div>

        <Button variant="primary" onClick={handleAddTransaction}>
          + Add Transaction
        </Button>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <TransactionList
        transactions={transactions}
        loading={loading}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        title={editingTransaction ? "Edit Transaction" : "Add Transaction"}>
        <TransactionForm
          transaction={editingTransaction}
          onSave={handleSaveTransaction}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingTransaction(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Transactions;
