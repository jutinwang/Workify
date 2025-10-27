import React from "react";
import "../styles/CandidateCard.css";
import Was from "../../assets/wassim.png";

const CandidateCard = ({ candidate, onClick, viewed }) => {
  return (
    <div 
      className={`employer candidate-card ${viewed ? 'employer candidate-card-viewed' : ''}`} 
      onClick={onClick}
    >
      <div className="employer candidate-header">
        <div className="employer candidate-info">
          <img
            src={candidate.image || Was}
            alt={candidate.name}
            className="employer candidate-avatar"
          />
          <div>
            <h3 className="employer candidate-name">{candidate.name}</h3>
            <p className="employer candidate-program">{candidate.company}</p>
          </div>
        </div>
        <span className="employer candidate-match">
          {candidate.candidateMatch}% match
        </span>
      </div>

      <div className="employer candidate-details">
        <p className="employer candidate-school">
          {candidate.school} • {candidate.year}
        </p>
        <p className="employer candidate-status">Status: Relevant Experience</p>
      </div>

      <div className="employer candidate-skills-section">
        <p className="employer skills-label">Skills:</p>
        <div className="employer skills-container">
          {candidate.skills &&
            candidate.skills.map((skill, idx) => (
              <span key={idx} className="employer skill-tag">
                {skill}
              </span>
            ))}
        </div>
      </div>
      <div className="employer candidate-skills-section" style={{ marginTop: "8px" }}>
        <p className="employer skills-label">Key Courses:</p>
        <div className="employer candidate-tags">
          {candidate.keyCourses &&
            candidate.keyCourses.map((course, idx) => (
              <span key={idx} className="employer candidate-tag">
                {course}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
