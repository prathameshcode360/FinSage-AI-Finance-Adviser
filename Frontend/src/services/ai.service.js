// src/services/ai.service.js
import api from "./api";

const aiService = {
  chat: async (message, context = null) => {
    const response = await api.post("/ai/chat", { message, context });
    return response.data;
  },

  getInsight: async () => {
    const response = await api.get("/ai/insight");
    return response.data;
  },
};

export default aiService;
