import { apiClient } from "./client";

export const studentApi = {
  async completeProfile(profileData) {
    return apiClient.post("/students/profile", profileData);
  },

  async getProfile() {
    return apiClient.get("/students/profile");
  },

  async updateProfile(updates) {
    return apiClient.patch("/students/profile", updates);
  },

  async getApplications(params = {}) {
    const queryString = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null))
    ).toString();
    const endpoint = queryString
      ? `/applications?${queryString}`
      : "/applications";
    return apiClient.get(endpoint);
  },

  async acceptOffer(applicationId) {
    return apiClient.post(`/applications/${applicationId}/accept`);
  },

  async rejectOffer(applicationId) {
    return apiClient.post(`/applications/${applicationId}/reject`);
  },

  async withdrawApplication(applicationId) {
    return apiClient.post(`/applications/${applicationId}/withdraw`);
  },

  // Saved Jobs
  async saveJob(jobId) {
    return apiClient.post("/students/saved-jobs", { jobId });
  },

  async unsaveJob(jobId) {
    const token = localStorage.getItem("authToken");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(
      `http://localhost:4000/students/saved-jobs/${jobId}`,
      {
        method: "DELETE",
        headers,
      }
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Failed to unsave job");
    }

    return;
  },

  async getSavedJobs() {
    return apiClient.get("/students/saved-jobs");
  },

  // Saved Searches
  async saveSearch(name, filters) {
    return apiClient.post("/students/saved-searches", { name, filters });
  },

  async deleteSearch(searchId) {
    const token = localStorage.getItem("authToken");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(
      `http://localhost:4000/students/saved-searches/${searchId}`,
      {
        method: "DELETE",
        headers,
      }
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Failed to delete search");
    }

    return;
  },

  async getSavedSearches() {
    return apiClient.get("/students/saved-searches");
  },

  // Account Management
  async updateAccountInfo(updates) {
    return apiClient.patch("/students/profile/account/profile", updates);
  },

  async changePassword(currentPassword, newPassword) {
    return apiClient.patch("/students/profile/account/password", {
      currentPassword,
      newPassword,
    });
  },

  async deleteAccount(password, confirmation) {
    const token = localStorage.getItem("authToken");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(
      `http://localhost:4000/students/profile/account`,
      {
        method: "DELETE",
        headers,
        body: JSON.stringify({ password, confirmation }),
      }
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Failed to delete account");
    }

    return response.json();
  },
};
