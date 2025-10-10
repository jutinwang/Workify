import React, { useState } from "react";
import "./jobs-filter.css";
import FilterIcon from "../assets/filter.png";
import SearchIcon from "../assets/search.png";

const JOB_TYPES = ["Full-time", "Part-time", "Internship", "Contract", "Co-op"];
const LEVELS = ["Junior", "Intermediate", "Senior", "Lead"];
const LOCATIONS = ["Remote", "Ottawa", "Toronto", "Vancouver", "Montreal"];
const DATE_POSTED = ["Past 24 hours", "Past week", "Past month", "Any time"];

export default function JobsFilter({ filters, setFilters, totalJobs, filteredCount }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeFiltersCount =
    (filters.jobTypes?.length || 0) +
    (filters.levels?.length || 0) +
    (filters.locations?.length || 0) +
    (filters.datePosted ? 1 : 0) +
    (filters.remoteOnly ? 1 : 0);

  const clearAllFilters = () => {
    setFilters({
      searchTerm: filters.searchTerm || "",
      jobTypes: [],
      levels: [],
      locations: [],
      datePosted: "",
      remoteOnly: false,
    });
  };

  const toggleFilter = (key, value) => {
    const currentValues = filters[key] || [];
    if (currentValues.includes(value)) {
      setFilters({ ...filters, [key]: currentValues.filter((item) => item !== value) });
    } else {
      setFilters({ ...filters, [key]: [...currentValues, value] });
    }
  };

  return (
    <div className="jobs-filter-wrapper">
      <div className="jobs-filter-header">
        <h2 className="jobs-section-title">Search All Co-ops</h2>
        <span className="jobs-count">
          {filteredCount} of {totalJobs} jobs
        </span>
      </div>

      <div className="jobs-filter-controls">
        <div className="jobs-search-pill jobs-filter-pill">
          <img className="jobs-pill-icon" src={SearchIcon} alt="" />
          <input
            type="text"
            placeholder="Search for roles, companies, or locations"
            value={filters.searchTerm || ""}
            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
          />
        </div>

        <button
          className={`jobs-filters-button ${activeFiltersCount > 0 ? "has-value" : ""}`}
          onClick={() => setIsModalOpen(true)}
        >
          <img className="jobs-pill-icon" src={FilterIcon} alt="" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="jobs-filter-badge">{activeFiltersCount}</span>
          )}
        </button>
      </div>

      {isModalOpen && (
        <div className="jobs-filter-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="jobs-filter-modal" onClick={(e) => e.stopPropagation()}>
            <div className="jobs-modal-header">
              <h3 className="jobs-modal-title">Filters</h3>
              <button className="jobs-close-button" onClick={() => setIsModalOpen(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="jobs-modal-body">
              <div className="jobs-filter-section">
                <h4 className="jobs-filter-section-title">Job Type</h4>
                <div className="jobs-filter-options">
                  {JOB_TYPES.map((type) => (
                    <button
                      key={type}
                      className={`jobs-filter-option ${
                        filters.jobTypes?.includes(type) ? "selected" : ""
                      }`}
                      onClick={() => toggleFilter("jobTypes", type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="jobs-filter-section">
                <h4 className="jobs-filter-section-title">Experience Level</h4>
                <div className="jobs-filter-options">
                  {LEVELS.map((level) => (
                    <button
                      key={level}
                      className={`jobs-filter-option ${
                        filters.levels?.includes(level) ? "selected" : ""
                      }`}
                      onClick={() => toggleFilter("levels", level)}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="jobs-filter-section">
                <h4 className="jobs-filter-section-title">Location</h4>
                <div className="jobs-filter-options">
                  {LOCATIONS.map((location) => (
                    <button
                      key={location}
                      className={`jobs-filter-option ${
                        filters.locations?.includes(location) ? "selected" : ""
                      }`}
                      onClick={() => toggleFilter("locations", location)}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>

              <div className="jobs-filter-section">
                <h4 className="jobs-filter-section-title">Date Posted</h4>
                <div className="jobs-filter-options">
                  {DATE_POSTED.map((date) => (
                    <button
                      key={date}
                      className={`jobs-filter-option ${
                        filters.datePosted === date ? "selected" : ""
                      }`}
                      onClick={() =>
                        setFilters({
                          ...filters,
                          datePosted: filters.datePosted === date ? "" : date,
                        })
                      }
                    >
                      {date}
                    </button>
                  ))}
                </div>
              </div>

              <div className="jobs-filter-section">
                <h4 className="jobs-filter-section-title">Work Mode</h4>
                <div className="jobs-filter-options">
                  <button
                    className={`jobs-filter-option ${filters.remoteOnly ? "selected" : ""}`}
                    onClick={() =>
                      setFilters({ ...filters, remoteOnly: !filters.remoteOnly })
                    }
                  >
                    Remote Only
                  </button>
                </div>
              </div>
            </div>

            <div className="jobs-modal-footer">
              <button className="jobs-clear-button" onClick={clearAllFilters}>
                Clear all filters
              </button>
              <button
                className="jobs-show-results-button"
                onClick={() => setIsModalOpen(false)}
              >
                Show {filteredCount} jobs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
