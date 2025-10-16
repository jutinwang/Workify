import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import JobDetails from "./ExpandedJobDetailsView";
import ExpandedCompanyView from "./ExpandedCompanyView";

const JobViewTabs = ({ job }) => {
  const [activeTab, setActiveTab] = useState("job-details");

  return (
    <div className="job-view-tabs">
      <div className="tab-header">
        <button
          className={activeTab === "job-details" ? "tab active" : "tab"}
          onClick={() => setActiveTab("job-details")}
        >
          Job Details
        </button>
        <button
          className={activeTab === "company-details" ? "tab active" : "tab"}
          onClick={() => setActiveTab("company-details")}
        >
          Company Details
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "job-details" ? <JobDetails job={job} /> : <ExpandedCompanyView job={job} />}
      </div>
    </div>
  );
};

export default JobViewTabs;
