import React from 'react';
import '../styles/App.css';
import '../styles/JobList.css';
import EditIcon from '../../profile/EditIcon';

const JobList = ({ jobs, selectedJob, onSelectJob }) => {
  const handleJobToggle = (job) => {
    if (selectedJob?.id === job.id) {
      onSelectJob(null);
    } else {
      onSelectJob(job);
    }
  };

  return (
    <div className="card">
      <h2 className="section-title">Co-op Listings:</h2>
      <div className="employer job-list">
        {jobs.map(job => (
          <label key={job.id} className="employer job-item">
            <input
              type="checkbox"
              checked={selectedJob?.id === job.id}
              onChange={() => handleJobToggle(job)}
              className="employer job-checkbox"
            />
            <span className="employer job-id">Co-op #{job.id}</span>
            <span className="employer job-title">{job.title}</span>
            <span className="employer job-applicants">
              {job.applicants} Applicants
            </span>
            <div className="employer job-actions">
              <button className="employer job-link">View</button>
              <button className="employer job-link">
                <EditIcon />
              </button>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default JobList;
