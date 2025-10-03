import React from "react";
import "../styles/CandidateModal.css";
import Was from "../../assets/wassim.png";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import WangResume from "../../assets/Justin_Wang_Resume.pdf";

const CandidateModal = ({ candidate, onClose }) => {
  return (
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
            <AccordionSummary>
              <Typography> Profile </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Here we would display key information from the candidates
                profile
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion className="expandable-section">
            <AccordionSummary>
              <Typography> Experience </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Within this section ideally we would display{" "}
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion className="expandable-section">
            <AccordionSummary>
              <Typography> View {candidate?.name} Resume </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <iframe
                src={WangResume}
                // src = {candidate.resume}
                width="100%"
                height="600px"
                style={{ border: "none" }}
                title="Candidate Resume"
              />
            </AccordionDetails>
          </Accordion>

          <div className="modal-actions">
            <button className="action-btn secondary">SCHEDULE</button>
            <button className="action-btn secondary">SHORTLIST</button>
            <button className="action-btn reject">REJECT</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateModal;
