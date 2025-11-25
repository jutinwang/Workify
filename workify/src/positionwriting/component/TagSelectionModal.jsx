import React, { useState, useMemo } from "react";
import "./TagSelectionModal.css";
import { JOB_TAGS, getCategories } from "../../constants/jobTags";

const TagSelectionModal = ({ isOpen, onClose, selectedTags, onTagsChange, maxTags = 5 }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = getCategories();

  // Filter tags based on search query
  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) return JOB_TAGS;
    
    const query = searchQuery.toLowerCase();
    return JOB_TAGS.filter(
      item => 
        item.tag.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Group filtered tags by category
  const tagsByCategory = useMemo(() => {
    const grouped = {};
    filteredTags.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item.tag);
    });
    return grouped;
  }, [filteredTags]);

  if (!isOpen) return null;

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      if (selectedTags.length < maxTags) {
        onTagsChange([...selectedTags, tag]);
      }
    }
  };

  const clearAllTags = () => {
    onTagsChange([]);
  };

  const hasReachedLimit = selectedTags.length >= maxTags;

  return (
    <div className="tag-modal-overlay" onClick={onClose}>
      <div className="tag-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tag-modal-header">
          <h3 className="tag-modal-title">Select Attributes ({selectedTags.length}/{maxTags})</h3>
          <button className="tag-close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="tag-modal-body">
          {/* Search Input */}
          <div className="tag-search-container">
            <input
              type="text"
              className="tag-search-input"
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {hasReachedLimit && (
            <div className="tag-limit-notice">
              You've selected the maximum of {maxTags} tags
            </div>
          )}

          {/* Tag Categories */}
          {categories.map(category => {
            const categoryTags = tagsByCategory[category];
            if (!categoryTags || categoryTags.length === 0) return null;

            return (
              <div key={category} className="tag-category-section">
                <h4 className="tag-category-title">{category}</h4>
                <div className="tag-options">
                  {categoryTags.map(tag => (
                    <button
                      key={tag}
                      className={`tag-option ${selectedTags.includes(tag) ? "selected" : ""} ${
                        hasReachedLimit && !selectedTags.includes(tag) ? "disabled" : ""
                      }`}
                      onClick={() => toggleTag(tag)}
                      disabled={hasReachedLimit && !selectedTags.includes(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredTags.length === 0 && (
            <div className="tag-no-results">
              No tags found matching "{searchQuery}"
            </div>
          )}
        </div>

        <div className="tag-modal-footer">
          <button className="tag-clear-button" onClick={clearAllTags}>
            Clear All
          </button>
          <button className="tag-done-button" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagSelectionModal;
