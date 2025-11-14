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
};

