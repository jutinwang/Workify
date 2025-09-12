import React, { useState } from 'react';
// import Navbar from './components/Navbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import Signup from "./sign-up/Signup.jsx";
import Profile from './profile/profile.jsx';
import Header from './common/Header.jsx';

export default function App() {

    const location = useLocation();
    const hideHeader = location.pathname === "/";

    return (
        <>
            {!hideHeader && <Header />}
            <Routes>
                <Route path="/" element={<Signup />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </>
    );
}
