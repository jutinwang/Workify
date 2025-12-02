import { apiClient } from "./client";

export const authApi = {
  async getStatus() {
    const token = localStorage.getItem("authToken");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch("http://localhost:4000/auth/status", {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error("Failed to get status");
    }

    return response.json();
  },
  async registerStudent(data) {
    return apiClient.post("/auth/students/register", {
      email: data.email,
      password: data.password,
      name: data.fullName,
    });
  },

  async registerEmployer(data) {
    return apiClient.post("/auth/employers/register", {
      email: data.email,
      password: data.password,
      name: data.fullName,
    });
  },

  async login(email, password) {
    return apiClient.post("/auth/login", { email, password });
  },
};
