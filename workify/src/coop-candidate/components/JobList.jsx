import React from 'react';
import '../styles/App.css';
import '../styles/JobList.css';
import EditIcon from '../../profile/EditIcon';
import ArchiveIcon from '@mui/icons-material/Archive';
import { useNavigate } from "react-router-dom";
import { employerApi } from "../../api/employers";

const JobList = ({ jobs, selectedJob, onSelectJob }) => {
  const navigate = useNavigate();

  const handleJobToggle = (job) => {
    if (selectedJob?.id === job.id) {
      onSelectJob(null);
    } else {
      onSelectJob(job);
    }
  };

  const handleJobEdit = (job) => {
    navigate("/edit-job", { state: { job } });
  };

  const handleArchiving = async (job) => {
    try {
      const response = await employerApi.updatePostingStatus({
        id: job.id,
        postingStatus: job.postingStatus,
      });

      if (response.token) {
        localStorage.setItem("authToken", response.token);
      }
      
    } catch (err) {
      console.error("Error editing position:", err);
    }
  };

  return (
    <div className="card">
      <h2 className="section-title">Co-op Listings:</h2>
      <div className="employer job-list">
        {jobs.map(job => (
          <label key={job.id} className="employer job-item">
            <span className="employer job-id">Co-op #{job.id}</span>
            <span className="employer job-title">{job.title}</span>
            <span className="employer job-applicants">
              {job.applicants} Applicants
            </span>
            <div className="employer job-actions">
              <button className="employer job-link" onClick={() => handleJobToggle(job)}>View</button>
              <button className="employer job-link" onClick={() => handleJobEdit(job)}> <EditIcon /> </button>
              <button className="employer job-link" onClick={() => handleArchiving(job)}> <ArchiveIcon /> </button>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default JobList;
