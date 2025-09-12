import React, { useState } from 'react';
// import Navbar from './components/Navbar';
import { Route, Routes } from 'react-router-dom';
import Signup from "./sign-up/Signup.jsx";

export default function App() {
    return (
      <Routes>
        <Route path="/" element={<Signup />} />
      </Routes>
    );
}
