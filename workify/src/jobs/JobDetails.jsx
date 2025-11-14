import React from "react";
import "./job-details.css";
import "../var.css";
import { Link } from "react-router-dom";
import { formatRelativeDate } from "../common/utility";

export default function JobDetails({ job, onClose }) {
  if (!job) {
    return (
      <div className="job-details-empty">
        <div className="empty-state">
          <h3>Select a co-op to view details</h3>
          <p>Click on any co-op card to see more information</p>
        </div>
      </div>
    );
  }

  const initials = job?.company?.title
    ?.split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const postedDate = formatRelativeDate(job.updatedAt || job.createdAt);

  return (
    <div className="job-details">
      <div className="job-details-header">
        <div className="job-details-avatar">{initials}</div>
        <div className="job-details-title-block">
          <h2 className="job-details-title">{job.title}</h2>
          <div className="job-details-company">{job.company.name}</div>
          <div className="job-details-meta">
            <span className="details-meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7Zm0 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                />
              </svg>
              {job.location}
            </span>
            <span className="details-posted">Updated {postedDate}</span>
          </div>
        </div>
        <div className="job-details-actions">
          <button className="jd-btn btn-save">Save</button>
          <button className="jd-btn btn-primary">Apply</button>
          <button className="jd-btn btn-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 0 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="job-details-content">
        <section className="details-section">
          <div className="co-op-overview-header">
            <h3>Co-op Overview</h3>
            <Link
              to={`/students/${job.id}`}
              className="expand-link"
              title="Expand Into Single Job View"
            >
              <button>Expand</button>
            </Link>
          </div>

          <div className="overview-grid">
          <div className="overview-item">
              <span className="overview-label">Length</span>
              <span className="overview-value">${job.length}</span>
            </div>
            <div className="overview-item">
              <span className="overview-label">Salary</span>
              <span className="overview-value">${job.salary}</span>
            </div>
          </div>
        </section>

        <section className="details-section">
          <h3>Co-op Description</h3>
          <p className="job-description">{job.description}</p>
        </section>

        {job.tags && (
          <section className="details-section">
            <h3>Required Skills</h3>
            <div className="skills-grid">
              {job.tags.map((tags) => (
                <span className="skill-tag">
                  {tags.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
