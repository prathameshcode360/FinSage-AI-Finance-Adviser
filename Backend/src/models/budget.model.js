// src/models/budget.model.js
const { pool } = require("../config/db");

class Budget {
  static async create({ userId, category, amount, month }) {
    const query = `
      INSERT INTO budgets (user_id, category, amount, month)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, category, month) 
      DO UPDATE SET amount = $3, updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const values = [userId, category, amount, month];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByUser(userId, month = null) {
    let query = "SELECT * FROM budgets WHERE user_id = $1";
    const values = [userId];

    if (month) {
      query += " AND month = $2";
      values.push(month);
    }

    query += " ORDER BY category";
    const result = await pool.query(query, values);
    return result.rows;
  }

  static async findById(id, userId) {
    const query = "SELECT * FROM budgets WHERE id = $1 AND user_id = $2";
    const result = await pool.query(query, [id, userId]);
    return result.rows[0];
  }

  static async update(id, userId, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (data.category) {
      fields.push(`category = $${paramCount}`);
      values.push(data.category);
      paramCount++;
    }
    if (data.amount) {
      fields.push(`amount = $${paramCount}`);
      values.push(data.amount);
      paramCount++;
    }
    if (data.month) {
      fields.push(`month = $${paramCount}`);
      values.push(data.month);
      paramCount++;
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    if (fields.length === 0) return null;

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
    const query =
      "DELETE FROM budgets WHERE id = $1 AND user_id = $2 RETURNING *";
    const result = await pool.query(query, [id, userId]);
    return result.rows[0];
  }

  static async getBudgetWithSpending(userId, month) {
    const query = `
      WITH spending AS (
        SELECT 
          category,
          COALESCE(SUM(amount), 0) as spent
        FROM transactions
        WHERE user_id = $1
          AND type = 'expense'
          AND date >= $2
          AND date <= $3
        GROUP BY category
      )
      SELECT 
        b.*,
        COALESCE(s.spent, 0) as spent,
        b.amount - COALESCE(s.spent, 0) as remaining,
        ROUND((COALESCE(s.spent, 0) / b.amount * 100), 2) as utilization_percentage
      FROM budgets b
      LEFT JOIN spending s ON b.category = s.category
      WHERE b.user_id = $1
        AND b.month = $2
      ORDER BY b.category
    `;
    const startDate = `${month}-01`;
    const endDate = new Date(
      new Date(month).getFullYear(),
      new Date(month).getMonth() + 1,
      0,
    )
      .toISOString()
      .split("T")[0];

    const result = await pool.query(query, [userId, startDate, endDate]);
    return result.rows;
  }
}

module.exports = Budget;
