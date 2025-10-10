import { useState, useMemo } from "react";
import JobsFilter from "./JobsFilter";
import JobCard from "./JobCard";
import JobDetails from "./JobDetails";
import "./jobs.css";

const JOB_TYPES = [
  "All Types",
  "Full-time",
  "Part-time",
  "Internship",
  "Contract",
  "Co-op",
];
const LEVELS = ["All Levels", "Junior", "Intermediate", "Senior", "Lead"];

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
    link: "#",
  },
];

const Jobs = () => {
  const [filters, setFilters] = useState({
    searchTerm: "",
    jobTypes: [],
    levels: [],
    locations: [],
    datePosted: "",
    remoteOnly: false,
  });

  const [selectedJob, setSelectedJob] = useState(null);

  const filtered = useMemo(() => {
    return JOBS.filter((j) => {
      // Search term
      if (filters.searchTerm) {
        const search = filters.searchTerm.toLowerCase();
        const matchesSearch =
          j.title.toLowerCase().includes(search) ||
          j.company.toLowerCase().includes(search) ||
          j.location.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }

      // Job types
      if (filters.jobTypes?.length > 0) {
        const matchesType = filters.jobTypes.some((type) =>
          j.type.toLowerCase().includes(type.toLowerCase())
        );
        if (!matchesType) return false;
      }

      // Levels
      if (filters.levels?.length > 0) {
        const matchesLevel = filters.levels.some(
          (level) => j.level.toLowerCase() === level.toLowerCase()
        );
        if (!matchesLevel) return false;
      }

      // Locations
      if (filters.locations?.length > 0) {
        const matchesLocation = filters.locations.some((location) =>
          j.location.toLowerCase().includes(location.toLowerCase())
        );
        if (!matchesLocation) return false;
      }

      // Remote only
      if (filters.remoteOnly && !j.remote) return false;

      return true;
    });
  }, [filters]);

  return (
    <div className="jobs-page-container">
      <div className="filters-section">
        <JobsFilter
          filters={filters}
          setFilters={setFilters}
          totalJobs={JOBS.length}
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
