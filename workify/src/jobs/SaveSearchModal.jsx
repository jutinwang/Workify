import React, { useState } from "react";
import "../common/modal.css";
import "./save-search-modal.css";

const SaveSearchModal = ({ isOpen, onClose, onSave, currentFilters }) => {
  const [searchName, setSearchName] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    if (!searchName.trim()) {
      setError("Please enter a name for this search");
      return;
    }

    onSave(searchName.trim(), currentFilters);
    setSearchName("");
    setError("");
    onClose();
  };

  const handleClose = () => {
    setSearchName("");
    setError("");
    onClose();
  };

  // Generate a preview of what will be saved
  const getFilterPreview = () => {
    const parts = [];
    if (currentFilters.searchTerm) parts.push(`"${currentFilters.searchTerm}"`);
    if (currentFilters.locations?.length) parts.push(`${currentFilters.locations.length} location${currentFilters.locations.length > 1 ? 's' : ''}`);
    if (currentFilters.postingTags?.length) parts.push(`${currentFilters.postingTags.length} tag${currentFilters.postingTags.length > 1 ? 's' : ''}`);
    if (currentFilters.datePosted) parts.push(currentFilters.datePosted);
    
    return parts.length > 0 ? parts.join(" • ") : "No filters applied";
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content save-search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Save This Search</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="searchName">Search Name</label>
            <input
              id="searchName"
              type="text"
              placeholder="e.g., Frontend React Jobs"
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
                setError("");
              }}
              maxLength={100}
              autoFocus
            />
            {error && <span className="error-message">{error}</span>}
          </div>

          <div className="search-preview">
            <h4>Filters to save:</h4>
            <p className="preview-text">{getFilterPreview()}</p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave}>
            Save Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveSearchModal;
