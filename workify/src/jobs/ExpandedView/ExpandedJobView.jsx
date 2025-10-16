import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ExpandedJobView.css";
import "../../var.css";
import JobViewTabs from "./JobViewTabs.jsx";
import scoLogo from "../../assets/scoLogo.png";

const ExpandedJobView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // TODO: Replace with actual job fetching logic
  // This should come from props, context, or API call
  const job = {
    id: id,
    title: "Software Engineer Co-op",
    company: "Tech Company Inc.",
    location: "Toronto, ON",
    remote: true,
    posted: "2 days ago",
    type: "Co-op (4 months)",
    level: "Intermediate",
    salary: { min: "25,000", max: "35,000" },
    summary:
      "Join our innovative team as a Software Engineer Co-op and work on cutting-edge projects that impact millions of users.",
    skills: ["React", "JavaScript", "Node.js", "Git", "REST APIs", "Agile"],
  };

  if (!job) {
    return (
      <div className="expanded-job-empty">
        <h2>Job not found or this Job may have been removed</h2>
        <button
          onClick={() => navigate("/jobs")}
          className="ejv-btn-back-to-jobs"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  const initials = job.company
    ?.split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const backButton = () => {
    return (
      <button
        className="ejv-btn-back-to-jobs"
        onClick={() => navigate("/jobs")}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="black"
          strokeWidth="2"
        >
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
        Back
      </button>
    );
  };

  const Header = () => {
    return (
      <div className="ejv-header">
        <div className="ejv-header-main">
          <img className="ejv-company-logo" src={scoLogo}></img>
          <div className="ejv-job-header-info">
            <h1>{job.title}</h1>
            <p className="ejv-company-name">{job.company}</p>
            <div className="ejv-job-meta">
              <span>{job.location}</span>
              {job.remote && <span>• Remote</span>}
              <span>• {job.type}</span>
              <span>• Posted {job.posted}</span>
            </div>
          </div>
          <div className="job-header-actions">
            <button className="ejv-btn-save">Save</button>
            <button className="ejv-btn-apply">Apply</button>
          </div>
        </div>
        <button
          className="ejv-btn-back-to-jobs"
          onClick={() => navigate("/jobs")}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeWidth="2"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>
    );
  };

  return (
    <div className="ejv-container">
      <Header />
      <div className="ejv-tab-section">
        <JobViewTabs job={job} />
      </div>
    </div>
  );
};

export default ExpandedJobView;
