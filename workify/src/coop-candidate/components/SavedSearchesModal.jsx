import React from "react";
import "../../common/modal.css";
import "./SavedSearchesModal.css";

const SavedSearchesModal = ({ isOpen, onClose, savedSearches, onApplySearch, onDeleteSearch }) => {
  if (!isOpen) return null;

  const getSearchCriteria = (filters) => {
    const parts = [];
    if (filters.searchTerm) parts.push(`"${filters.searchTerm}"`);
    if (filters.yearFilter?.length) parts.push(filters.yearFilter.join(", "));
    if (filters.programFilter?.length) parts.push(filters.programFilter.join(", "));
    if (filters.statusFilter) parts.push(filters.statusFilter);
    if (filters.hasExperienceFilter !== null) parts.push(filters.hasExperienceFilter ? "Has experience" : "No experience");
    if (filters.graduationDateFilter) parts.push(`Grad: ${filters.graduationDateFilter}`);
    if (filters.sortBy) parts.push(`Sort: ${filters.sortBy}`);
    if (filters.showShortlistedOnly) parts.push("Shortlisted");
    
    return parts.length > 0 ? parts.join(" • ") : "No filters";
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content saved-searches-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Saved Searches</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {savedSearches.length > 0 ? (
            <div className="saved-searches-list">
              {savedSearches.map((search) => (
                <div key={search.id} className="saved-search-item">
                  <div className="saved-search-content">
                    <h4 className="saved-search-name">{search.name}</h4>
                    <p className="saved-search-criteria">{getSearchCriteria(search.filters)}</p>
                  </div>
                  <div className="saved-search-actions">
                    <button 
                      className="btn-apply"
                      onClick={() => {
                        onApplySearch(search);
                        onClose();
                      }}
                    >
                      Apply
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => onDeleteSearch(search.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No saved searches yet</p>
              <span className="empty-hint">
                Apply filters and save your searches to quickly find candidates
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedSearchesModal;
