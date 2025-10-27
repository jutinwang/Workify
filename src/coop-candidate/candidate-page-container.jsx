import React, { useState } from "react";
import JobList from "./components/JobList";
import ApplicantFilter from "./components/ApplicantFilter";
import ApplicantResults from "./components/ApplicantResults";
import CandidateModal from "./components/CandidateModal";
import { jobs, jobApplicants } from "./data/mockData";
import "./styles/App.css";
import "../var.css";

const EmployerCandidateContainer = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState([]);
  const [courseFilter, setCourseFilter] = useState([]);
  const [skillsFilter, setSkillsFilter] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [showShortlistedOnly, setShowShortlistedOnly] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [viewedCandidatesByJob, setViewedCandidatesByJob] = useState({});

  // Helper function to get shortlisted candidates for a specific job
  const getShortlistedCandidatesForJob = (jobId) => {
    const shortlistedData = JSON.parse(
      localStorage.getItem("shortlistedCandidatesByJob") || "{}"
    );
    return new Set(shortlistedData[jobId] || []);
  };

  const getFilteredApplicants = () => {
    if (!selectedJob) return [];

    const jobSpecificApplicants = jobApplicants[selectedJob.id] || [];
    let filtered = [...jobSpecificApplicants];

    // Apply shortlist filter first if enabled
    if (showShortlistedOnly) {
      const shortlistedIds = getShortlistedCandidatesForJob(selectedJob.id);
      filtered = filtered.filter((app) => shortlistedIds.has(app.id));
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.skills.some((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (yearFilter.length > 0) {
      filtered = filtered.filter((app) =>
        yearFilter.some((year) => app.year.includes(year))
      );
    }

    if (courseFilter.length > 0) {
      filtered = filtered.filter(
        (app) =>
          app.keyCourses &&
          courseFilter.some((course) =>
            app.keyCourses.some((c) =>
              c.toLowerCase().includes(course.toLowerCase())
            )
          )
      );
    }

    if (skillsFilter.length > 0) {
      filtered = filtered.filter(
        (app) =>
          app.skills &&
          skillsFilter.some((skill) =>
            app.skills.some((s) =>
              s.toLowerCase().includes(skill.toLowerCase())
            )
          )
      );
    }

    if (sortBy === "match") {
      filtered.sort(
        (a, b) => parseInt(b.candidateMatch) - parseInt(a.candidateMatch)
      );
    } else if (sortBy === "recent") {
      filtered.sort((a, b) => parseInt(a.lastActive) - parseInt(b.lastActive));
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

  // Reset shortlist filter when changing jobs
  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setShowShortlistedOnly(false);
  };

  const filteredApplicants = getFilteredApplicants();
  const totalApplicants = selectedJob
    ? (jobApplicants[selectedJob.id] || []).length
    : 0;
  const currentViewedCandidates = selectedJob
    ? viewedCandidatesByJob[selectedJob.id] || new Set()
    : new Set();

  return (
    <div className="app">
      <div className="container">
        <JobList
          jobs={jobs}
          selectedJob={selectedJob}
          onSelectJob={handleJobSelect}
        />

        {selectedJob && (
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
