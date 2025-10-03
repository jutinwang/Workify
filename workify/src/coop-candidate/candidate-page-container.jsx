import React, { useState } from 'react';
import JobList from './components/JobList';
import ApplicantFilter from './components/ApplicantFilter';
import ApplicantResults from './components/ApplicantResults';
import CandidateModal from './components/CandidateModal';
import { jobs, jobApplicants } from './data/mockData';
import './styles/App.css';

const EmployerCandidateContainer = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [viewedCandidatesByJob, setViewedCandidatesByJob] = useState({});

  const getFilteredApplicants = () => {
    if (!selectedJob) return [];
    
    const jobSpecificApplicants = jobApplicants[selectedJob.id] || [];
    let filtered = [...jobSpecificApplicants];
    
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (yearFilter) {
      filtered = filtered.filter(app => app.year.includes(yearFilter));
    }
    
    if (sortBy === 'match') {
      filtered.sort((a, b) => parseInt(b.candidateMatch) - parseInt(a.candidateMatch));
    } else if (sortBy === 'recent') {
      filtered.sort((a, b) => parseInt(a.lastActive) - parseInt(b.lastActive));
    }
    
    return filtered;
  };

  const handleCloseModal = () => {
    if (selectedCandidate && selectedJob) {
      setViewedCandidatesByJob(prev => ({
        ...prev,
        [selectedJob.id]: new Set([...(prev[selectedJob.id] || []), selectedCandidate.id])
      }));
    }
    setSelectedCandidate(null);
  };

  const filteredApplicants = getFilteredApplicants();
  const totalApplicants = selectedJob ? (jobApplicants[selectedJob.id] || []).length : 0;
  const currentViewedCandidates = selectedJob ? (viewedCandidatesByJob[selectedJob.id] || new Set()) : new Set();

  return (
    <div className="app">
      <div className="container">
        <JobList 
          jobs={jobs}
          selectedJob={selectedJob}
          onSelectJob={setSelectedJob}
        />

        {selectedJob && (
          <>
            <ApplicantFilter
              selectedJob={selectedJob}
              totalApplicants={totalApplicants}
              filteredCount={filteredApplicants.length}
              searchTerm={searchTerm}
              yearFilter={yearFilter}
              genderFilter={genderFilter}
              sortBy={sortBy}
              onSearchChange={setSearchTerm}
              onYearChange={setYearFilter}
              onGenderChange={setGenderFilter}
              onSortChange={setSortBy}
            />

            <ApplicantResults
              applicants={filteredApplicants}
              onSelectCandidate={setSelectedCandidate}
              viewedCandidates={currentViewedCandidates}
            />
          </>
        )}

        {selectedCandidate && (
          <CandidateModal
            candidate={selectedCandidate}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default EmployerCandidateContainer;