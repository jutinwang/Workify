import React, { useState } from 'react';
// import Navbar from './components/Navbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import Landing from "./Landing.jsx"
import Signup from "./sign-up/Signup.jsx";
import Profile from './profile/profile.jsx';
import Header from './common/Header.jsx';
import Jobs from './jobs/Jobs.jsx';
import ProfileWizard from './profile/ProfileSetupWizard/ProfileWizard.jsx';
import EmployerProfile from './employerprofile/EmployerProfile.jsx';
import PositionWriting from './positionwriting/PositionWriting.jsx'
import InterviewScheduler from './interviewscheduler/InterviewScheduler.jsx';
import EmployerCandidateContainer from './coop-candidate/candidate-page-container.jsx';
import Apps from './apps/Apps.jsx';

export default function App() {

    const location = useLocation();
    const hideHeader = location.pathname === "/" || location.pathname === "/signup" || location.pathname === "/signup-employer";
    const isEmployer = location.pathname.includes("employer");

    return (
        <>
            {!hideHeader && <Header />}
            <Routes>
                <Route path="/" element={<Landing/>} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/signup" element={<Signup isEmployer={isEmployer}/>} />
                <Route path="/profile-wizard" element={<ProfileWizard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/applications" element={<Apps />} />

                {/* Routes for employer stuff */}
                {/* For all employer routing please include employer in the path name */}
                <Route path="/profile-employer" element={<EmployerProfile />} />
                <Route path="/writing" element={<PositionWriting />} />
                <Route path="/employer-interviews" element={<InterviewScheduler />} />
                <Route path="/employer-candidates" element={<EmployerCandidateContainer />} />
                <Route path="/signup-employer" element={<Signup isEmployer={isEmployer}/>} />
                <Route path="/employer-job-writing" element={<PositionWriting />} />
            </Routes>
        </>
    );
}
