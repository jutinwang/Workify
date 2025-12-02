import React from 'react';
import '../styles/App.css';
import '../styles/JobList.css';
import EditIcon from '../../profile/EditIcon';
import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { employerApi } from "../../api/employers";

const JobList = ({ jobs, selectedJob, onSelectJob, onEditJob }) => {
  const handleJobToggle = (job) => {
    if (selectedJob?.id === job.id) {
      onSelectJob(null);
    } else {
      onSelectJob(job);
    }
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

const handleDelete = async (job) => {
  try {
    await employerApi.deleteCoop(job);
    setJobs(prev => prev.filter(j => j.id !== job.id));
    window.location.reload(); 
  } catch (error) {
    console.error("Delete failed:", error);
  }
};

const handleCloning = async (job) => {
  try {
    await employerApi.cloneCoop(job);
  } catch (error) {
    console.error("Clone failed:", error);
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
              <button className="employer job-link options"><MoreVertIcon /></button>
              <div className="dropdown-content">
                <button 
                  className="employer job-link"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditJob(job);
                  }}
                >
                  <EditIcon />
                </button>
                <button className="employer job-link" onClick={() => handleArchiving(job)}> <ArchiveIcon /> </button>
                <button className="employer job-link" onClick={() => handleDelete(job)}> <DeleteForeverIcon /> </button>
                <button className="employer job-link" onClick={() => handleCloning(job)}> <FileCopyIcon /> </button>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default JobList;
