import React, { useState } from "react";
import "../styles/App.css";
import "../styles/ApplicantFilter.css";
import FilterIcon from "../../assets/filter.png";
import SearchIcon from "../../assets/search.png";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeFiltersCount =
    yearFilter.length +
    courseFilter.length +
    skillsFilter.length +
    (sortBy ? 1 : 0);

  const clearAllFilters = () => {
    onYearChange([]);
    onCourseChange([]);
    onSkillsChange([]);
    onSortChange("");
  };

  const toggleFilter = (currentFilters, value, setter) => {
    if (currentFilters.includes(value)) {
      setter(currentFilters.filter((item) => item !== value));
    } else {
      setter([...currentFilters, value]);
    }
  };

  return (
    <div className="card">
      <div className="filter-header">
        <h2 className="filter-header-section-title">Co-op #{selectedJob.id} Applicants</h2>
        <span className="applicant-count">
          {filteredCount} of {totalApplicants} applicants
        </span>
      </div>

      <div className="filter-controls">
        <div className="search-pill filter-pill">
          <img className="applicant-pill-icon-image" src={SearchIcon}></img>
          <input
            type="text"
            placeholder="Search applicants..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <button
          className={`filters-button ${
            activeFiltersCount > 0 ? "has-value" : ""
          }`}
          onClick={() => setIsModalOpen(true)}
        >
          <img className="applicant-pill-icon-image" src={FilterIcon}></img>
          Filters
          {activeFiltersCount > 0 && (
            <span className="filter-badge">{activeFiltersCount}</span>
          )}
        </button>
      </div>

      {isModalOpen && (
        <div
          className="filter-modal-overlay"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Filters</h3>
              <button
                className="close-button"
                onClick={() => setIsModalOpen(false)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="filter-section">
                <h4 className="filter-section-title">Year of Study</h4>
                <div className="filter-options">
                  {["1st", "2nd", "3rd", "4th"].map((year) => (
                    <button
                      key={year}
                      className={`filter-option ${
                        yearFilter.includes(year) ? "selected" : ""
                      }`}
                      onClick={() =>
                        toggleFilter(yearFilter, year, onYearChange)
                      }
                    >
                      {year} Year
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h4 className="filter-section-title">Courses</h4>
                <div className="filter-options">
                  {[
                    { value: "CEG2136", label: "CEG2136" },
                    { value: "CSI2106", label: "CSI2106" },
                    { value: "CSI3105", label: "CSI3105" },
                    { value: "CSI4106", label: "CSI4106" },
                  ].map((course) => (
                    <button
                      key={course.value}
                      className={`filter-option ${
                        courseFilter.includes(course.value) ? "selected" : ""
                      }`}
                      onClick={() =>
                        toggleFilter(courseFilter, course.value, onCourseChange)
                      }
                    >
                      {course.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h4 className="filter-section-title">Skills</h4>
                <div className="filter-options">
                  {["javascript", "python", "react", "node.js", "java"].map(
                    (skill) => (
                      <button
                        key={skill}
                        className={`filter-option ${
                          skillsFilter.includes(skill) ? "selected" : ""
                        }`}
                        onClick={() =>
                          toggleFilter(skillsFilter, skill, onSkillsChange)
                        }
                      >
                        {skill.charAt(0).toUpperCase() + skill.slice(1)}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="filter-section">
                <h4 className="filter-section-title">Sort By</h4>
                <div className="filter-options">
                  {[
                    { value: "match", label: "Match Score" },
                    { value: "recent", label: "Most Recent" },
                    { value: "visited", label: "Visited" },
                    { value: "shortlisted", label: "Shortlisted" },
                  ].map((sort) => (
                    <button
                      key={sort.value}
                      className={`filter-option ${
                        sortBy === sort.value ? "selected" : ""
                      }`}
                      onClick={() =>
                        onSortChange(sortBy === sort.value ? "" : sort.value)
                      }
                    >
                      {sort.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="clear-button" onClick={clearAllFilters}>
                Clear all filters
              </button>
              <button
                className="show-results-button"
                onClick={() => setIsModalOpen(false)}
              >
                Show {filteredCount} applicants
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantFilter;
