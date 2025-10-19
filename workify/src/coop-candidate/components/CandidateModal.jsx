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
    // Get current shortlisted data structure: { jobId: [candidateIds] }
    const shortlistedData = JSON.parse(
      localStorage.getItem("shortlistedCandidatesByJob") || "{}"
    );

    if (!shortlistedData[jobId]) {
      shortlistedData[jobId] = [];
    }

    if (isShortlisted) {
      // Remove from shortlist
      shortlistedData[jobId] = shortlistedData[jobId].filter(
        (id) => id !== candidate.id
      );
    } else {
      // Add to shortlist
      shortlistedData[jobId] = [...shortlistedData[jobId], candidate.id];
    }

    // Save back to localStorage
    localStorage.setItem(
      "shortlistedCandidatesByJob",
      JSON.stringify(shortlistedData)
    );
    setIsShortlisted(!isShortlisted);

    // TODO: When backend is ready, replace with API call:
    // await fetch(`/api/jobs/${jobId}/shortlist`, {
    //   method: isShortlisted ? 'DELETE' : 'POST',
    //   body: JSON.stringify({ candidateId: candidate.id })
    // });
  };

  const handleSchedule = () => {
    // Placeholder for future scheduling functionality
    alert(`Schedule interview with ${candidate.name} for this job`);
    // TODO: Open scheduling interface when implemented
    // TODO: API call: POST /api/jobs/${jobId}/candidates/${candidate.id}/schedule
  };

  const handleReject = () => {
    if (
      window.confirm(
        `Are you sure you want to reject ${candidate.name} for this position?`
      )
    ) {
      // Placeholder for future reject functionality
      alert(`${candidate.name} has been rejected for this position`);
      // TODO: API call: POST /api/jobs/${jobId}/candidates/${candidate.id}/reject
      onClose();
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div className="modal-candidate-info">
              <img src={Was} alt={candidate.name} className="modal-avatar" />
              <div>
                <h2 className="modal-name">{candidate.name}</h2>
                <p className="modal-school">
                  {candidate.school} • {candidate.company}
                </p>
                <p className="modal-year">{candidate.year}</p>
              </div>
            </div>
            <button className="modal-close" onClick={onClose}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="modal-body">
            <Accordion className="expandable-section">
              <AccordionSummary expandIcon={<ChevronDownIcon />}>
                <Typography>Profile Overview</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Here we would display key information from the candidates
                  profile
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion className="expandable-section">
              <AccordionSummary expandIcon={<ChevronDownIcon />}>
                <Typography>Experience</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Within this section ideally we would display their work
                  experience
                </Typography>
              </AccordionDetails>
            </Accordion>

            <button
              className="view-resume-btn"
              onClick={() => setShowPDFModal(true)}
            >
              View {candidate?.name}'s Resume
            </button>

            <div className="modal-actions">
              <Link
                className="action-btn secondary"
                to={"/employer-interviews"}
              >
                SCHEDULE
              </Link>
              <button
                className={`action-btn ${
                  isShortlisted ? "shortlisted" : "secondary"
                }`}
                onClick={handleShortlist}
              >
                {isShortlisted ? "SHORTLISTED ✓" : "SHORTLIST"}
              </button>
              <button className="action-btn reject" onClick={handleReject}>
                REJECT
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPDFModal && (
        <PDFViewerModal
          pdfUrl={WangResume} // TODO: Candidate?.resume
          candidateName={candidate?.name}
          onClose={() => setShowPDFModal(false)}
        />
      )}
    </>
  );
};

export default CandidateModal;
