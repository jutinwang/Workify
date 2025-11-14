import { useState, useMemo, useEffect } from "react";
import JobsFilter from "./JobsFilter";
import JobCard from "./JobCard";
import JobDetails from "./JobDetails";
import SavedSection from "./SavedSection";
import "./jobs.css";
import "../var.css";

const JOBS = [
  {
    id: 1,
    title: "Software Engineer",
    company: "TechStart Inc.",
    location: "San Francisco, CA",
    remote: true,
    type: "Full Time",
    level: "Mid",
    salary: { min: "120,000", max: "180,000" },
    skills: ["Python", "JavaScript", "React", "AWS", "Docker"],
    summary:
      "We are looking for a passionate Software Engineer to join our team building cutting-edge apps.",
    posted: "about 1 month ago",
    postedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    postingTags: ["Tolu", "Erik"],
    link: "#",
  },
  {
    id: 2,
    title: "Frontend Developer",
    company: "TechStart Inc.",
    location: "Remote",
    remote: true,
    type: "Full Time",
    level: "Entry",
    salary: { min: "90,000", max: "140,000" },
    skills: ["React", "TypeScript", "CSS", "Vite"],
    summary:
      "Join our frontend team to build amazing UIs with React and TypeScript.",
    posted: "about 1 month ago",
    postedDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
    postingTags: ["Justin"],
    link: "#",
  },
  {
    id: 3,
    title: "Backend Engineer",
    company: "CloudScale",
    location: "New York, NY",
    remote: false,
    type: "Full Time",
    level: "Senior",
    salary: { min: "140,000", max: "200,000" },
    skills: ["Node.js", "Express", "MongoDB", "AWS", "Microservices"],
    summary:
      "We are looking for a Senior Backend Engineer to design and optimize scalable cloud systems.",
    posted: "2 weeks ago",
    postedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    postingTags: ["Ali", "Tolu"],
    link: "#",
  },
  {
    id: 4,
    title: "Data Scientist",
    company: "Insight Analytics",
    location: "Remote",
    remote: true,
    type: "Contract",
    level: "Mid",
    salary: { min: "110,000", max: "150,000" },
    skills: ["Python", "TensorFlow", "Pandas", "SQL", "Machine Learning"],
    summary:
      "Work with a talented data team to build models and deliver insights for enterprise clients.",
    posted: "3 weeks ago",
    postedDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
    postingTags: ["Erik"],
    link: "#",
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "NextGen Systems",
    location: "Austin, TX",
    remote: true,
    type: "Full Time",
    level: "Mid",
    salary: { min: "115,000", max: "160,000" },
    skills: ["Kubernetes", "Docker", "CI/CD", "AWS", "Terraform"],
    summary:
      "Help us automate, scale, and secure our infrastructure for global applications.",
    posted: "1 week ago",
    postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    postingTags: ["Justin", "Ali"],
    link: "#",
  },
  {
    id: 6,
    title: "Mobile App Developer",
    company: "Appify Labs",
    location: "Remote",
    remote: true,
    type: "Full Time",
    level: "Entry",
    salary: { min: "80,000", max: "120,000" },
    skills: ["React Native", "iOS", "Android", "JavaScript", "REST APIs"],
    summary:
      "Kickstart your career by building cross-platform mobile applications used by thousands.",
    posted: "5 days ago",
    postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    postingTags: ["Tolu"],
    link: "#",
  },
  {
    id: 7,
    title: "UX/UI Designer",
    company: "BrightDesign Studio",
    location: "Los Angeles, CA",
    remote: false,
    type: "Full Time",
    level: "Mid",
    salary: { min: "95,000", max: "135,000" },
    skills: ["Figma", "Sketch", "Prototyping", "User Research", "Wireframing"],
    summary:
      "Collaborate with product and engineering teams to design engaging and intuitive user experiences.",
    posted: "4 days ago",
    postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    postingTags: ["Erik", "Justin"],
    link: "#",
  },
];

