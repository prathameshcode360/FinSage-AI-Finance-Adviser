// seeder.js

require("dotenv").config();

const bcrypt = require("bcrypt");
const { pool } = require("./config/db.js");

// ============================================================
// DEMO USER
// ============================================================

const DEMO_USER = {
  name: "FinSage Demo User",
  email: "demo@finsage.com",
  password: "Demo@123",
};

// ============================================================
// CATEGORIES
// Keep these exactly aligned with frontend categories.js
// ============================================================

const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investments",
  "Rental",
  "Business",
  "Gifts",
  "Other Income",
];

const EXPENSE_CATEGORIES = [
  "Housing",
  "Food & Dining",
  "Transportation",
  "Utilities",
  "Insurance",
  "Healthcare",
  "Entertainment",
  "Shopping",
  "Education",
  "Groceries",
  "Dining Out",
  "Rent",
  "Mortgage",
  "Car",
  "Gas",
  "Phone",
  "Internet",
  "Subscriptions",
  "Clothing",
  "Travel",
  "Other Expenses",
];

// ============================================================
// HELPERS
// ============================================================

function pad(value) {
  return String(value).padStart(2, "0");
}

function dateString(year, month, day) {
  return `${year}-${pad(month)}-${pad(day)}`;
}

function monthString(year, month) {
  return `${year}-${pad(month)}-01`;
}

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomAmount(min, max) {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

function createTransaction(userId, type, amount, category, description, date) {
  return {
    userId,
    type,
    amount,
    category,
    description,
    date,
  };
}

// ============================================================
// TRANSACTION GENERATOR
// ============================================================

function generateTransactions(userId) {
  const transactions = [];

  // ----------------------------------------------------------
  // JUNE 2026
  // ----------------------------------------------------------

  // Income
  transactions.push(
    createTransaction(
      userId,
      "income",
      5200,
      "Salary",
      "Monthly salary",
      dateString(2026, 6, 1),
    ),
  );

  transactions.push(
    createTransaction(
      userId,
      "income",
      850,
      "Freelance",
      "Website development project",
      dateString(2026, 6, 8),
    ),
  );

  transactions.push(
    createTransaction(
      userId,
      "income",
      320,
      "Investments",
      "Investment return",
      dateString(2026, 6, 15),
    ),
  );

  transactions.push(
    createTransaction(
      userId,
      "income",
      450,
      "Rental",
      "Rental income",
      dateString(2026, 6, 28),
    ),
  );

  // Expenses
  const juneExpenses = [
    ["Rent", 1800, "Monthly rent"],
    ["Food & Dining", 420, "Restaurants and food delivery"],
    ["Groceries", 310, "Weekly groceries"],
    ["Transportation", 260, "Public transport and cabs"],
    ["Utilities", 180, "Electricity and water bill"],
    ["Internet", 60, "Monthly internet bill"],
    ["Phone", 45, "Mobile phone bill"],
    ["Entertainment", 280, "Movies and entertainment"],
    ["Shopping", 360, "General shopping"],
    ["Healthcare", 150, "Pharmacy and medical expenses"],
    ["Subscriptions", 95, "Streaming subscriptions"],
    ["Gas", 120, "Fuel expenses"],
    ["Education", 200, "Online course"],
    ["Clothing", 180, "Clothes shopping"],
    ["Travel", 450, "Weekend trip"],
    ["Insurance", 220, "Insurance payment"],
    ["Dining Out", 240, "Dinner with friends"],
    ["Car", 300, "Car maintenance"],
    ["Other Expenses", 120, "Miscellaneous expenses"],
  ];

  juneExpenses.forEach(([category, amount, description], index) => {
    transactions.push(
      createTransaction(
        userId,
        "expense",
        amount,
        category,
        description,
        dateString(2026, 6, (index % 27) + 2),
      ),
    );
  });

  // Additional June transactions
  for (let i = 0; i < 18; i++) {
    const category = randomFrom([
      "Food & Dining",
      "Groceries",
      "Transportation",
      "Entertainment",
      "Shopping",
      "Dining Out",
    ]);

    const amount = randomAmount(25, 180);

    transactions.push(
      createTransaction(
        userId,
        "expense",
        amount,
        category,
        `${category} purchase`,
        dateString(2026, 6, (i % 25) + 3),
      ),
    );
  }

  // ----------------------------------------------------------
  // JULY 2026
  // ----------------------------------------------------------

  transactions.push(
    createTransaction(
      userId,
      "income",
      5200,
      "Salary",
      "Monthly salary",
      dateString(2026, 7, 1),
    ),
  );

  transactions.push(
    createTransaction(
      userId,
      "income",
      1200,
      "Freelance",
      "Freelance development project",
      dateString(2026, 7, 7),
    ),
  );

  transactions.push(
    createTransaction(
      userId,
      "income",
      500,
      "Business",
      "Small business income",
      dateString(2026, 7, 18),
    ),
  );

  transactions.push(
    createTransaction(
      userId,
      "income",
      300,
      "Investments",
      "Investment return",
      dateString(2026, 7, 25),
    ),
  );

  const julyExpenses = [
    ["Rent", 1800, "Monthly rent"],
    ["Food & Dining", 580, "Restaurants and food delivery"],
    ["Groceries", 390, "Monthly groceries"],
    ["Transportation", 330, "Cabs and public transport"],
    ["Utilities", 210, "Electricity and water"],
    ["Internet", 60, "Monthly internet"],
    ["Phone", 45, "Mobile phone bill"],
    ["Entertainment", 430, "Movies, games and outings"],
    ["Shopping", 620, "Shopping expenses"],
    ["Healthcare", 280, "Medical expenses"],
    ["Subscriptions", 110, "Streaming and software subscriptions"],
    ["Gas", 150, "Fuel expenses"],
    ["Education", 250, "Online learning"],
    ["Clothing", 300, "Clothing purchases"],
    ["Travel", 650, "Travel expenses"],
    ["Insurance", 220, "Insurance payment"],
    ["Dining Out", 380, "Restaurant dinners"],
    ["Car", 350, "Car service"],
    ["Other Expenses", 140, "Miscellaneous"],
  ];

  julyExpenses.forEach(([category, amount, description], index) => {
    transactions.push(
      createTransaction(
        userId,
        "expense",
        amount,
        category,
        description,
        dateString(2026, 7, (index % 28) + 2),
      ),
    );
  });

  for (let i = 0; i < 20; i++) {
    const category = randomFrom([
      "Food & Dining",
      "Groceries",
      "Transportation",
      "Entertainment",
      "Shopping",
      "Dining Out",
      "Travel",
    ]);

    const amount = randomAmount(30, 220);

    transactions.push(
      createTransaction(
        userId,
        "expense",
        amount,
        category,
        `${category} purchase`,
        dateString(2026, 7, (i % 27) + 3),
      ),
    );
  }

  // ----------------------------------------------------------
  // AUGUST 2026 - CURRENT MONTH
  // Important for AI testing
  // ----------------------------------------------------------

  transactions.push(
    createTransaction(
      userId,
      "income",
      5200,
      "Salary",
      "Monthly salary",
      dateString(2026, 8, 1),
    ),
  );

  transactions.push(
    createTransaction(
      userId,
      "income",
      900,
      "Freelance",
      "Freelance development project",
      dateString(2026, 8, 5),
    ),
  );

  transactions.push(
    createTransaction(
      userId,
      "income",
      350,
      "Investments",
      "Investment return",
      dateString(2026, 8, 10),
    ),
  );

  // Intentionally high current-month spending
  // so AI can detect overspending.

  const augustExpenses = [
    ["Rent", 1800, "Monthly rent"],
    ["Food & Dining", 620, "Restaurants and food delivery"],
    ["Groceries", 420, "Weekly groceries"],
    ["Transportation", 280, "Cabs and public transport"],
    ["Utilities", 190, "Electricity and water"],
    ["Internet", 60, "Monthly internet"],
    ["Phone", 45, "Mobile phone bill"],
    ["Entertainment", 550, "Movies and entertainment"],
    ["Shopping", 780, "Shopping expenses"],
    ["Healthcare", 120, "Pharmacy"],
    ["Subscriptions", 105, "Streaming subscriptions"],
    ["Gas", 140, "Fuel expenses"],
    ["Education", 180, "Online course"],
    ["Clothing", 320, "Clothing purchase"],
    ["Travel", 700, "Travel booking"],
    ["Insurance", 220, "Insurance payment"],
    ["Dining Out", 460, "Restaurant dinners"],
    ["Car", 300, "Car maintenance"],
    ["Other Expenses", 150, "Miscellaneous expenses"],
  ];

  augustExpenses.forEach(([category, amount, description], index) => {
    transactions.push(
      createTransaction(
        userId,
        "expense",
        amount,
        category,
        description,
        dateString(2026, 8, (index % 13) + 2),
      ),
    );
  });

  // Additional August spending
  for (let i = 0; i < 25; i++) {
    const category = randomFrom([
      "Food & Dining",
      "Groceries",
      "Transportation",
      "Entertainment",
      "Shopping",
      "Dining Out",
      "Travel",
      "Subscriptions",
    ]);

    const amount = randomAmount(25, 250);

    transactions.push(
      createTransaction(
        userId,
        "expense",
        amount,
        category,
        `${category} purchase`,
        dateString(2026, 8, (i % 14) + 1),
      ),
    );
  }

  return transactions;
}

// ============================================================
// BUDGET GENERATOR
// ============================================================

function generateBudgets(userId) {
  const budgets = [];

  const months = [
    {
      year: 2026,
      month: 6,
      budgets: {
        "Food & Dining": 500,
        Groceries: 400,
        Transportation: 500,
        Entertainment: 350,
        Shopping: 500,
        Utilities: 250,
        Healthcare: 300,
        Subscriptions: 150,
        Travel: 600,
        "Dining Out": 300,
      },
    },
    {
      year: 2026,
      month: 7,
      budgets: {
        "Food & Dining": 500,
        Groceries: 450,
        Transportation: 500,
        Entertainment: 400,
        Shopping: 500,
        Utilities: 250,
        Healthcare: 300,
        Subscriptions: 150,
        Travel: 500,
        "Dining Out": 300,
      },
    },
    {
      year: 2026,
      month: 8,
      budgets: {
        "Food & Dining": 500,
        Groceries: 500,
        Transportation: 600,
        Entertainment: 400,
        Shopping: 500,
        Utilities: 250,
        Healthcare: 300,
        Subscriptions: 150,
        Travel: 500,
        "Dining Out": 300,
        Clothing: 250,
        Gas: 200,
      },
    },
  ];

  months.forEach(({ year, month, budgets: monthlyBudgets }) => {
    Object.entries(monthlyBudgets).forEach(([category, amount]) => {
      budgets.push({
        userId,
        category,
        amount,
        month: monthString(year, month),
      });
    });
  });

  return budgets;
}

// ============================================================
// SEED DATABASE
// ============================================================

async function seedDatabase() {
  const client = await pool.connect();

  try {
    console.log("\n🌱 Starting FinSage database seeder...\n");

    await client.query("BEGIN");

    // --------------------------------------------------------
    // 1. Remove previous demo user
    // --------------------------------------------------------

    console.log("🧹 Removing existing demo user...");

    await client.query("DELETE FROM users WHERE email = $1", [DEMO_USER.email]);

    // --------------------------------------------------------
    // 2. Create demo user
    // --------------------------------------------------------

    console.log("👤 Creating demo user...");

    const hashedPassword = await bcrypt.hash(DEMO_USER.password, 10);

    const userResult = await client.query(
      `
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email
      `,
      [DEMO_USER.name, DEMO_USER.email, hashedPassword],
    );

    const user = userResult.rows[0];

    console.log(`   User ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);

    // --------------------------------------------------------
    // 3. Generate transactions
    // --------------------------------------------------------

    const transactions = generateTransactions(user.id);

    console.log(`💳 Inserting ${transactions.length} transactions...`);

    for (const transaction of transactions) {
      await client.query(
        `
          INSERT INTO transactions
            (user_id, type, amount, category, description, date)
          VALUES
            ($1, $2, $3, $4, $5, $6)
        `,
        [
          transaction.userId,
          transaction.type,
          transaction.amount,
          transaction.category,
          transaction.description,
          transaction.date,
        ],
      );
    }

    // --------------------------------------------------------
    // 4. Generate budgets
    // --------------------------------------------------------

    const budgets = generateBudgets(user.id);

    console.log(`📊 Inserting ${budgets.length} budgets...`);

    for (const budget of budgets) {
      await client.query(
        `
          INSERT INTO budgets
            (user_id, category, amount, month)
          VALUES
            ($1, $2, $3, $4)
          ON CONFLICT (user_id, category, month)
          DO UPDATE SET
            amount = EXCLUDED.amount,
            updated_at = CURRENT_TIMESTAMP
        `,
        [budget.userId, budget.category, budget.amount, budget.month],
      );
    }

    // --------------------------------------------------------
    // 5. Commit
    // --------------------------------------------------------

    await client.query("COMMIT");

    // --------------------------------------------------------
    // 6. Print summary
    // --------------------------------------------------------

    const transactionSummary = await pool.query(
      `
        SELECT
          COUNT(*) AS total,
          COUNT(*) FILTER (WHERE type = 'income') AS income_count,
          COUNT(*) FILTER (WHERE type = 'expense') AS expense_count,
          COALESCE(
            SUM(amount) FILTER (WHERE type = 'income'),
            0
          ) AS total_income,
          COALESCE(
            SUM(amount) FILTER (WHERE type = 'expense'),
            0
          ) AS total_expenses
        FROM transactions
        WHERE user_id = $1
      `,
      [user.id],
    );

    const budgetSummary = await pool.query(
      `
        SELECT COUNT(*) AS total
        FROM budgets
        WHERE user_id = $1
      `,
      [user.id],
    );

    const summary = transactionSummary.rows[0];

    console.log("\n========================================");
    console.log("       FINSAGE SEED COMPLETE");
    console.log("========================================");

    console.log(`👤 User:         ${user.name}`);
    console.log(`📧 Email:        ${user.email}`);
    console.log(`🔑 Password:     ${DEMO_USER.password}`);
    console.log(`🆔 User ID:      ${user.id}`);

    console.log("\n📊 DATA SUMMARY");
    console.log("----------------------------------------");
    console.log(`Transactions:    ${summary.total}`);
    console.log(`Income:          ${summary.income_count}`);
    console.log(`Expenses:        ${summary.expense_count}`);
    console.log(`Total Income:    $${Number(summary.total_income).toFixed(2)}`);
    console.log(
      `Total Expenses:  $${Number(summary.total_expenses).toFixed(2)}`,
    );
    console.log(
      `Balance:         $${(
        Number(summary.total_income) - Number(summary.total_expenses)
      ).toFixed(2)}`,
    );
    console.log(`Budgets:         ${budgetSummary.rows[0].total}`);

    console.log("\n🧪 TEST LOGIN");
    console.log("----------------------------------------");
    console.log("Email:    demo@finsage.com");
    console.log("Password: Demo@123");

    console.log("\n🤖 AI TEST QUESTIONS");
    console.log("----------------------------------------");
    console.log("1. Where am I spending the most?");
    console.log("2. Am I overspending?");
    console.log("3. How much can I save this month?");
    console.log("4. Which budgets have I exceeded?");
    console.log("5. What should I reduce my spending on?");
    console.log("6. Give me an insight about my finances.");

    console.log("\n📈 ANALYTICS TO TEST");
    console.log("----------------------------------------");
    console.log("• Income vs Expense");
    console.log("• Monthly Trend");
    console.log("• Category Breakdown");
    console.log("• Budget Utilization");
    console.log("• Balance");
    console.log("• Transaction Count");

    console.log("\n✅ Seeder finished successfully!\n");
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("\n❌ Seeder failed!");
    console.error(error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

// ============================================================
// RUN
// ============================================================

seedDatabase();
