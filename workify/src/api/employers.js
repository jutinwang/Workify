export const employerApi = {
  async postCoop(data) {
    return apiClient.post("/employers/me/jobs", {
      title: data.title,
      description: data.description,
      location: data.officeLocation,
      length: data.jobLength,
      salary: data.salary,
      qualification: data.qualifications,
      responsibilities: data.responsibilities,
      benefits: data.benefits,
      tags: data.tags,
    });
  },

  async completeProfile(data) {
    return apiClient.patch("/employers/complete-profile", data);
  },

  async getProfile() {
    return apiClient.get("/employers/profile");
  },

  async updatePostingStatus(data) {
    // Temp and should be improved
    if (data.postingStatus === "ARCHIVED") {
      data.postingStatus = "ACTIVE";
    } else {
      data.postingStatus = "ARCHIVED";
    }
    return apiClient.patch(`/employers/me/jobs/${data.id}`, data);
  },

  async updateCoop(data) {
    return apiClient.patch(`/employers/me/jobs/${data.id}`, data);
  },

  async deleteCoop(data) {
    return apiClient.delete(`/employers/me/jobs/${data.id}`);
  },

  async cloneCoop(data) {
    return apiClient.post("/employers/me/jobs", {
      title: "[DUPLICATE] " + data.title,
      description: data.description,
      location: data.location || "Remote",
      length: data.length || "Unspecified",
      salary: data.salary || "No salary provided",
      qualification: data.qualification || "No qualifications listed",
      responsibilities: data.responsibilities || "No responsibilities listed",
      benefits: data.benefits || "No benefits listed",
      tags: data.tags
    });
  },

  async completeInterview(interviewId) {
    return apiClient.patch(`/interviews/interviews/${interviewId}/complete`);
  },

  async getCompletedInterviews(limit = 50, offset = 0) {
    return apiClient.get(
      `/interviews/interviews/completed?limit=${limit}&offset=${offset}`
    );
  },

  async getAllInterviews() {
    return apiClient.get(`/interviews/interviews`);
  },

  async sendOffer(applicationId) {
    return apiClient.post(`/employers/applications/${applicationId}/offer`);
  },

  async shortlistApplication(applicationId) {
    return apiClient.post(`/employers/applications/${applicationId}/shortlist`);
  },

  // Account Management
  async updateAccountInfo(updates) {
    return apiClient.patch("/employers/profile", updates);
  },

  async changePassword(currentPassword, newPassword) {
    return apiClient.patch("/employers/account/password", {
      currentPassword,
      newPassword,
    });
  },

  async deleteAccount(password, confirmation) {
    const token = localStorage.getItem("authToken");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/employers/account`, {
      method: "DELETE",
      headers,
      body: JSON.stringify({ password, confirmation }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Failed to delete account");
    }

    return response.json();
  },

  // Saved Searches
  async saveSearch(name, filters) {
    return apiClient.post("/employers/saved-searches", { name, filters });
  },

  async getSavedSearches() {
    return apiClient.get("/employers/saved-searches");
  },

  async deleteSearch(searchId) {
    const token = localStorage.getItem("authToken");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(
      `http://localhost:4000/employers/saved-searches/${searchId}`,
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

  async getColleagues() {
    return apiClient.get("/employers/colleagues");
  },

  async searchCompanies(query) {
    return apiClient.get(`/employers/companies/search?query=${encodeURIComponent(query)}`);
  },
};

const API_BASE_URL = "http://localhost:4000";

const apiClient = {
  async post(endpoint, body) {
    try {
      const token = localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  async get(endpoint) {
    try {
      const token = localStorage.getItem("authToken");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "GET",
        headers,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Request failed");
      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  async patch(endpoint, body) {
    try {
      const token = localStorage.getItem("authToken");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Request failed");
      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  async delete(endpoint) {
    try {
      const token = localStorage.getItem("authToken");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers,
      });

      let data = null;

      // Avoid JSON parsing when there's no body
      if (response.status !== 204) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Request failed');
      }

      return data; // null for 204
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
};