// Helper function to check date posted filter
const isWithinDateRange = (jobDate, filter) => {
  const now = new Date();
  const diffTime = now.getTime() - jobDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  switch (filter) {
    case "Past 24 hours":
      return diffDays <= 1;
    case "Past week":
      return diffDays <= 7;
    case "Past month":
      return diffDays <= 30;
    case "Any time":
    default:
      return true;
  }
};

const Jobs = () => {
  const [filters, setFilters] = useState({
    searchTerm: "",
    jobTypes: [],
    levels: [],
    locations: [],
    datePosted: "",
    postingTags: [],
    remoteOnly: false,
  });

  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      console.log("🔍 Starting job search with filters:", filters);
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        if (filters.searchTerm) {
          params.append("title", filters.searchTerm);
        }

        if (filters.postingTags?.length > 0) {
          params.append("tags", filters.postingTags.join(","));
        }

        const url = `http://localhost:4000/students/search?${params.toString()}`;
        console.log("📡 Fetching from:", url);
        const response = await fetch(url);

        console.log("📥 Response status:", response.status);

        if (!response.ok) {
          throw new Error(`Failed to fetch jobs: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Received jobs:", data);
        console.log("📊 Number of jobs:", data.length);
        setJobs(data);
      } catch (err) {
        console.error("❌ Error fetching jobs:", err);
        setError(err.message);
        console.log("⚠️ Falling back to mock data");
        setJobs(JOBS); // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters.searchTerm, filters.postingTags]);

  // Mock data for saved items
  const savedSearches = [
    {
      id: 1,
      name: "Frontend React Jobs",
      criteria: "React, Remote, Full-time",
      newJobs: 3,
    },
    {
      id: 2,
      name: "Senior Backend",
      criteria: "Node.js, Senior, Ottawa",
      newJobs: 0,
    },
  ];

  const [savedJobs, setSavedJobs] = useState([
    {
      id: 1,
      title: "Software Engineer",
      company: "TechStart Inc.",
      location: "Remote",
    },
    {
      id: 2,
      title: "Frontend Developer",
      company: "TechStart Inc.",
      location: "Remote",
    },
  ]);

  const handleRemoveJob = (jobId) => {
    setSavedJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
  };

  // Client-side filtering for other filters (location, date)
  const filtered = jobs.filter((j) => {
    // Locations
    if (filters.locations?.length > 0) {
      const matchesLocation = filters.locations.some((location) =>
        j.location?.toLowerCase().includes(location.toLowerCase())
      );
      if (!matchesLocation) return false;
    }

    // Date Posted
    if (filters.datePosted && j.postedDate) {
      const matchesDate = isWithinDateRange(
        new Date(j.postedDate),
        filters.datePosted
      );
      if (!matchesDate) return false;
    }

    return true;
  });

  return (
    <div className="jobs-page-container">
      <SavedSection
        savedJobs={savedJobs}
        savedSearches={savedSearches}
        onRemoveJob={handleRemoveJob}
      />

      <div className="filters-section">
        <JobsFilter
          filters={filters}
          setFilters={setFilters}
          totalJobs={jobs.length}
          filteredCount={filtered.length}
        />
      </div>
      <div
        className={`jobs-content ${
          selectedJob ? "jobs-content--split" : "jobs-content--full"
        }`}
      >
        <div
          className={`jobs-list-container ${
            selectedJob ? "jobs-list-container--split" : ""
          }`}
        >
          {loading && <div className="jobs-loading">Loading jobs...</div>}
          {error && <div className="jobs-error">Error: {error}</div>}
          {!loading && !error && (
            <div className="jobs-grid">
              {filtered.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSelected={selectedJob?.id === job.id}
                  onClick={() => setSelectedJob(job)}
                />
              ))}
            </div>
          )}
        </div>
        {selectedJob && (
          <div className="job-details-container">
            <JobDetails
              job={selectedJob}
              onClose={() => setSelectedJob(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
