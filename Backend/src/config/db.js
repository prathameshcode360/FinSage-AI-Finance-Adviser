// src/config/db.js
const { Pool } = require("pg");

// FIX #4: Added SSL configuration for production
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Handle pool errors gracefully
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  // Don't crash the app, just log the error
});

module.exports = { pool };
