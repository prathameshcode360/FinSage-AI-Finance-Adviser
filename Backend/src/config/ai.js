// src/config/ai.js
require("dotenv").config();

// Simple AI configuration
const aiConfig = {
  provider: process.env.AI_PROVIDER || "openai",
  model: process.env.AI_MODEL || "gpt-3.5-turbo",
  apiKey: process.env.AI_API_KEY,
  maxTokens: 500,
  temperature: 0.7,
};

// For demonstration without an actual API key, we'll use mock responses
const USE_MOCK_AI = !process.env.AI_API_KEY;

module.exports = {
  aiConfig,
  USE_MOCK_AI,
};
