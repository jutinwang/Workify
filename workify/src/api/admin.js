import { apiClient } from "./client";

export const adminApi = {
  // Dashboard Stats
  async getStats() {
    return apiClient.get("/admin/stats");
  },

  // Employer Management
  async getPendingEmployers() {
    return apiClient.get("/admin/employers/pending");
  },

  async getAllEmployers() {
    return apiClient.get("/admin/employers");
  },

  async approveEmployer(employerId) {
    return apiClient.post(`/admin/employers/${employerId}/approve`);
  },

  async declineEmployer(employerId) {
    return apiClient.post(`/admin/employers/${employerId}/decline`);
  },

  // Student Management
  async getAllStudents() {
    return apiClient.get("/admin/students");
  },

  // Job Management
  async getAllJobs() {
    return apiClient.get("/admin/jobs");
  },

  async deleteJob(jobId) {
    const token = localStorage.getItem("authToken");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`http://localhost:4000/admin/jobs/${jobId}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Failed to delete job");
    }

    return response.json();
  },

  // User Management
  async suspendUser(userId) {
    return apiClient.post(`/admin/users/${userId}/suspend`);
  },

  async deleteUser(userId) {
    const token = localStorage.getItem("authToken");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`http://localhost:4000/admin/users/${userId}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Failed to delete user");
    }

    return response.json();
  },
};
