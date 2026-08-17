// backend/seeder.js
require("dotenv").config();
const { pool } = require("./config/db.js");
const User = require("./models/user.model.js");
const Transaction = require("./models/transaction.model");
const Budget = require("./models/budget.model");
const {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} = require("./constants/categories");

// Dummy User Data
const DUMMY_USER = {
  name: "Demo User",
  email: "demouser@gmail.com",
  password: "Demo@123",
};

// Generate random number between min and max
const randomBetween = (min, max) => {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
};

// Random date within a month range
const randomDate = (year, month, dayRange = [1, 28]) => {
  const day =
    Math.floor(Math.random() * (dayRange[1] - dayRange[0] + 1)) + dayRange[0];
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

// Random item from array
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Generate transaction description
const generateDescription = (category, type) => {
  const incomeDescriptions = [
    "Salary for month",
    "Freelance project payment",
    "Dividend received",
    "Rent received",
    "Business revenue",
    "Gift received",
    "Bonus payment",
    "Consulting fees",
    "Interest earned",
    "Refund received",
  ];

  const expenseDescriptions = {
    Housing: ["Monthly rent", "Maintenance fees", "Property tax"],
    "Food & Dining": ["Restaurant dinner", "Cafe lunch", "Food delivery"],
    Transportation: ["Fuel", "Metro card", "Cab ride", "Car maintenance"],
    Utilities: ["Electricity bill", "Water bill", "Gas bill"],
    Insurance: ["Health insurance", "Car insurance", "Life insurance"],
    Healthcare: ["Doctor visit", "Medicine", "Dental checkup"],
    Entertainment: ["Movie tickets", "Concert", "Netflix subscription"],
    Shopping: ["Clothes", "Shoes", "Accessories", "Electronics"],
    Education: ["Course fees", "Books", "Tuition"],
    Groceries: ["Weekly groceries", "Monthly supplies"],
    "Dining Out": ["Dinner at restaurant", "Lunch with colleagues"],
    Rent: ["Monthly rent payment"],
    Mortgage: ["EMI payment"],
    Car: ["Car wash", "Servicing", "New tires"],
    Gas: ["Petrol", "Diesel"],
    Phone: ["Mobile recharge", "Phone bill"],
    Internet: ["WiFi bill", "Broadband"],
    Subscriptions: ["Spotify", "YouTube Premium", "Amazon Prime"],
    Clothing: ["New dress", "Jeans", "Jacket"],
    Travel: ["Flight ticket", "Hotel booking", "Bus fare"],
    "Other Expenses": ["Miscellaneous", "Others"],
  };

  if (type === "income") {
    return randomItem(incomeDescriptions);
  } else {
    const descs = expenseDescriptions[category] || ["Expense purchase"];
    return randomItem(descs);
  }
};

// Generate transactions for a specific month
const generateTransactionsForMonth = (userId, year, month) => {
  const transactions = [];
  const numTransactions = randomBetween(15, 30); // 15-30 transactions per month

  // Some income transactions
  const numIncomes = randomBetween(2, 5);
  for (let i = 0; i < numIncomes; i++) {
    const category = randomItem(INCOME_CATEGORIES);
    const amount = randomBetween(5000, 150000);
    const date = randomDate(year, month, [1, 28]);
    transactions.push({
      userId,
      type: "income",
      amount,
      category,
      description: generateDescription(category, "income"),
      date,
    });
  }

  // Expense transactions
  const numExpenses = numTransactions - numIncomes;
  for (let i = 0; i < numExpenses; i++) {
    const category = randomItem(EXPENSE_CATEGORIES);
    const amount = randomBetween(100, 50000);
    const date = randomDate(year, month, [1, 28]);
    transactions.push({
      userId,
      type: "expense",
      amount,
      category,
      description: generateDescription(category, "expense"),
      date,
    });
  }

  return transactions;
};

// Generate budgets for a specific month
const generateBudgetsForMonth = (userId, year, month) => {
  const budgets = [];
  const monthStr = `${year}-${String(month).padStart(2, "0")}`;

  // Create budgets for 8-12 expense categories
  const numBudgets = randomBetween(8, 12);
  const selectedCategories = [];
  const shuffled = [...EXPENSE_CATEGORIES].sort(() => Math.random() - 0.5);

  for (let i = 0; i < numBudgets && i < shuffled.length; i++) {
    selectedCategories.push(shuffled[i]);
  }

  // Ensure some major categories are always included
  const mandatoryCategories = [
    "Housing",
    "Food & Dining",
    "Transportation",
    "Utilities",
  ];
  mandatoryCategories.forEach((cat) => {
    if (!selectedCategories.includes(cat)) {
      selectedCategories.push(cat);
    }
  });

  selectedCategories.forEach((category) => {
    // Budget amount based on category type
    let amount;
    switch (category) {
      case "Housing":
      case "Rent":
      case "Mortgage":
        amount = randomBetween(15000, 50000);
        break;
      case "Food & Dining":
      case "Dining Out":
      case "Groceries":
        amount = randomBetween(5000, 20000);
        break;
      case "Transportation":
      case "Car":
      case "Gas":
        amount = randomBetween(3000, 15000);
        break;
      case "Utilities":
      case "Phone":
      case "Internet":
        amount = randomBetween(2000, 8000);
        break;
      case "Healthcare":
      case "Insurance":
        amount = randomBetween(3000, 15000);
        break;
      default:
        amount = randomBetween(2000, 10000);
    }

    budgets.push({
      userId,
      category,
      amount: Math.round(amount),
      month: monthStr,
    });
  });

  return budgets;
};

// Main seeder function
async function runSeeder() {
  console.log("🌱 Starting seeder...");

  try {
    // 1. Delete existing data (clean slate)
    console.log("🗑️ Clearing existing data...");
    await pool.query(
      "DELETE FROM transactions WHERE user_id IN (SELECT id FROM users WHERE email = $1)",
      [DUMMY_USER.email],
    );
    await pool.query(
      "DELETE FROM budgets WHERE user_id IN (SELECT id FROM users WHERE email = $1)",
      [DUMMY_USER.email],
    );
    await pool.query("DELETE FROM users WHERE email = $1", [DUMMY_USER.email]);
    console.log("✅ Existing data cleared");

    // 2. Create dummy user
    console.log(`👤 Creating user: ${DUMMY_USER.email}`);
    const user = await User.create(DUMMY_USER);
    console.log(`✅ User created with ID: ${user.id}`);

    // 3. Generate transactions for 3 months (June, July, August 2026)
    const months = [
      { year: 2026, month: 6 }, // June
      { year: 2026, month: 7 }, // July
      { year: 2026, month: 8 }, // August
    ];

    let totalTransactions = 0;
    let totalBudgets = 0;

    for (const { year, month } of months) {
      console.log(
        `\n📅 Generating data for ${year}-${String(month).padStart(2, "0")}`,
      );

      // Generate transactions
      const transactions = generateTransactionsForMonth(user.id, year, month);
      for (const tx of transactions) {
        await Transaction.create(tx);
        totalTransactions++;
      }
      console.log(`   ✅ ${transactions.length} transactions created`);

      // Generate budgets
      const budgets = generateBudgetsForMonth(user.id, year, month);
      for (const budget of budgets) {
        await Budget.create(budget);
        totalBudgets++;
      }
      console.log(`   ✅ ${budgets.length} budgets created`);
    }

    // 4. Add some extra transactions for variety (different months)
    console.log(`\n📅 Adding extra varied transactions...`);

    // Add some old transactions (May 2026)
    const extraMonths = [
      { year: 2026, month: 5, count: 10 },
      { year: 2026, month: 4, count: 8 },
    ];

    for (const { year, month, count } of extraMonths) {
      for (let i = 0; i < count; i++) {
        const isIncome = Math.random() < 0.2;
        const category = isIncome
          ? randomItem(INCOME_CATEGORIES)
          : randomItem(EXPENSE_CATEGORIES);
        const amount = isIncome
          ? randomBetween(10000, 100000)
          : randomBetween(100, 30000);
        const date = randomDate(year, month, [1, 28]);

        await Transaction.create({
          userId: user.id,
          type: isIncome ? "income" : "expense",
          amount,
          category,
          description: generateDescription(
            category,
            isIncome ? "income" : "expense",
          ),
          date,
        });
        totalTransactions++;
      }
      console.log(
        `   ✅ ${count} transactions created for ${year}-${String(month).padStart(2, "0")}`,
      );
    }

    // 5. Summary
    console.log("\n" + "=".repeat(50));
    console.log("🎉 SEEDING COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(50));
    console.log(`👤 User: ${DUMMY_USER.email}`);
    console.log(`🔑 Password: ${DUMMY_USER.password}`);
    console.log(`📊 Total Transactions: ${totalTransactions}`);
    console.log(`💰 Total Budgets: ${totalBudgets}`);
    console.log("\n📅 Data available for months:");
    console.log("   - April 2026 (8 transactions)");
    console.log("   - May 2026 (10 transactions)");
    console.log("   - June 2026 (15-30 transactions)");
    console.log("   - July 2026 (15-30 transactions)");
    console.log("   - August 2026 (15-30 transactions)");
    console.log("\n📊 Budgets available for June, July, August 2026");
    console.log("=".repeat(50));
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the seeder
runSeeder();
