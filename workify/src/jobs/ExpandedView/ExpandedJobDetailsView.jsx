import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import "./expanded-job-view.css";
import "../../var.css";
import masterCard from "../../assets/mastercard.png";
import { formatRelativeDate } from "../../common/utility";
import { useMemo } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor } from "slate";

const ExpandedJobDetailsView = () => {
  const jobId = useLocation().pathname.split("s/").pop();
  const [activeTab, setActiveTab] = useState("overview");
  const [coops, setCoops] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:4000/students/${jobId}`);
        const data = await response.json();
        console.log("Job data from API:", data);
        setCoops(data);
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };

    if (true) {
      fetchJobDetails();
    }
  }, [jobId]);

  const editor = useMemo(() => withReact(createEditor()), []);

  useEffect(() => {
    console.log(coops);
  }, [coops]);

  if (loading) {
    return (
      <div className="expanded-job-container">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            fontSize: "18px",
          }}
        >
          Loading job details...
        </div>
      </div>
    );
  }

  const postingInfo = coops.job;
  const companyInfo = coops.job.company;
  const postedDate = formatRelativeDate(postingInfo?.createdAt);

  const HeroSection = () => {
    return (
      <div className="ejv-hero">
        <Link className="ejv-back-btn" to="/jobs">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
            />
          </svg>
          Back to Postings
        </Link>

        <div className="ejv-hero-content">
          <img className="ejv-company-logo" src={masterCard}></img>
          <div className="ejv-title-section">
            <h1 className="ejv-title">{postingInfo.title}</h1>
            <div className="ejv-company-name">{companyInfo.name}</div>
            <div className="ejv-meta-pills">
              <span className="ejv-pill">
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7Zm0 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                  />
                </svg>
                {postingInfo.location}
              </span>
            </div>
          </div>
          <div className="ejv-actions">
            <button className="ejv-btn ejv-btn--save">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                />
              </svg>
              Save
            </button>
            <button className="ejv-btn ejv-btn--primary">Apply Now</button>
          </div>
        </div>
      </div>
    );
  };

  const TabNavigation = () => {
    return (
      <div className="ejv-tabs-nav">
        <button
          className={`ejv-tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`ejv-tab-btn ${
            activeTab === "description" ? "active" : ""
          }`}
          onClick={() => setActiveTab("description")}
        >
          Description
        </button>
        <button
          className={`ejv-tab-btn ${activeTab === "company" ? "active" : ""}`}
          onClick={() => setActiveTab("company")}
        >
          Company
        </button>
      </div>
    );
  };

  const JobOverview = () => {
    return (
      <div className="ejv-overview">
        <div className="ejv-stats-grid">
          <div className="ejv-stat-card">
            <div className="ejv-stat-icon">💰</div>
            <div className="ejv-stat-label">Salary</div>
            {/* <div className="ejv-stat-value">{`${postingInfo.salary}`}</div> */}
            <Slate className="ejv-stat-value" editor={editor} initialValue={JSON.parse(postingInfo.salary)}>
                <Editable 
                    readOnly 
                    placeholder="No description"
                />
            </Slate>
          </div>
          <div className="ejv-stat-card">
            <div className="ejv-stat-icon">⏳</div>
            <div className="ejv-stat-label">Length</div>
            <div className="ejv-stat-value">{postingInfo.length}</div>
          </div>
          <div className="ejv-stat-card">
            <div className="ejv-stat-icon">👥</div>
            <div className="ejv-stat-label">Company Size</div>
            <div className="ejv-stat-value">{companyInfo.size}</div>
          </div>
          <div className="ejv-stat-card">
            <div className="ejv-stat-icon">📅</div>
            <div className="ejv-stat-label">Posted</div>
            <div className="ejv-stat-value">{postedDate}</div>
          </div>
        </div>

        {/* Job Summary */}
        <section className="ejv-section">
          <h2 className="ejv-section-title">About This Role</h2>
          <Slate className="ejv-text" editor={editor} initialValue={JSON.parse(postingInfo.description)}>
                <Editable 
                    readOnly 
                    placeholder="No description"
                />
            </Slate>
        </section>

        {/* Required Skills */}
        <section className="ejv-section">
          <h2 className="ejv-section-title">Required Skills</h2>
          <div className="ejv-skills-grid">
            {postingInfo.tags && postingInfo.tags.length > 0 ? (
              postingInfo.tags.map((tag) => (
                <span key={tag.id} className="ejv-skill-tag">
                  {tag.displayName || tag.name}
                </span>
              ))
            ) : (
              <p>No skills specified</p>
            )}
          </div>
        </section>

        {/* Benefits Preview */}
        <section className="ejv-section">
          <h2 className="ejv-section-title">Benefits & Perks</h2>
          <Slate className="ejv-text" editor={editor} initialValue={JSON.parse(postingInfo.benefits)}>
              <Editable 
                  readOnly 
                  placeholder="No description"
              />
          </Slate>
        </section>
      </div>
    );
  };

  const CompanyOverview = () => {
    return (
      <div className="ejv-description">
        <section className="ejv-section">
          <h2 className="ejv-section-title">Job Description</h2>
          <Slate className="ejv-text" editor={editor} initialValue={JSON.parse(postingInfo.description)}>
              <Editable 
                  readOnly 
                  placeholder="No description"
              />
          </Slate>
        </section>
        <section className="ejv-section">
          <h2 className="ejv-section-title">Key Responsibilities</h2>
          <Slate className="ejv-text" editor={editor} initialValue={JSON.parse(postingInfo.responsibilities)}>
              <Editable 
                  readOnly 
                  placeholder="No description"
              />
          </Slate>
        </section>
        <section className="ejv-section">
          <h2 className="ejv-section-title">Qualifications</h2>
          <Slate className="ejv-text" editor={editor} initialValue={JSON.parse(postingInfo.qualification)}>
              <Editable 
                  readOnly 
                  placeholder="No description"
              />
          </Slate>
        </section>
        <section className="ejv-section">
          <h2 className="ejv-section-title">Benefits & Perks</h2>
          <Slate className="ejv-text" editor={editor} initialValue={JSON.parse(postingInfo.benefits)}>
              <Editable 
                  readOnly 
                  placeholder="No description"
              />
          </Slate>
        </section>
      </div>
    );
  };

  const CompanyDetails = () => {
    console.log(companyInfo);
    return (
      <div className="ejv-company">
        <section className="ejv-section">
          <h2 className="ejv-section-title">About {companyInfo.name}</h2>
          <p className="ejv-text">{companyInfo.about}</p>
        </section>
        <div className="ejv-company-stats">
          <div className="ejv-company-stat">
            <span className="ejv-company-stat-label">Company Size</span>
            <span className="ejv-company-stat-value">{companyInfo.size}</span>
          </div>
          <div className="ejv-company-stat">
            <span className="ejv-company-stat-label">Industry</span>
            <span className="ejv-company-stat-value">
              {/* {companyInfo.industry} */}
              Technology | Software
            </span>
          </div>
          <div className="ejv-company-stat">
            <span className="ejv-company-stat-label">Current Postings</span>
            <span className="ejv-company-stat-value">
              {companyInfo._count.jobs}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="expanded-job-container">
      <HeroSection />
      <TabNavigation />
      <div className="ejv-content">
        {activeTab === "overview" && <JobOverview />}
        {activeTab === "description" && <CompanyOverview />}
        {activeTab === "company" && <CompanyDetails />}
      </div>
    </div>
  );
};

export default ExpandedJobDetailsView;
