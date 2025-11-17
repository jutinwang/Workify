import { useState, useMemo, useEffect } from "react";
import { formatRelativeDate } from "../common/utility";
import JobsFilter from "./JobsFilter";
import JobCard from "./JobCard";
import JobDetails from "./JobDetails";
import SavedSection from "./SavedSection";
import "./jobs.css";
import "../var.css";

const Jobs = () => {
  const [filters, setFilters] = useState({
    searchTerm: "",
    locations: [],
    datePosted: "",
    postingTags: [],
  });

  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      const matchesDate = formatRelativeDate(j.postedDate)
      if (!matchesDate) return false;
    }
    return true;
  });

  // Extract unique tags from all jobs
  const allTags = useMemo(() => {
    const tagsSet = new Map();
    jobs.forEach(job => {
      if (job.tags && Array.isArray(job.tags)) {
        job.tags.forEach(tag => {
          if (!tagsSet.has(tag.id)) {
            tagsSet.set(tag.id, tag);
          }
        });
      }
    });
    return Array.from(tagsSet.values());
  }, [jobs]);

  console.log("All available tags:", allTags);
  return (
    <div className="jobs-page-container">
      <SavedSection
        savedJobs={savedJobs}
        savedSearches={savedSearches}
        onRemoveJob={handleRemoveJob}
      />

      <div className="filters-section">
        <JobsFilter
          tags={allTags}
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
