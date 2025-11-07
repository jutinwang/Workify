import { apiClient } from "./client";

export const studentApi = {
  async completeProfile(profileData) {
    return apiClient.post("/students/profile", profileData);
  },

  async getProfile() {
    const response = await fetch("http://localhost:4000/students/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Request failed");
    }

    return data;
  },

  async updateProfile(updates) {
    const response = await fetch("http://localhost:4000/students/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Request failed");
    }

    return data;
  },
};
