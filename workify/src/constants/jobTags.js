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
  // Skills & Frameworks
  // ----------------------------
  { category: "Skills & Frameworks", tag: "React" },
  { category: "Skills & Frameworks", tag: "JavaScript" },
  { category: "Skills & Frameworks", tag: "TypeScript" },
  { category: "Skills & Frameworks", tag: "Python" },
  { category: "Skills & Frameworks", tag: "Java" },
  { category: "Skills & Frameworks", tag: "C++" },
  { category: "Skills & Frameworks", tag: "C#" },
  { category: "Skills & Frameworks", tag: "Node.js" },
  { category: "Skills & Frameworks", tag: "Angular" },
  { category: "Skills & Frameworks", tag: "Vue.js" },
  { category: "Skills & Frameworks", tag: "SQL" },
  { category: "Skills & Frameworks", tag: "MongoDB" },
  { category: "Skills & Frameworks", tag: "PostgreSQL" },
  { category: "Skills & Frameworks", tag: "MySQL" },
  { category: "Skills & Frameworks", tag: "Git" },
  { category: "Skills & Frameworks", tag: "Docker" },
  { category: "Skills & Frameworks", tag: "Kubernetes" },
  { category: "Skills & Frameworks", tag: "AWS" },
  { category: "Skills & Frameworks", tag: "Azure" },
  { category: "Skills & Frameworks", tag: "REST APIs" },
  { category: "Skills & Frameworks", tag: "GraphQL" },
  { category: "Skills & Frameworks", tag: "Agile" },
  { category: "Skills & Frameworks", tag: "Jira" },
  { category: "Skills & Frameworks", tag: "Figma" },
  { category: "Skills & Frameworks", tag: "HTML/CSS" },
  { category: "Skills & Frameworks", tag: "Django" },
  { category: "Skills & Frameworks", tag: "Spring Boot" },
  { category: "Skills & Frameworks", tag: "Flask" },
  { category: "Skills & Frameworks", tag: "Express.js" },
  { category: "Skills & Frameworks", tag: "TailwindCSS" },
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
