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

  // Get all transactions for a user
  static async findByUser(userId) {
    const query = `
      SELECT *
      FROM transactions
      WHERE user_id = $1
      ORDER BY date DESC, created_at DESC
    `;

    const result = await pool.query(query, [userId]);

    return result.rows;
  }

  // Get recent transactions for AI context
  static async findRecentByUser(userId, limit = 10) {
    const query = `
      SELECT *
      FROM transactions
      WHERE user_id = $1
      ORDER BY date DESC, created_at DESC
      LIMIT $2
    `;

    const result = await pool.query(query, [userId, limit]);

    return result.rows;
  }

  static async findById(id, userId) {
    const query = `
      SELECT *
      FROM transactions
      WHERE id = $1 AND user_id = $2
    `;

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

    if (fields.length === 0) {
      return null;
    }

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
    const query = `
      DELETE FROM transactions
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [id, userId]);

    return result.rows[0];
  }

  static async getSummary(userId, startDate, endDate) {
    const query = `
      SELECT 
        COALESCE(
          SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END),
          0
        ) as total_income,

        COALESCE(
          SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END),
          0
        ) as total_expenses,

        COUNT(*) as transaction_count

      FROM transactions
      WHERE user_id = $1
        AND date >= $2
        AND date <= $3
    `;

    const result = await pool.query(query, [userId, startDate, endDate]);

    return result.rows[0];
  }

  // FIX #2: Monthly trend - now returns MONTHLY aggregated data
  static async getMonthlyTrend(userId, year, month) {
    // For the selected month, get last 6 months of data
    const startYear = year;
    const startMonth = month - 5; // Go back 6 months

    // Build date range for last 6 months
    const startDate = new Date(startYear, startMonth - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of selected month

    const startDateStr = startDate.toISOString().split("T")[0];
    const endDateStr = endDate.toISOString().split("T")[0];

    const query = `
      SELECT 
        DATE_TRUNC('month', date) as month,
        type,
        SUM(amount) as total_amount
      FROM transactions
      WHERE user_id = $1
        AND date >= $2
        AND date <= $3
      GROUP BY DATE_TRUNC('month', date), type
      ORDER BY month
    `;

    const result = await pool.query(query, [userId, startDateStr, endDateStr]);

    // Transform to match frontend expected format
    return result.rows.map((row) => ({
      date: row.month,
      type: row.type,
      total_amount: parseFloat(row.total_amount),
    }));
  }

  // FIX #6: Category breakdown - now includes BOTH income and expense
  static async getCategoryBreakdown(userId, startDate, endDate) {
    const query = `
      SELECT 
        category,
        type,
        SUM(amount) as total_amount
      FROM transactions
      WHERE user_id = $1
        AND date BETWEEN $2 AND $3
      GROUP BY category, type
      ORDER BY type, total_amount DESC
    `;

    const result = await pool.query(query, [userId, startDate, endDate]);

    return result.rows;
  }
}

module.exports = Transaction;
