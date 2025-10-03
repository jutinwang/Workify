import React from 'react';
import '../styles/CandidateModal.css';
import Was from '../../assets/wassim.png';


const CandidateModal = ({ candidate, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-candidate-info">
            <img 
              src={Was} 
              alt={candidate.name}
              className="modal-avatar"
            />
            <div>
              <h2 className="modal-name">{candidate.name}</h2>
              <p className="modal-school">{candidate.school} • {candidate.company}</p>
              <p className="modal-year">{candidate.year}</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <button className="expandable-section">
            Profile ▼
          </button>
          <button className="expandable-section">
            Experience ▼
          </button>
          <button className="expandable-section">
            View Resume ▼
          </button>

          <div className="modal-actions">
            <button className="action-btn secondary">
              SCHEDULE
            </button>
            <button className="action-btn secondary">
              SHORTLIST
            </button>
            <button className="action-btn reject">
              REJECT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateModal;
