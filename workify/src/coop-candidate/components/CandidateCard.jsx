import React from "react";
import "../styles/CandidateCard.css";
import Was from "../../assets/wassim.png";

const CandidateCard = ({ candidate, onClick, viewed }) => {
  const yearText = candidate.yearLabel || (candidate.year ? `Year ${candidate.year}` : "");
  const schoolText = candidate.school || "University of Ottawa";

  return (
    <div
      className={`employer candidate-card ${
        viewed ? "employer candidate-card-viewed" : ""
      } ${
        candidate.shortlisted ? "employer candidate-card-shortlisted" : ""
      }`}
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
            <p className="employer candidate-program">
              {candidate.major || "Student"}
            </p>
          </div>
        </div>

        <div className="employer candidate-badges">
          {candidate.shortlisted && (
            <span className="employer candidate-shortlisted-badge">
              Shortlisted
            </span>
          )}
        </div>
      </div>

      <div className="employer candidate-details">
        <p className="employer candidate-school">
          {schoolText}
          {yearText && ` • ${yearText}`}
        </p>
        <p className="employer candidate-status">
          Status: {candidate.status || "Applied"}
        </p>
      </div>

      {candidate.skills && candidate.skills.length > 0 && (
        <div className="employer candidate-skills-section">
          <p className="employer skills-label">Skills:</p>
          <div className="employer skills-container">
            {candidate.skills.map((skill, idx) => (
              <span key={idx} className="employer skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {candidate.keyCourses && candidate.keyCourses.length > 0 && (
        <div
          className="employer candidate-skills-section"
          style={{ marginTop: "8px" }}
        >
          <p className="employer skills-label">Key Courses:</p>
          <div className="employer candidate-tags">
            {candidate.keyCourses.map((course, idx) => (
              <span key={idx} className="employer candidate-tag">
                {course}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


export default CandidateCard;
