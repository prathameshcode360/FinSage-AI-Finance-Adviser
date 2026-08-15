// src/config/ai.js
require("dotenv").config();

const aiConfig = {
  provider: process.env.AI_PROVIDER || "gemini",
  model: process.env.AI_MODEL || "gemini-2.5-flash",
  apiKey: process.env.AI_API_KEY,
  maxTokens: 500,
  temperature: 0.7,
};

// Use mock AI only when API key is not available
const USE_MOCK_AI = !process.env.AI_API_KEY;

module.exports = {
  aiConfig,
  USE_MOCK_AI,
};
