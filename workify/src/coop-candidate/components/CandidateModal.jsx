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
import ScheduleInterviewModal from "./ScheduleInterviewModal";

const CandidateModal = ({ candidate, jobId, onClose }) => {
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  useEffect(() => {
    // Load shortlist status for this specific job (local only for now)
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

    // TODO: later call backend PATCH /applications/:applicationId/shortlist
  };

  const handleSchedule = () => {
    setShowScheduleModal(true);
  };

  const handleScheduleClose = () => {
    setShowScheduleModal(false);
  };

  const handleReject = () => {
    if (
      window.confirm(
        `Are you sure you want to reject ${candidate.name} for this position?`
      )
    ) {
      // TODO: wire to backend status change if you want
      alert(`${candidate.name} has been rejected for this position`);
      onClose();
    }
  };

  const yearText =
    candidate.yearLabel || (candidate.year ? `Year ${candidate.year}` : "");

  const experiences = candidate.experience || [];
  const educations = candidate.educations || [];

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
                {yearText && <p className="modal-year">{yearText} Year</p>}
                {candidate.email && (
                  <p className="modal-year" style={{ marginTop: "4px" }}>
                    {candidate.email}
                  </p>
                )}

                <div className="modal-links-row">
                  {candidate.linkedInUrl && (
                    <Link
                      to={candidate.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="candidate-link"
                    >
                      LinkedIn
                    </Link>
                  )}
                  {candidate.githubUrl && (
                    <Link
                      to={candidate.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="candidate-link"
                    >
                      GitHub
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <button className="modal-close" onClick={onClose}>
              ×
            </button>
          </div>

          <div className="modal-body">
            {(candidate.aboutMe || candidate.summary) && (
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<ChevronDownIcon />}
                  aria-controls="panel-about-content"
                  id="panel-about-header"
                >
                  <Typography>About</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    {candidate.aboutMe || candidate.summary}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            )}

            {experiences.length > 0 && (
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<ChevronDownIcon />}
                  aria-controls="panel-exp-content"
                  id="panel-exp-header"
                >
                  <Typography>Experience</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="experience-list">
                    {experiences.map((exp) => {
                      const start = exp.startDate
                        ? new Date(exp.startDate)
                        : null;
                      const end = exp.endDate ? new Date(exp.endDate) : null;
                      const range =
                        start && end
                          ? `${start.toLocaleDateString("en-CA", {
                              month: "short",
                              year: "numeric",
                            })} – ${end.toLocaleDateString("en-CA", {
                              month: "short",
                              year: "numeric",
                            })}`
                          : start
                          ? `${start.toLocaleDateString("en-CA", {
                              month: "short",
                              year: "numeric",
                            })} – Present`
                          : "";

                      return (
                        <div key={exp.id} className="experience-item">
                          <div className="experience-header">
                            <span className="experience-title">
                              {exp.title}
                            </span>
                            {exp.company && (
                              <span className="experience-company">
                                {" "}
                                • {exp.company}
                              </span>
                            )}
                          </div>
                          {range && (
                            <div className="experience-dates">{range}</div>
                          )}
                          {exp.description && (
                            <p className="experience-description">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </AccordionDetails>
              </Accordion>
            )}

            {educations.length > 0 && (
              <Accordion>
                <AccordionSummary
                  expandIcon={<ChevronDownIcon />}
                  aria-controls="panel-edu-content"
                  id="panel-edu-header"
                >
                  <Typography>Education</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="education-list">
                    {educations.map((edu) => {
                      const grad =
                        edu.gradDate &&
                        new Date(edu.gradDate).toLocaleDateString("en-CA", {
                          month: "short",
                          year: "numeric",
                        });

                      return (
                        <div key={edu.id} className="education-item">
                          <div className="education-header">
                            <span className="education-program">
                              {edu.program}
                            </span>
                            {edu.schoolName && (
                              <span className="education-school">
                                {" "}
                                • {edu.schoolName}
                              </span>
                            )}
                          </div>
                          <div className="education-meta">
                            {edu.yearOfStudy && (
                              <span>Year {edu.yearOfStudy}</span>
                            )}
                            {grad && (
                              <span className="education-grad">
                                Grad: {grad}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionDetails>
              </Accordion>
            )}

            <button
              className="view-resume-btn"
              onClick={() => setShowPDFModal(true)}
            >
              View {candidate?.name}&apos;s Resume
            </button>
          </div>

          <div className="modal-footer">
            <button
              className={`shortlist-btn ${
                isShortlisted ? "shortlisted" : ""
              }`}
              onClick={handleShortlist}
            >
              {isShortlisted ? "Shortlisted" : "Shortlist"}
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

      {showScheduleModal && (
        <ScheduleInterviewModal
          candidate={candidate}
          jobId={jobId}
          onClose={handleScheduleClose}
        />
      )}
    </>
  );
};

export default CandidateModal;
