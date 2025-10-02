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
import EmployerSignup from './employer-login/EmployerSignup.jsx';
import Apps from './apps/Apps.jsx';

export default function App() {

    const location = useLocation();
    const hideHeader = location.pathname === "/" || location.pathname === "/signup" || location.pathname === "/signup-employer";

    return (
        <>
            {!hideHeader && <Header />}
            <Routes>
                <Route path="/" element={<Landing/>} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<ProfileWizard />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/applications" element={<Apps />} />

                {/* Routes for employer stuff */}
                {/* Add these routes to URL to see them, not encorperated with current login flow */}
                <Route path="/profile-employer" element={<EmployerProfile />} />
                <Route path="/signup-employer" element={<EmployerSignup />} />
                <Route path="/writing" element={<PositionWriting />} />
            </Routes>
        </>
    );
}
