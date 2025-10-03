import React from "react";
import "../styles/App.css";
import "../styles/ApplicantFilter.css";

const ApplicantFilter = ({
  selectedJob,
  totalApplicants,
  filteredCount,
  searchTerm,
  yearFilter,
  courseFilter,
  skillsFilter,
  sortBy,
  onSearchChange,
  onYearChange,
  onCourseChange,
  onSkillsChange,
  onSortChange,
}) => {
  return (
    <div className="card">
      <div className="filter-header">
        <h2 className="section-title">Co-op #{selectedJob.id} Applicants:</h2>
      </div>

      <div className="filter-controls">
        <div className="search-wrapper">
          <svg
            className="em-search-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, skill, or course..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
        </div>

        <select
          value={yearFilter}
          onChange={(e) => onYearChange(e.target.value)}
          className="filter-select"
        >
          <option value="">Year of Study</option>
          <option value="1st">1st Year</option>
          <option value="2nd">2nd Year</option>
          <option value="3rd">3rd Year</option>
          <option value="4th">4th Year</option>
        </select>

        <select
          value={courseFilter}
          onChange={(e) => onCourseChange(e.target.value)}
          className="filter-select"
        >
          <option value="">Courses</option>
          <option value="computer-science">CEG2136</option>
          <option value="engineering">CSI2106</option>
          <option value="business">CSI3105</option>
          <option value="mathematics">CSI4106</option>
        </select>

        <select
          value={skillsFilter}
          onChange={(e) => onSkillsChange(e.target.value)}
          className="filter-select"
        >
          <option value="">Skills</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="react">React</option>
          <option value="node">Node.js</option>
          <option value="java">Java</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="filter-select"
        >
          <option value="">Sort By</option>
          <option value="match">Match Score</option>
          <option value="recent">Recency</option>
          <option value="visited">Visited</option>
          <option value="shortlisted">Shortlisted</option>
        </select>
      </div>

      <span className="applicant-count">
        Showing {filteredCount} out of {totalApplicants} Applicants
      </span>
    </div>
  );
};

export default ApplicantFilter;
