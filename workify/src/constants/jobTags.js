export const JOB_TAGS = [
  // ----------------------------
  // First Co-Op Friendly
  // ----------------------------
  { category: "First Co-Op Friendly", tag: "First Co-Op Friendly" },

  // ----------------------------
  // Industry Tags
  // ----------------------------
  { category: "Industry", tag: "Technology" },
  { category: "Industry", tag: "Banking & Finance" },
  { category: "Industry", tag: "Government" },
  { category: "Industry", tag: "Healthcare" },
  { category: "Industry", tag: "Consulting" },
  { category: "Industry", tag: "Retail & E-commerce" },
  { category: "Industry", tag: "Energy" },
  { category: "Industry", tag: "Manufacturing" },
  { category: "Industry", tag: "Non-Profit" },
  { category: "Industry", tag: "Telecommunications" },

  // ----------------------------
  // Role Type Tags
  // ----------------------------
  { category: "Role Type", tag: "Software Developer" },
  { category: "Role Type", tag: "Frontend Developer" },
  { category: "Role Type", tag: "Backend Developer" },
  { category: "Role Type", tag: "Full Stack Developer" },
  { category: "Role Type", tag: "Mobile Developer" },
  { category: "Role Type", tag: "Data Scientist" },
  { category: "Role Type", tag: "Data Engineer" },
  { category: "Role Type", tag: "Data Analyst" },
  { category: "Role Type", tag: "Project Coordinator" },
  { category: "Role Type", tag: "Project Manager" },
  { category: "Role Type", tag: "Product Manager" },
  { category: "Role Type", tag: "QA Tester" },
  { category: "Role Type", tag: "Cybersecurity Analyst" },
  { category: "Role Type", tag: "DevOps Engineer" },
  { category: "Role Type", tag: "IT Support Specialist" },
  { category: "Role Type", tag: "UI/UX Designer" },

  // ----------------------------
  // Discipline Tags
  // ----------------------------
  { category: "Discipline", tag: "Software Engineering" },
  { category: "Discipline", tag: "Computer Science" },
  { category: "Discipline", tag: "Information Technology" },
  { category: "Discipline", tag: "Data Science" },
  { category: "Discipline", tag: "Cybersecurity" },
  { category: "Discipline", tag: "Business" },
  { category: "Discipline", tag: "Finance" },
  { category: "Discipline", tag: "Marketing" },
  { category: "Discipline", tag: "Communications" },
  { category: "Discipline", tag: "Human Resources" },
  { category: "Discipline", tag: "Electrical Engineering" },
  { category: "Discipline", tag: "Mechanical Engineering" },
  { category: "Discipline", tag: "Design" },

  // ----------------------------
  // Program Tags
  // ----------------------------
  { category: "Program", tag: "Computer Science" },
  { category: "Program", tag: "Software Engineering" },
  { category: "Program", tag: "Data Science" },
  { category: "Program", tag: "Information Systems" },
  { category: "Program", tag: "Business Administration" },
  { category: "Program", tag: "Commerce" },
  { category: "Program", tag: "Finance" },
  { category: "Program", tag: "Marketing" },
  { category: "Program", tag: "Accounting" },
  { category: "Program", tag: "Engineering" },
  { category: "Program", tag: "Communications" },
  { category: "Program", tag: "Human Resources" },
];

// Helper function to get unique categories
export const getCategories = () => {
  const categories = new Set(JOB_TAGS.map(item => item.category));
  return Array.from(categories);
};

// Helper function to get tags by category
export const getTagsByCategory = (category) => {
  return JOB_TAGS.filter(item => item.category === category).map(item => item.tag);
};
