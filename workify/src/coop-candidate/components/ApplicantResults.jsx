import React from 'react';
import CandidateCard from './CandidateCard';
import '../styles/App.css';
import '../styles/ApplicantResults.css';

const ApplicantResults = ({ applicants, onSelectCandidate, viewedCandidates }) => {
  return (
    <div className="card">
      <div className="results-container">
        <div className="results-grid">
          {applicants.map(applicant => (
            <CandidateCard
              key={applicant.id}
              candidate={applicant}
              onClick={() => onSelectCandidate(applicant)}
              viewed={viewedCandidates.has(applicant.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplicantResults;
