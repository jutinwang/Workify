import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./expanded-job-view.css";
import "../../var.css";
import masterCard from "../../assets/mastercard.png";

// Mock data - replace with actual data fetching based on jobId
const MOCK_JOB = {
  id: 1,
  title: "Software Engineer",
  company: "TechStart Inc.",
  location: "San Francisco, CA",
  remote: true,
  type: "Full Time",
  level: "Mid",
  salary: { min: "120,000", max: "180,000" },
  skills: ["Python", "JavaScript", "React", "AWS", "Docker"],
  summary:
    "We are looking for a passionate Software Engineer to join our team building cutting-edge apps.",
  posted: "about 1 month ago",
  description: `We are seeking a talented Software Engineer to join our dynamic team. You'll be working on innovative projects that impact millions of users worldwide.

In this role, you'll collaborate with cross-functional teams to design, develop, and deploy scalable web applications. You'll have the opportunity to work with modern technologies and contribute to architectural decisions.`,
  responsibilities: [
    "Design and implement scalable backend services",
    "Collaborate with product and design teams to create exceptional user experiences",
    "Write clean, maintainable, and well-tested code",
    "Participate in code reviews and mentor junior developers",
    "Contribute to technical documentation and best practices",
  ],
  qualifications: [
    "3+ years of software development experience",
    "Strong proficiency in Python and JavaScript",
    "Experience with React and modern frontend frameworks",
    "Knowledge of cloud platforms (AWS preferred)",
    "Excellent problem-solving and communication skills",
  ],
  benefits: [
    "Competitive salary and equity package",
    "Health, dental, and vision insurance",
    "401(k) with company match",
    "Flexible work arrangements",
    "Professional development budget",
    "Unlimited PTO",
  ],
  companyInfo: {
    size: "50-200 employees",
    industry: "Technology, SaaS",
    founded: "2018",
    about:
      "TechStart Inc. is revolutionizing the way teams collaborate. Our platform is used by thousands of companies worldwide to streamline their workflows and boost productivity.",
  },
};

const ExpandedJobDetailsView = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const job = MOCK_JOB; // Replace with actual data fetching

  const HeroSection = () => {
    return (
      <div className="ejv-hero">
        <button className="ejv-back-btn" onClick={() => navigate("/jobs")}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
            />
          </svg>
          Back to Postings
        </button>

        <div className="ejv-hero-content">
          <img className="ejv-company-logo" src={masterCard}></img>
          <div className="ejv-title-section">
            <h1 className="ejv-title">{job.title}</h1>
            <div className="ejv-company-name">{job.company}</div>
            <div className="ejv-meta-pills">
              <span className="ejv-pill">
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7Zm0 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                  />
                </svg>
                {job.location}
              </span>
              {job.remote && (
                <span className="ejv-pill ejv-pill--remote">Remote</span>
              )}
              <span className="ejv-pill">{job.type}</span>
              <span className="ejv-pill">{job.level}</span>
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
            <div className="ejv-stat-label">Salary Range</div>
            <div className="ejv-stat-value">
              ${job.salary.min} – ${job.salary.max}
            </div>
          </div>
          <div className="ejv-stat-card">
            <div className="ejv-stat-icon">📅</div>
            <div className="ejv-stat-label">Posted</div>
            <div className="ejv-stat-value">{job.posted}</div>
          </div>
          <div className="ejv-stat-card">
            <div className="ejv-stat-icon">👥</div>
            <div className="ejv-stat-label">Company Size</div>
            <div className="ejv-stat-value">{job.companyInfo.size}</div>
          </div>
          <div className="ejv-stat-card">
            <div className="ejv-stat-icon">🏢</div>
            <div className="ejv-stat-label">Industry</div>
            <div className="ejv-stat-value">{job.companyInfo.industry}</div>
          </div>
        </div>

        {/* Job Summary */}
        <section className="ejv-section">
          <h2 className="ejv-section-title">About This Role</h2>
          <p className="ejv-text">{job.summary}</p>
        </section>

        {/* Required Skills */}
        <section className="ejv-section">
          <h2 className="ejv-section-title">Required Skills</h2>
          <div className="ejv-skills-grid">
            {job.skills.map((skill, index) => (
              <span key={index} className="ejv-skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Benefits Preview */}
        <section className="ejv-section">
          <h2 className="ejv-section-title">Benefits & Perks</h2>
          <div className="ejv-benefits-list">
            {job.benefits.slice(0, 3).map((benefit, index) => (
              <div key={index} className="ejv-benefit-item">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                  />
                </svg>
                {benefit}
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  };

  const CompanyOverview = () => {
    return (
      <div className="ejv-description">
        <section className="ejv-section">
          <h2 className="ejv-section-title">Job Description</h2>
          <p className="ejv-text">{job.description}</p>
        </section>
        <section className="ejv-section">
          <h2 className="ejv-section-title">Key Responsibilities</h2>
          <ul className="ejv-list">
            {job.responsibilities.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="ejv-section">
          <h2 className="ejv-section-title">Qualifications</h2>
          <ul className="ejv-list">
            {job.qualifications.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="ejv-section">
          <h2 className="ejv-section-title">Benefits & Perks</h2>
          <ul className="ejv-list">
            {job.benefits.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    );
  };

  const CompanyDetails = () => {
    return (
      <div className="ejv-company">
        <section className="ejv-section">
          <h2 className="ejv-section-title">About {job.company}</h2>
          <p className="ejv-text">{job.companyInfo.about}</p>
        </section>
        <div className="ejv-company-stats">
          <div className="ejv-company-stat">
            <span className="ejv-company-stat-label">Company Size</span>
            <span className="ejv-company-stat-value">
              {job.companyInfo.size}
            </span>
          </div>
          <div className="ejv-company-stat">
            <span className="ejv-company-stat-label">Industry</span>
            <span className="ejv-company-stat-value">
              {job.companyInfo.industry}
            </span>
          </div>
          <div className="ejv-company-stat">
            <span className="ejv-company-stat-label">Founded</span>
            <span className="ejv-company-stat-value">
              {job.companyInfo.founded}
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
