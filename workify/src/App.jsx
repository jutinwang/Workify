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

export default function App() {

    const location = useLocation();
    const hideHeader = location.pathname === "/";
    const hideHeaderTemp = location.pathname === "/signup"

    return (
        <>
            {!hideHeader && !hideHeaderTemp && <Header />}
            <Routes>
                <Route path="/" element={<Landing/>} />
                <Route path="/writing" element={<PositionWriting />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile-user" element={<Profile />} />
                <Route path="/profile-employer" element={<EmployerProfile />} />
                <Route path="/jobs" element={<Jobs />} />
            </Routes>
        </>
    );
}
