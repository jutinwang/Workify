import { useState, useMemo, useEffect } from "react";
import JobsFilter from "./JobsFilter";
import JobCard from "./JobCard";
import JobDetails from "./JobDetails";
import SavedSection from "./SavedSection";
import SaveSearchModal from "./SaveSearchModal";
import { studentApi } from "../api/student";
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

  const [savedJobs, setSavedJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [savedSearches, setSavedSearches] = useState([]);
  const [showUnappliedOnly, setShowUnappliedOnly] = useState(false);
  const [isSaveSearchModalOpen, setIsSaveSearchModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch saved jobs
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await studentApi.getSavedJobs();
        const jobs = response.savedJobs.map(saved => ({
          ...saved.job,
          id: saved.job.id,
          title: saved.job.title,
          company: saved.job.company.name,
          location: saved.job.location,
        }));
        setSavedJobs(jobs);
        setSavedJobIds(new Set(jobs.map(j => j.id)));
      } catch (err) {
        console.error("Error fetching saved jobs:", err);
      }
    };

    fetchSavedJobs();
  }, []);

  // Fetch saved searches
  useEffect(() => {
    const fetchSavedSearches = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await studentApi.getSavedSearches();
        const searches = response.savedSearches.map(search => ({
          id: search.id,
          name: search.name,
          filters: search.filters,
          createdAt: search.createdAt,
        }));
        setSavedSearches(searches);
      } catch (err) {
        console.error("Error fetching saved searches:", err);
      }
    };

    fetchSavedSearches();
  }, []);

  const handleSaveSearch = async (name, filters) => {
    try {
      await studentApi.saveSearch(name, filters);
      // Refetch saved searches
      const response = await studentApi.getSavedSearches();
      const searches = response.savedSearches.map(search => ({
        id: search.id,
        name: search.name,
        filters: search.filters,
        createdAt: search.createdAt,
      }));
      setSavedSearches(searches);
    } catch (error) {
      console.error("Error saving search:", error);
    }
  };

  const handleRemoveSearch = async (searchId) => {
    try {
      await studentApi.deleteSearch(searchId);
      setSavedSearches(prev => prev.filter(s => s.id !== searchId));
    } catch (error) {
      console.error("Error removing saved search:", error);
    }
  };

  const handleViewSearch = (search) => {
    // Apply the saved search filters
    setFilters(search.filters);
  };

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

        const token = localStorage.getItem("authToken");
        const headers = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(url, { headers });

        console.log("📥 Response status:", response.status);

        if (!response.ok) {
          throw new Error(`Failed to fetch jobs: ${response.status}`);
        }

        const data = await response.json();
        setJobs(data);
      } catch (err) {
        console.error("❌ Error fetching jobs:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters.searchTerm, filters.postingTags, refreshTrigger]);

  const handleRemoveJob = async (jobId) => {
    try {
      await studentApi.unsaveJob(jobId);
      setSavedJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
      setSavedJobIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    } catch (error) {
      console.error("Error removing saved job:", error);
    }
  };

  const handleSavedChange = (jobId, isSaved) => {
    if (isSaved) {
      // Refetch saved jobs to get the full job data
      studentApi.getSavedJobs().then(response => {
        const jobs = response.savedJobs.map(saved => ({
          ...saved.job,
          id: saved.job.id,
          title: saved.job.title,
          company: saved.job.company.name,
          location: saved.job.location,
        }));
        setSavedJobs(jobs);
        setSavedJobIds(new Set(jobs.map(j => j.id)));
      }).catch(err => console.error("Error refetching saved jobs:", err));
    } else {
      setSavedJobs(prev => prev.filter(j => j.id !== jobId));
      setSavedJobIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    }
  };

  const handleApplicationSubmitted = (jobId) => {
    // Trigger a refresh of the jobs list
    setRefreshTrigger(prev => prev + 1);
  };

  // Client-side filtering for location
  const filtered = jobs.filter((j) => {
    if (filters.locations?.length > 0) {
      const matchesLocation = filters.locations.some((location) =>
        j.location?.toLowerCase().includes(location.toLowerCase())
      );
      if (!matchesLocation) return false;
    }
    
    // Filter by unapplied status if enabled
    if (showUnappliedOnly && j.hasApplied) {
      return false;
    }
    
    return true;
  });

  const allTags = useMemo(() => {
    const tagsSet = new Map();
    jobs.forEach((job) => {
      if (job.tags && Array.isArray(job.tags)) {
        job.tags.forEach((tag) => {
          if (!tagsSet.has(tag.id)) {
            tagsSet.set(tag.id, tag);
          }
        });
      }
    });
    return Array.from(tagsSet.values());
  }, [jobs]);

  return (
    <div className="jobs-page-container">
      <SavedSection
        savedJobs={savedJobs}
        savedSearches={savedSearches}
        onRemoveJob={handleRemoveJob}
        onRemoveSearch={handleRemoveSearch}
        onViewSearch={handleViewSearch}
      />

      <div className="filters-section">
        <JobsFilter
          tags={allTags}
          filters={filters}
          setFilters={setFilters}
          totalJobs={jobs.length}
          filteredCount={filtered.length}
          showUnappliedOnly={showUnappliedOnly}
          onToggleUnappliedOnly={setShowUnappliedOnly}
        />
        
        {/* Save Search Button */}
        <div style={{ padding: "0 2.4rem", marginTop: "1rem" }}>
          <button
            className="jobs-filters-button"
            onClick={() => setIsSaveSearchModalOpen(true)}
            disabled={!filters.searchTerm && !filters.locations?.length && !filters.postingTags?.length && !filters.datePosted}
          >
            💾 Save This Search
          </button>
        </div>
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
              {filtered
                .filter(job => job.postingStatus !== "ARCHIVED") // 👈 hide archived
                .map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSelected={selectedJob?.id === job.id}
                    onClick={() => setSelectedJob(job)}
                    savedJobIds={savedJobIds}
                    onSavedChange={handleSavedChange}
                  />
                ))
              }

            </div>
          )}
        </div>
        {selectedJob && (
          <div className="job-details-container">
            <JobDetails
              job={selectedJob}
              onClose={() => setSelectedJob(null)}
              savedJobIds={savedJobIds}
              onSavedChange={handleSavedChange}
              onApplicationSubmitted={handleApplicationSubmitted}
            />
          </div>
        )}
      </div>

      <SaveSearchModal
        isOpen={isSaveSearchModalOpen}
        onClose={() => setIsSaveSearchModalOpen(false)}
        onSave={handleSaveSearch}
        currentFilters={filters}
      />
    </div>
  );
};

export default Jobs;
