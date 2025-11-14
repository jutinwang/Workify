import { useState } from "react";
import "../var.css";
import "./job-card.css";
import { formatRelativeDate } from "../common/utility";

export default function JobCard({ job, isSelected, onClick }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const postedDate = formatRelativeDate(job?.updatedAt || job?.createdAt);

  const initials = "ali";

  const handleViewDetails = (e) => {
    e.preventDefault();
    onClick();
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  return (
    <article
      className={`job-card ${isSelected ? "job-card--selected" : ""}`}
      onClick={handleViewDetails}
    >
      {/* Header */}
      <div className="job-head">
        <div className="job-avatar">{initials}</div>
        <div className="job-titleblock">
          <h3 className="job-title">{job.title}</h3>
          <div className="job-company">{job.company.name}</div>
          <div className="job-meta">
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7Zm0 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                />
              </svg>
              {job.location}
            </span>
          </div>
        </div>
        <button className="bookmark-btn" onClick={handleBookmarkClick}>
          {isBookmarked ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
      {/* Tags */}
      {job.tags?.length > 0 && (
        <div className="job-tags">
          {job.tags.slice(0, 5).map((tag) => (
            <span key={tag.id} className="tag">
              {tag.displayName}
            </span>
          ))}
          {job.tags.length > 5 && (
            <span className="tag tag--muted">+{job.tags.length - 5} more</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="job-foot">
        <span className="posted">Posted {postedDate}</span>
      </div>
    </article>
  );
}
