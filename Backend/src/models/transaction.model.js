// src/models/transaction.model.js
const { pool } = require("../config/db");

class Transaction {
  static async create({ userId, type, amount, category, description, date }) {
    const query = `
      INSERT INTO transactions (user_id, type, amount, category, description, date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      userId,
      type,
      amount,
      category,
      description,
      date || new Date(),
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByUser(userId, filters = {}) {
    let query = "SELECT * FROM transactions WHERE user_id = $1";
    const values = [userId];
    let paramCount = 2;

    if (filters.type) {
      query += ` AND type = $${paramCount}`;
      values.push(filters.type);
      paramCount++;
    }

    if (filters.category) {
      query += ` AND category = $${paramCount}`;
      values.push(filters.category);
      paramCount++;
    }

    if (filters.startDate) {
      query += ` AND date >= $${paramCount}`;
      values.push(filters.startDate);
      paramCount++;
    }

    if (filters.endDate) {
      query += ` AND date <= $${paramCount}`;
      values.push(filters.endDate);
      paramCount++;
    }

    if (filters.search) {
      query += ` AND (description ILIKE $${paramCount} OR category ILIKE $${paramCount})`;
      values.push(`%${filters.search}%`);
      paramCount++;
    }

    query += " ORDER BY date DESC, created_at DESC";

    if (filters.limit) {
      query += ` LIMIT $${paramCount}`;
      values.push(filters.limit);
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async findById(id, userId) {
    const query = "SELECT * FROM transactions WHERE id = $1 AND user_id = $2";
    const result = await pool.query(query, [id, userId]);
    return result.rows[0];
  }

  static async update(id, userId, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (data.type) {
      fields.push(`type = $${paramCount}`);
      values.push(data.type);
      paramCount++;
    }
    if (data.amount) {
      fields.push(`amount = $${paramCount}`);
      values.push(data.amount);
      paramCount++;
    }
    if (data.category) {
      fields.push(`category = $${paramCount}`);
      values.push(data.category);
      paramCount++;
    }
    if (data.description !== undefined) {
      fields.push(`description = $${paramCount}`);
      values.push(data.description);
      paramCount++;
    }
    if (data.date) {
      fields.push(`date = $${paramCount}`);
      values.push(data.date);
      paramCount++;
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    if (fields.length === 0) return null;

    const query = `
      UPDATE transactions 
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
      "DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *";
    const result = await pool.query(query, [id, userId]);
    return result.rows[0];
  }

  static async getSummary(userId, startDate, endDate) {
    const query = `
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expenses,
        COUNT(*) as transaction_count
      FROM transactions
      WHERE user_id = $1
        AND date >= $2
        AND date <= $3
    `;
    const result = await pool.query(query, [userId, startDate, endDate]);
    return result.rows[0];
  }

  static async getMonthlyTrend(userId, year, month) {
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = `${year}-${String(month).padStart(2, "0")}-31`;

    const query = `
      SELECT 
        date,
        type,
        SUM(amount) as total_amount
      FROM transactions
      WHERE user_id = $1
        AND date BETWEEN $2 AND $3
      GROUP BY date, type
      ORDER BY date
    `;
    const result = await pool.query(query, [userId, startDate, endDate]);
    return result.rows;
  }

  static async getCategoryBreakdown(userId, startDate, endDate) {
    const query = `
      SELECT 
        category,
        type,
        SUM(amount) as total_amount
      FROM transactions
      WHERE user_id = $1
        AND date BETWEEN $2 AND $3
        AND type = 'expense'
      GROUP BY category, type
      ORDER BY total_amount DESC
    `;
    const result = await pool.query(query, [userId, startDate, endDate]);
    return result.rows;
  }
}

module.exports = Transaction;
