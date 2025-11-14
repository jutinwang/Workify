import { apiClient } from "./client";

export const employerApi = {
  async postCoop(data) {
    console.log(data.title)
    return apiClient.post("/employers/me/jobs", {
      title: data.title,
      description: data.description,
    //   responsibilities: data.responsibilities,
    //   qualifications: data.qualifications,
    //   benefits: data.benefits,
    //   jobLength: data.jobLength,
    //   salary: data.salary,
    //   officeLocation: data.officeLocation,
    //   tags: data.tags
    });
  },
};
