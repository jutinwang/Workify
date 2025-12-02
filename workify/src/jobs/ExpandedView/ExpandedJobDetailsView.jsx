import React, { useState, useEffect, useCallback } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "./expanded-job-view.css";
import "../../var.css";
import masterCard from "../../assets/mastercard.png";
import { formatRelativeDate } from "../../common/utility";
import { useMemo } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor } from "slate";
import { studentApi } from "../../api/student";

const ExpandedJobDetailsView = () => {
  const jobId = useLocation().pathname.split("s/").pop();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [coops, setCoops] = useState();
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (isSaving) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You must be logged in to save jobs.");
      return;
    }

    try {
      setIsSaving(true);

      if (isSaved) {
        await studentApi.unsaveJob(Number(jobId));
        setIsSaved(false);
      } else {
        await studentApi.saveJob(Number(jobId));
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      setIsSaved(!isSaved);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApply = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        alert("You must be logged in as a student to apply.");
        return;
      }

      const res = await fetch("http://localhost:4000/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId: Number(jobId),
          coverLetter: undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.error || "Failed to apply");
        return;
      }

      setHasApplied(true);
      setApplicationStatus({
        appliedAt: new Date().toISOString(),
        status: "PENDING",
      });

      alert("Application submitted!");
    } catch (err) {
      console.error(err);
      alert("Unexpected error.");
    }
  };

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:4000/students/${jobId}`);
        const data = await response.json();
        console.log("Job data from API:", data);
        setCoops(data);

        // Fetch application status if user is authenticated
        const token = localStorage.getItem("authToken");
        if (token) {
          try {
            const appliedResponse = await fetch(
              `http://localhost:4000/students/${jobId}/applied`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (appliedResponse.ok) {
              const appliedData = await appliedResponse.json();
              setHasApplied(appliedData.applied);
              setApplicationStatus(appliedData.application);
            }
          } catch (error) {
            console.error("Error fetching application status:", error);
          }
        }

        // Fetch saved status
        if (token) {
          try {
            const savedResponse = await studentApi.getSavedJobs();
            const savedJobIds = new Set(
              savedResponse.savedJobs.map((s) => s.job.id)
            );
            setIsSaved(savedJobIds.has(Number(jobId)));
          } catch (error) {
            console.error("Error fetching saved status:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [jobId]);

  const Element = ({ attributes, children, element }) => {
    switch (element.type) {
      case "code":
        return (
          <pre {...attributes}>
            <code>{children}</code>
          </pre>
        );
      case "bulleted-list":
        return <ul {...attributes}>{children}</ul>;
      case "numbered-list":
        return <ol {...attributes}>{children}</ol>;
      case "list-item":
        return <li {...attributes}>{children}</li>;
      default:
        return <p {...attributes}>{children}</p>;
    }
  };

  const parseSlateContent = (
    content,
    fallbackText = "No content available"
  ) => {
    if (!content || content === "" || content.trim() === "") {
      return [{ type: "paragraph", children: [{ text: fallbackText }] }];
    }
    try {
      const parsed = JSON.parse(content);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return [{ type: "paragraph", children: [{ text: fallbackText }] }];
      }
      return parsed;
    } catch (e) {
      console.error("Failed to parse content:", e);
      return [{ type: "paragraph", children: [{ text: fallbackText }] }];
    }
  };

  // Leaf renderer
  const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) children = <strong>{children}</strong>;
    if (leaf.code) children = <code>{children}</code>;
    if (leaf.italic) children = <em>{children}</em>;
    if (leaf.underline) children = <u>{children}</u>;
    if (leaf.strikethrough) children = <s>{children}</s>;

    return <span {...attributes}>{children}</span>;
  };

  const editor = useMemo(() => withReact(createEditor()), []);
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

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
        <button className="ejv-back-btn" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
            />
          </svg>
          Back 
        </button>

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
            <button
              className="ejv-btn ejv-btn--save"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaved ? (
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                  />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                  />
                </svg>
              )}
              {isSaved ? "Saved" : "Save"}
            </button>
            {hasApplied ? (
              <button className="ejv-btn ejv-btn--applied" disabled>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Applied
                {applicationStatus?.appliedAt
                  ? ` • ${formatRelativeDate(applicationStatus.appliedAt)}`
                  : ""}
              </button>
            ) : (
              <button
                className="ejv-btn ejv-btn--primary"
                onClick={handleApply}
              >
                Apply Now
              </button>
            )}
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
            <Slate
              className="ejv-stat-value"
              editor={editor}
              initialValue={parseSlateContent(
                postingInfo.salary,
                "No salary posted"
              )}
            >
              <Editable
                readOnly
                renderLeaf={renderLeaf}
                renderElement={renderElement}
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

        <section className="ejv-section">
          <h2 className="ejv-section-title">About This Role</h2>
          <Slate
            className="ejv-text"
            editor={editor}
            initialValue={parseSlateContent(
              postingInfo.description,
              "No description available"
            )}
          >
            <Editable
              readOnly
              renderLeaf={renderLeaf}
              renderElement={renderElement}
            />
          </Slate>
        </section>

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

        <section className="ejv-section">
          <h2 className="ejv-section-title">Benefits & Perks</h2>
          <Slate
            className="ejv-text"
            editor={editor}
            initialValue={parseSlateContent(
              postingInfo.benefits,
              "No benefits!"
            )}
          >
            <Editable
              readOnly
              renderLeaf={renderLeaf}
              renderElement={renderElement}
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
          <Slate
            className="ejv-text"
            editor={editor}
            initialValue={parseSlateContent(
              postingInfo.description,
              "No description available"
            )}
          >
            <Editable
              readOnly
              renderLeaf={renderLeaf}
              renderElement={renderElement}
            />
          </Slate>
        </section>
        <section className="ejv-section">
          <h2 className="ejv-section-title">Key Responsibilities</h2>
          <Slate
            className="ejv-text"
            editor={editor}
            initialValue={parseSlateContent(
              postingInfo.responsibilities,
              "No responsibilities given"
            )}
          >
            <Editable
              readOnly
              renderLeaf={renderLeaf}
              renderElement={renderElement}
            />
          </Slate>
        </section>
        <section className="ejv-section">
          <h2 className="ejv-section-title">Qualifications</h2>
          <Slate
            className="ejv-text"
            editor={editor}
            initialValue={parseSlateContent(
              postingInfo.qualification,
              "No qualifications listed"
            )}
          >
            <Editable
              readOnly
              renderLeaf={renderLeaf}
              renderElement={renderElement}
            />
          </Slate>
        </section>
        <section className="ejv-section">
          <h2 className="ejv-section-title">Benefits & Perks</h2>
          <Slate
            className="ejv-text"
            editor={editor}
            initialValue={parseSlateContent(
              postingInfo.benefits,
              "No benefits!"
            )}
          >
            <Editable
              readOnly
              renderLeaf={renderLeaf}
              renderElement={renderElement}
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
