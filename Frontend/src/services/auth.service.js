// src/services/auth.service.js
import api from "./api";

const authService = {
  register: async (name, email, password) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data.user;
  },

  updateProfile: async (data) => {
    const response = await api.put("/user/profile", data);
    return response.data.user;
  },
};

export default authService;
