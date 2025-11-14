import { apiClient } from "./client";

export const employerApi = {
  async postCoop(data) {
    return apiClient.post("/employers/me/jobs", {
      title: data.title,
      description: data.description,
      officeLocation: data.officeLocation,
      jobLength: data.jobLength,
      salary: data.salary,
      qualifications: data.qualifications,
    //   responsibilities: data.responsibilities,
    //   benefits: data.benefits,
    //   tags: data.tags
    });
  },
};
