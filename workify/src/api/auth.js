import { apiClient } from "./client";

export const authApi = {
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
