require("dotenv").config();

const aiConfig = {
  provider: process.env.AI_PROVIDER || "gemini",
  model: process.env.AI_MODEL || "gemini-3.5-flash",
  apiKey: process.env.AI_API_KEY,
  maxTokens: 500,
};

const USE_MOCK_AI = !process.env.AI_API_KEY;

module.exports = {
  aiConfig,
  USE_MOCK_AI,
};
