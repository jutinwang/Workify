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
};
