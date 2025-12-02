import React, { useState } from "react";
import "../styles/App.css";
import "../styles/ApplicantFilter.css";
import FilterIcon from "../../assets/filter.png";
import SearchIcon from "../../assets/search.png";
import { AVAILABLE_PROGRAMS } from "../../constants/programs";

const ApplicantFilter = ({
  selectedJob,
  totalApplicants,
  filteredCount,
  searchTerm,
  yearFilter,
  programFilter,
  statusFilter,
  hasExperienceFilter,
  graduationDateFilter,
  sortBy,
  showShortlistedOnly,
  onSearchChange,
  onYearChange,
  onProgramChange,
  onStatusChange,
  onHasExperienceChange,
  onGraduationDateChange,
  onSortChange,
  onShortlistedFilterChange,
  onSaveSearch,
  onViewSavedSearches,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeFiltersCount =
    yearFilter.length +
    programFilter.length +
    (statusFilter ? 1 : 0) +
    (hasExperienceFilter !== null ? 1 : 0) +
    (graduationDateFilter ? 1 : 0) +
    (sortBy ? 1 : 0);

  const clearAllFilters = () => {
    onYearChange([]);
    onProgramChange([]);
    onStatusChange("");
    onHasExperienceChange(null);
    onGraduationDateChange("");
    onShortlistedFilterChange(false);
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
        <h2 className="filter-header-section-title">
          Co-op #{selectedJob.id} Applicants
        </h2>
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

        {activeFiltersCount > 0 && (
          <button
            className="filters-button"
            onClick={onSaveSearch}
            title="Save this search"
          >
            Save Search
          </button>
        )}

        <button
          className="filters-button"
          onClick={onViewSavedSearches}
          title="View saved searches"
        >
          Saved Searches
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
                <h4 className="filter-section-title">Application Status</h4>
                <div className="filter-options">
                  {[
                    { value: "PENDING", label: "Pending" },
                    { value: "OFFER", label: "Offered" },
                    { value: "REJECTED", label: "Rejected" },
                    { value: "ACCEPTED", label: "Accepted" },
                  ].map((status) => (
                    <button
                      key={status.value}
                      className={`filter-option ${
                        statusFilter === status.value ? "selected" : ""
                      }`}
                      onClick={() =>
                        onStatusChange(
                          statusFilter === status.value ? "" : status.value
                        )
                      }
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h4 className="filter-section-title">Program / Major</h4>
                <div
                  className="filter-options"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  {AVAILABLE_PROGRAMS.map((program) => (
                    <button
                      key={program}
                      className={`filter-option ${
                        programFilter.includes(program) ? "selected" : ""
                      }`}
                      onClick={() =>
                        toggleFilter(programFilter, program, onProgramChange)
                      }
                    >
                      {program}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h4 className="filter-section-title">Work Experience</h4>
                <div className="filter-options">
                  <button
                    className={`filter-option ${
                      hasExperienceFilter === true ? "selected" : ""
                    }`}
                    onClick={() =>
                      onHasExperienceChange(
                        hasExperienceFilter === true ? null : true
                      )
                    }
                  >
                    Has Experience
                  </button>
                  <button
                    className={`filter-option ${
                      hasExperienceFilter === false ? "selected" : ""
                    }`}
                    onClick={() =>
                      onHasExperienceChange(
                        hasExperienceFilter === false ? null : false
                      )
                    }
                  >
                    No Experience
                  </button>
                </div>
              </div>

              <div className="filter-section">
                <h4 className="filter-section-title">Graduation Date</h4>
                <div className="filter-options">
                  {[
                    { value: "2025", label: "2025" },
                    { value: "2026", label: "2026" },
                    { value: "2027", label: "2027" },
                    { value: "2028", label: "2028" },
                    { value: "2029+", label: "2029+" },
                  ].map((year) => (
                    <button
                      key={year.value}
                      className={`filter-option ${
                        graduationDateFilter === year.value ? "selected" : ""
                      }`}
                      onClick={() =>
                        onGraduationDateChange(
                          graduationDateFilter === year.value ? "" : year.value
                        )
                      }
                    >
                      {year.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h4 className="filter-section-title">Sort By</h4>
                <div className="filter-options">
                  {[
                    { value: "recent", label: "Most Recent" },
                    { value: "visited", label: "Visited" },
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

              <div className="filter-section">
                <label className="filter-label">
                  <input
                    type="checkbox"
                    checked={showShortlistedOnly}
                    onChange={(e) =>
                      onShortlistedFilterChange(e.target.checked)
                    }
                    className="filter-checkbox"
                  />
                  Show Shortlisted Only
                </label>
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
