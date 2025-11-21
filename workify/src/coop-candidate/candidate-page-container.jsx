import React, { useState, useEffect } from "react";
import JobList from "./components/JobList";
import ApplicantFilter from "./components/ApplicantFilter";
import ApplicantResults from "./components/ApplicantResults";
import CandidateModal from "./components/CandidateModal";
import "./styles/App.css";
import "../var.css";

const EmployerCandidateContainer = () => {
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState("");

  const [selectedJob, setSelectedJob] = useState(null);

  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [appsError, setAppsError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState([]);
  const [courseFilter, setCourseFilter] = useState([]); 
  const [skillsFilter, setSkillsFilter] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [showShortlistedOnly, setShowShortlistedOnly] = useState(false);

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [viewedCandidatesByJob, setViewedCandidatesByJob] = useState({});

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setJobsLoading(true);
        setJobsError("");

        if (!token) {
          setJobsError("You must be logged in as an employer.");
          setJobsLoading(false);
          return;
        }

        const res = await fetch("http://localhost:4000/employers/me/jobs", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setJobsError(data.error || "Failed to load jobs.");
          setJobsLoading(false);
          return;
        }

        const jobList = Array.isArray(data) ? data : data.jobs;

        const normalizedJobs = jobList.map((job) => ({
          ...job,
          applicants: job.applicants ?? job._count?.applications ?? 0,
        }));

        setJobs(normalizedJobs);
        setJobsLoading(false);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setJobsError("Unexpected error while loading jobs.");
        setJobsLoading(false);
      }
    };

    fetchJobs();
  }, [token]);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!selectedJob) {
        setApplications([]);
        return;
      }

      try {
        setAppsLoading(true);
        setAppsError("");

        const res = await fetch(
          `http://localhost:4000/employers/jobs/${selectedJob.id}/applications`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setAppsError(data.error || "Failed to load applications.");
          setApplications([]);
          setAppsLoading(false);
          return;
        }

        const apps = data.applications || [];

        const mapped = apps.map((app) => ({
          id: app.id, 
          status: app.status,
          shortlisted: app.shortlisted,
          appliedAt: app.appliedAt,
          updatedAt: app.updatedAt,
          coverLetter: app.coverLetter,

          studentId: app.student.id,
          major: app.student.major,
          year: app.student.year,
          resumeUrl: app.student.resumeUrl,
          linkedInUrl: app.student.linkedInUrl,
          githubUrl: app.student.githubUrl,

          name: app.student.user.name,
          email: app.student.user.email,
        }));

        setApplications(mapped);
        setAppsLoading(false);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setAppsError("Unexpected error while loading applications.");
        setAppsLoading(false);
      }
    };

    if (token && selectedJob?.id) {
      fetchApplications();
    } else {
      setApplications([]);
    }
  }, [token, selectedJob]);

  const getShortlistedCandidatesForJob = (jobId) => {
    const shortlistedData = JSON.parse(
      localStorage.getItem("shortlistedCandidatesByJob") || "{}"
    );
    return new Set(shortlistedData[jobId] || []);
  };

  const getFilteredApplicants = () => {
    if (!selectedJob) return [];

    let filtered = [...applications];

    if (showShortlistedOnly) {
      filtered = filtered.filter((app) => app.shortlisted);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.name?.toLowerCase().includes(term) ||
          app.email?.toLowerCase().includes(term) ||
          app.major?.toLowerCase().includes(term)
      );
    }

    if (yearFilter.length > 0) {
      filtered = filtered.filter((app) =>
        yearFilter.includes(String(app.year))
      );
    }

    if (sortBy === "recent") {
      filtered.sort(
        (a, b) =>
          new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
      );
    } else if (sortBy === "name") {
      filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    return filtered;
  };

  const handleCloseModal = () => {
    if (selectedCandidate && selectedJob) {
      setViewedCandidatesByJob((prev) => ({
        ...prev,
        [selectedJob.id]: new Set([
          ...(prev[selectedJob.id] || []),
          selectedCandidate.id,
        ]),
      }));
    }
    setSelectedCandidate(null);
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setShowShortlistedOnly(false);
    setSearchTerm("");
    setYearFilter([]);
    setCourseFilter([]);
    setSkillsFilter([]);
  };

  const filteredApplicants = getFilteredApplicants();
  const totalApplicants = applications.length;
  const currentViewedCandidates = selectedJob
    ? viewedCandidatesByJob[selectedJob.id] || new Set()
    : new Set();

  return (
    <div className="app">
      <div className="container">
        {/* Left: job list */}
        {jobsLoading ? (
          <div>Loading your jobs...</div>
        ) : jobsError ? (
          <div style={{ color: "red" }}>{jobsError}</div>
        ) : (
          <JobList
            jobs={jobs}
            selectedJob={selectedJob}
            onSelectJob={handleJobSelect}
          />
        )}

        {/* Right: filters + applicants for selected job */}
        {selectedJob && (
          <>
            {appsLoading ? (
              <div>Loading applicants...</div>
            ) : appsError ? (
              <div style={{ color: "red" }}>{appsError}</div>
            ) : (
              <>
                <ApplicantFilter
                  selectedJob={selectedJob}
                  totalApplicants={totalApplicants}
                  filteredCount={filteredApplicants.length}
                  searchTerm={searchTerm}
                  yearFilter={yearFilter}
                  courseFilter={courseFilter}
                  skillsFilter={skillsFilter}
                  sortBy={sortBy}
                  showShortlistedOnly={showShortlistedOnly}
                  onSearchChange={setSearchTerm}
                  onYearChange={setYearFilter}
                  onCourseChange={setCourseFilter}
                  onSkillsChange={setSkillsFilter}
                  onSortChange={setSortBy}
                  onShortlistedFilterChange={setShowShortlistedOnly}
                />

                <ApplicantResults
                  applicants={filteredApplicants}
                  onSelectCandidate={setSelectedCandidate}
                  viewedCandidates={currentViewedCandidates}
                />
              </>
            )}
          </>
        )}

        {selectedCandidate && (
          <CandidateModal
            candidate={selectedCandidate}
            jobId={selectedJob?.id}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default EmployerCandidateContainer;
