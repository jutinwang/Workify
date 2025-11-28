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
      tags: data.tags
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
      data.postingStatus = "ACTIVE"
    } else {
      data.postingStatus = "ARCHIVED"
    }
    return apiClient.patch(`/employers/me/jobs/${data.id}`, data)
  },

  async updateCoop(data){
    return apiClient.patch(`/employers/me/jobs/${data.id}`, data)
  },

  async deleteCoop(data){
    return apiClient.delete(`/employers/me/jobs/${data.id}`)
  },

  async cloneCoop(data) {
    return apiClient.post("/employers/me/jobs", {
      title: "[DUPLICATE] " + data.title,
      description: data.description,
      location: data.location,
      length: data.length,
      salary: data.salary,
      qualification: data.qualification,
      responsibilities: data.responsibilities,
      benefits: data.benefits,
      tags: data.tags
    });
  }
};


const API_BASE_URL = 'http://localhost:4000';

const apiClient = {
  async post(endpoint, body) {
    try {
      const token = localStorage.getItem('authToken');
      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();

      console.log(data)

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async get(endpoint) {
    try {
      const token = localStorage.getItem('authToken');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Request failed');
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async patch(endpoint, body) {
    try {
      const token = localStorage.getItem('authToken');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Request failed');
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async delete(endpoint) {
    try {
      const token = localStorage.getItem('authToken');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Request failed');
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};
