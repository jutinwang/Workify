import React from "react";
import "./jobs-filter.css";

const JOB_TYPES = [
  "All Types",
  "Full-time",
  "Part-time",
  "Internship",
  "Contract",
  "Co-op",
];
const LEVELS = ["All Levels", "Junior", "Intermediate", "Senior", "Lead"];

export default function JobsFilter({ filters, setFilters }) {
  return (
    <aside className="jobs-filter-section">
      {/* LEFT: Search */}
      <div className="jf-left">
        <h3>Search All Jobs</h3>
        <div className="search-input">
          <span className="search-icon" aria-hidden>
            🔍
          </span>
          <input
            type="text"
            placeholder="Search for roles, companies, or locations"
          />
        </div>
        <span className="results-count">
          Showing: {6} of {18} available results{" "}
        </span>
      </div>

      {/* Divider */}
      <div className="jf-divider" aria-hidden />

      {/* RIGHT: Filters row */}
      <div className="jf-right">
        <h3>Filters</h3>
        <div className="filters-row">
          <div className="select-wrap">
            <select
              value={filters.location ?? "Location"}
              onChange={(e) =>
                setFilters((f) => ({ ...f, location: e.target.value }))
              }
            >
              <option disabled>Location</option>
              <option>Remote</option>
              <option>Ottawa</option>
              <option>Toronto</option>
              <option>Vancouver</option>
            </select>
          </div>

          <div className="select-wrap">
            <select
              id="level"
              value={filters.level}
              onChange={(e) =>
                setFilters((f) => ({ ...f, level: e.target.value }))
              }
            >
              {LEVELS.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="select-wrap">
            <select
              value={filters.datePosted ?? "Date Posted"}
              onChange={(e) =>
                setFilters((f) => ({ ...f, datePosted: e.target.value }))
              }
            >
              <option disabled>Date Posted</option>
              <option>Any time</option>
              <option>Past 24 hours</option>
              <option>Past week</option>
              <option>Past month</option>
            </select>
          </div>

          <div className="select-wrap">
            <select
              value={filters.more ?? "Additional filters"}
              onChange={(e) =>
                setFilters((f) => ({ ...f, more: e.target.value }))
              }
            >
              <option disabled>Additional filters</option>
              <option>Remote only</option>
              <option>Full-time</option>
              <option>Internship</option>
            </select>
          </div>
        </div>
      </div>
    </aside>
  );
}
