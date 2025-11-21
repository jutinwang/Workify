import React, { useState, useEffect } from "react";
import "../styles/CandidateModal.css";
import Was from "../../assets/wassim.png";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import WangResume from "../../assets/Justin_Wang_Resume.pdf";
import ChevronDownIcon from "../../common/ChevronDownIcon";
import PDFViewerModal from "./PDFViewerModal";
import { Link } from "react-router-dom";

const formatDate = (dateString) => {
  if (!dateString) return "Present";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
  });
};

const CandidateModal = ({ candidate, jobId, onClose }) => {
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [isShortlisted, setIsShortlisted] = useState(false);

  useEffect(() => {
    // Load shortlist status for this specific job
    const shortlistedData = JSON.parse(
      localStorage.getItem("shortlistedCandidatesByJob") || "{}"
    );
    const jobShortlist = shortlistedData[jobId] || [];
    setIsShortlisted(jobShortlist.includes(candidate.id));
  }, [candidate.id, jobId]);

  const handleShortlist = () => {
    const shortlistedData = JSON.parse(
      localStorage.getItem("shortlistedCandidatesByJob") || "{}"
    );

    if (!shortlistedData[jobId]) {
      shortlistedData[jobId] = [];
    }

    if (isShortlisted) {
      shortlistedData[jobId] = shortlistedData[jobId].filter(
        (id) => id !== candidate.id
      );
    } else {
      shortlistedData[jobId] = [...shortlistedData[jobId], candidate.id];
    }

    localStorage.setItem(
      "shortlistedCandidatesByJob",
      JSON.stringify(shortlistedData)
    );
    setIsShortlisted(!isShortlisted);
  };

  const handleSchedule = () => {
    alert(`Schedule interview with ${candidate.name} for this job`);
  };

  const handleReject = () => {
    if (
      window.confirm(
        `Are you sure you want to reject ${candidate.name} for this position?`
      )
    ) {
      alert(`${candidate.name} has been rejected for this position`);
      onClose();
    }
  };

  const yearText = candidate.yearLabel || (candidate.year ? `Year ${candidate.year}` : "");

  const experience = candidate.experience || [];
  const educations = candidate.educations || [];

  console.log(candidate)

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div className="modal-candidate-info">
              <img
                src={candidate.image || Was}
                alt={candidate.name}
                className="modal-avatar"
              />
              <div>
                <h2 className="modal-name">{candidate.name}</h2>
                <p className="modal-school">
                  {(candidate.school || "University of Ottawa") +
                    (candidate.major ? ` • ${candidate.major}` : "")}
                </p>
                {yearText && <p className="modal-year">{yearText}</p>}
                {candidate.email && (
                  <p className="modal-year" style={{ marginTop: "4px" }}>
                    {candidate.email}
                  </p>
                )}
              </div>
            </div>
            <button className="modal-close" onClick={onClose}>
              ×
            </button>
          </div>

          <div className="modal-body">
            {candidate.aboutMe && (
              <section className="modal-section">
                <h3>About</h3>
                <p>{candidate.aboutMe}</p>
              </section>
            )}

            {experience.length > 0 && (
              <section className="modal-section">
                <h3>Experience</h3>
                <div className="modal-timeline">
                  {experience.map((exp) => (
                    <div key={exp.id} className="modal-timeline-item">
                      <div className="modal-timeline-header">
                        <h4>
                          {exp.title}
                          {exp.company && ` @ ${exp.company}`}
                        </h4>
                        <span className="modal-timeline-dates">
                          {formatDate(exp.startDate)} –{" "}
                          {exp.endDate ? formatDate(exp.endDate) : "Present"}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="modal-timeline-description">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {educations.length > 0 && (
              <section className="modal-section">
                <h3>Education</h3>
                <div className="modal-timeline">
                  {educations.map((ed) => (
                    <div key={ed.id} className="modal-timeline-item">
                      <div className="modal-timeline-header">
                        <h4>
                          {ed.program}
                          {ed.schoolName && ` • ${ed.schoolName}`}
                        </h4>
                        <span className="modal-timeline-dates">
                          {ed.gradDate
                            ? `Grad: ${formatDate(ed.gradDate)}`
                            : ed.yearOfStudy
                            ? `Year ${ed.yearOfStudy}`
                            : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {(candidate.linkedInUrl || candidate.githubUrl) && (
              <section className="modal-section">
                <h3>Links</h3>
                <div className="modal-links">
                  {candidate.linkedInUrl && (
                    <a
                      href={candidate.linkedInUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      LinkedIn
                    </a>
                  )}
                  {candidate.githubUrl && (
                    <a
                      href={candidate.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </section>
            )}

            <button
              className="view-resume-btn"
              onClick={() => setShowPDFModal(true)}
            >
              View {candidate?.name}'s Resume
            </button>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="modal-footer">
            <button
              className={`shortlist-btn ${isShortlisted ? "shortlisted" : ""}`}
              onClick={handleShortlist}
            >
              {isShortlisted ? "Remove from shortlist" : "Shortlist"}
            </button>
            <button className="schedule-btn" onClick={handleSchedule}>
              Schedule Interview
            </button>
            <button className="reject-btn" onClick={handleReject}>
              Reject
            </button>
          </div>
        </div>
      </div>

      {showPDFModal && (
        <PDFViewerModal
          pdfUrl={candidate.resumeUrl || WangResume}
          candidateName={candidate?.name}
          onClose={() => setShowPDFModal(false)}
        />
      )}
    </>
  );
};

export default CandidateModal;
