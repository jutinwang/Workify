import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ExpandedJobView.css";
import "../../var.css";
import ExpandedJobDetailsView from "./ExpandedJobDetailsView.jsx";


const ExpandedJobView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // TODO: Need to replace this with actual job fetching logic
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

  return (
    <div className="ejv-container">
      <div className="ejv-tab-section">
        <ExpandedJobDetailsView job={job} />
      </div>
    </div>
  );
};

export default ExpandedJobView;
