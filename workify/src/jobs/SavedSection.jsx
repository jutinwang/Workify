import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./saved-section.css";
import "../var.css"

const SavedSection = ({ savedJobs = [], savedSearches = [], onRemoveJob, onRemoveSearch, onViewSearch }) => {
  const navigate = useNavigate();
  const [isSearchesExpanded, setIsSearchesExpanded] = useState(false);
  const [isJobsExpanded, setIsJobsExpanded] = useState(false);

  const onClickView = (jobId) => {
    navigate(`/students/${jobId}`);
  };

  const onClickRemove = (jobId) => {
    if (onRemoveJob) {
      onRemoveJob(jobId);
    }
  };

  const onClickRemoveSearch = (searchId) => {
    if (onRemoveSearch) {
      onRemoveSearch(searchId);
    }
  };

  const onClickViewSearch = (search) => {
    if (onViewSearch) {
      onViewSearch(search);
    }
  };

  const getSearchCriteria = (filters) => {
    const parts = [];
    if (filters.searchTerm) parts.push(`"${filters.searchTerm}"`);
    if (filters.locations?.length) parts.push(filters.locations.join(", "));
    if (filters.postingTags?.length) parts.push(filters.postingTags.join(", "));
    if (filters.datePosted) parts.push(filters.datePosted);
    
    return parts.length > 0 ? parts.join(" • ") : "No filters";
  };

  return (
    <div className="saved-section-wrapper">
      {/* Saved Searches */}
      <div className="saved-subsection">
        <div 
          className="saved-subsection-header"
          onClick={() => setIsSearchesExpanded(!isSearchesExpanded)}
        >
          <div className="saved-header-left">
            <svg
              className={`saved-collapse-icon ${isSearchesExpanded ? 'expanded' : ''}`}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
            <h3 className="saved-subsection-title">Saved Searches</h3>
          </div>
          <span className="saved-count">{savedSearches.length}</span>
        </div>
        {isSearchesExpanded && (
          <div className="saved-items-grid">
            {savedSearches.length > 0 ? (
              savedSearches.map((search) => (
                <div key={search.id} className="saved-search-card">
                  <div className="saved-search-content">
                    <h4 className="saved-search-name">{search.name}</h4>
                    <p className="saved-search-criteria">{getSearchCriteria(search.filters)}</p>
                  </div>
                  <button className="saved-item-action" onClick={() => onClickRemoveSearch(search.id)}>X</button>
                  <button className="saved-item-action" onClick={() => onClickViewSearch(search)}>Apply</button>
                </div>
              ))
            ) : (
              <div className="saved-empty-state">
                <p>No saved searches yet</p>
                <span className="saved-empty-hint">
                  Save your searches to quickly find matching jobs
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Saved Jobs */}
      <div className="saved-subsection">
        <div 
          className="saved-subsection-header"
          onClick={() => setIsJobsExpanded(!isJobsExpanded)}
        >
          <div className="saved-header-left">
            <svg
              className={`saved-collapse-icon ${isJobsExpanded ? 'expanded' : ''}`}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
            <h3 className="saved-subsection-title">Saved Jobs</h3>
          </div>
          <span className="saved-count">{savedJobs.length}</span>
        </div>
        {isJobsExpanded && (
          <div className="saved-items-grid">
            {savedJobs.length > 0 ? (
              savedJobs.map((job) => (
                <div key={job.id} className="saved-job-card">
                  <div className="saved-job-content">
                    <h4 className="saved-job-title">{job.title}</h4>
                    <p className="saved-job-company">{job.company}</p>
                    <p className="saved-job-location">{job.location}</p>
                  </div>
                  <button className="saved-item-action" onClick={() => onClickRemove(job.id)}>X</button>
                  <button className="saved-item-action" onClick={() => onClickView(job.id)}>View</button>
                </div>
              ))
            ) : (
              <div className="saved-empty-state">
                <p>No saved jobs yet</p>
                <span className="saved-empty-hint">
                  Bookmark jobs to review them later
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedSection;
