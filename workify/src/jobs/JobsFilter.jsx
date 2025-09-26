import React from "react";
import "./jobs-filter.css";

const JOB_TYPES = ["All Types", "Full-time", "Part-time", "Internship", "Contract", "Co-op"];
const LEVELS = ["All Levels", "Junior", "Intermediate", "Senior", "Lead"];

export default function JobsFilter({ filters, setFilters }) {
    return (
        <aside className="jobs-filter-section">
            <div className="filter-card">
                <div className="filter-card-left">
                    
                </div>
                <div className="filter-field">
                    <label htmlFor="jobType">Job Type</label>
                    <div className="select-wrap">
                        <select
                        id="jobType"
                        value={filters.jobType}
                        onChange={(e) =>
                            setFilters((f) => ({ ...f, jobType: e.target.value }))
                        }
                        >
                        {JOB_TYPES.map((opt) => (
                            <option key={opt} value={opt}>
                            {opt}
                            </option>
                        ))}
                        </select>
                    </div>
                </div>

                <div className="filter-field">
                    <label htmlFor="level">Experience Level</label>
                    <div className="select-wrap">
                        <select
                        id="level"
                        value={filters.level}
                        onChange={(e) =>
                            setFilters((f) => ({ ...f, level: e.target.value }))
                        }
                        >
                        {LEVELS.map((opt) => (
                            <option key={opt} value={opt}>
                            {opt}
                            </option>
                        ))}
                        </select>
                    </div>
                </div>

                <div className="filter-field">
                    <p className="filter-subtitle">Work Arrangement</p>
                    <label className="checkbox">
                        <input
                        type="checkbox"
                        checked={filters.remoteOnly}
                        onChange={() =>
                            setFilters((f) => ({ ...f, remoteOnly: !f.remoteOnly }))
                        }
                        />
                        <span>Remote only</span>
                    </label>
                </div>
            </div>
        </aside>
    );
}
