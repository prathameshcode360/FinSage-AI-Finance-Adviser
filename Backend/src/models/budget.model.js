// src/models/budget.model.js

const { pool } = require("../config/db");
const { getExactExpenseCategory } = require("../constants/categories");

class Budget {
  static normalizeMonth(month) {
    const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
    if (!monthRegex.test(month)) {
      throw new Error("Invalid month format. Expected YYYY-MM");
    }
    return `${month}-01`;
  }

  static getNextMonthStart(month) {
    const [year, monthNumber] = month.split("-").map(Number);
    let nextYear = year;
    let nextMonth = monthNumber + 1;
    if (nextMonth === 13) {
      nextMonth = 1;
      nextYear++;
    }
    return `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;
  }

  static async create({ userId, category, amount, month }) {
    // Fix: Get exact category match
    const exactCategory = getExactExpenseCategory(category);
    if (!exactCategory) {
      throw new Error("Invalid expense category");
    }

    // Fix: Round amount
    const roundedAmount = Math.round(amount * 100) / 100;
    const budgetMonth = this.normalizeMonth(month);

    const query = `
      INSERT INTO budgets (user_id, category, amount, month)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, category, month)
      DO UPDATE SET amount = $3, updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    const result = await pool.query(query, [
      userId,
      exactCategory,
      roundedAmount,
      budgetMonth,
    ]);
    return result.rows[0];
  }

  static async findByUser(userId, month = null) {
    let query = `SELECT * FROM budgets WHERE user_id = $1`;
    const values = [userId];
    if (month) {
      query += ` AND month = $2`;
      values.push(this.normalizeMonth(month));
    }
    query += ` ORDER BY category`;
    const result = await pool.query(query, values);
    return result.rows;
  }

  static async findById(id, userId) {
    const result = await pool.query(
      `SELECT * FROM budgets WHERE id = $1 AND user_id = $2`,
      [id, userId],
    );
    return result.rows[0];
  }

  static async update(id, userId, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (data.category !== undefined) {
      const exactCategory = getExactExpenseCategory(data.category);
      if (!exactCategory) throw new Error("Invalid expense category");
      fields.push(`category = $${paramCount}`);
      values.push(exactCategory);
      paramCount++;
    }

    if (data.amount !== undefined) {
      const roundedAmount = Math.round(data.amount * 100) / 100;
      fields.push(`amount = $${paramCount}`);
      values.push(roundedAmount);
      paramCount++;
    }

    if (data.month !== undefined) {
      fields.push(`month = $${paramCount}`);
      values.push(this.normalizeMonth(data.month));
      paramCount++;
    }

    if (fields.length === 0) return null;

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    const query = `
      UPDATE budgets
      SET ${fields.join(", ")}
      WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
      RETURNING *
    `;

    values.push(id, userId);
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id, userId) {
    const result = await pool.query(
      `DELETE FROM budgets WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId],
    );
    return result.rows[0];
  }

  static async getBudgetWithSpending(userId, month) {
    const budgetMonth = this.normalizeMonth(month);
    const nextMonthStart = this.getNextMonthStart(month);

    const query = `
      WITH spending AS (
        SELECT category, COALESCE(SUM(amount), 0) AS spent
        FROM transactions
        WHERE user_id = $1 AND type = 'expense'
          AND date >= $2 AND date < $3
        GROUP BY category
      )
      SELECT b.*,
        COALESCE(s.spent, 0) AS spent,
        b.amount - COALESCE(s.spent, 0) AS remaining,
        ROUND((COALESCE(s.spent, 0) * 100 / b.amount), 2) AS utilization_percentage
      FROM budgets b
      LEFT JOIN spending s ON b.category = s.category
      WHERE b.user_id = $1 AND b.month = $4
      ORDER BY b.category
    `;

    const result = await pool.query(query, [
      userId,
      budgetMonth,
      nextMonthStart,
      budgetMonth,
    ]);
    return result.rows;
  }

  // Fix: Check if transactions exist (used by delete and update)
  static async hasTransactions(userId, category, month) {
    const exactCategory = getExactExpenseCategory(category);
    if (!exactCategory) return false;

    const budgetMonth = this.normalizeMonth(month);
    const nextMonthStart = this.getNextMonthStart(month);

    const result = await pool.query(
      `SELECT EXISTS (
        SELECT 1 FROM transactions
        WHERE user_id = $1 AND category = $2 AND type = 'expense'
          AND date >= $3 AND date < $4
      )`,
      [userId, exactCategory, budgetMonth, nextMonthStart],
    );
    return result.rows[0].exists;
  }
}

module.exports = Budget;
