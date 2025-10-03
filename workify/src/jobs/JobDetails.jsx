import React from 'react';
import './job-details.css';

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

  const initials = job.company
    ?.split(" ")
    .map(w => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="job-details">
      <div className="job-details-header">
        <div className="job-details-avatar">{initials}</div>
        <div className="job-details-title-block">
          <h2 className="job-details-title">{job.title}</h2>
          <div className="job-details-company">{job.company}</div>
          <div className="job-details-meta">
            <span className="details-meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7Zm0 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
              </svg>
              {job.location}
            </span>
            {job.remote && <span className="details-pill">Remote</span>}
            <span className="details-posted">• {job.posted}</span>
          </div>
        </div>
        <div className="job-details-actions">
          <button className="jd-btn btn-secondary">Save</button>
          <button className="jd-btn btn-primary">Apply</button>
          <button className="jd-btn btn-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 0 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="job-details-content">
        <section className="details-section">
          <h3>Co-op Overview</h3>
          <div className="overview-grid">
            <div className="overview-item">
              <span className="overview-label">Employment Type</span>
              <span className="overview-value">{job.type}</span>
            </div>
            <div className="overview-item">
              <span className="overview-label">Experience Level</span>
              <span className="overview-value">{job.level}</span>
            </div>
            {job.salary && (
              <div className="overview-item">
                <span className="overview-label">Salary Range</span>
                <span className="overview-value">${job.salary.min} – ${job.salary.max}</span>
              </div>
            )}
          </div>
        </section>

        <section className="details-section">
          <h3>Co-op Description</h3>
          <p className="job-description">{job.summary}</p>
          <p>We are seeking a talented and motivated individual to join our growing team. This role offers excellent opportunities for professional development and the chance to work on exciting projects with cutting-edge technologies.</p>
        </section>

        {job.skills && job.skills.length > 0 && (
          <section className="details-section">
            <h3>Required Skills</h3>
            <div className="skills-grid">
              {job.skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
