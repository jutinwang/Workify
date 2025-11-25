import "./Header.css";
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "../var.css"
import Logo from "../assets/workifyLogo2.png"

export default function Header() {
  const location = useLocation();

  // For all employer routing please include employer in the path name
  const isEmployer = location.pathname.includes("employer");
  const topRightTextContent = isEmployer
    ? "New Co-op Posting "
    : "Profile";
  return (
    <div className="navbar">
      <div className="logo">
        <img src={Logo} alt="Workify Logo" className="logo" />
      </div>
      {isEmployer ? (
        <ul className="nav-links">
          <li>
            <Link to="/profile-employer">View Your Profile</Link>
          </li>
          <li>
            <Link to="/employer-candidates">Postings & Applicants</Link>
          </li>
          <li>
            <Link to="/employer-interviews">Interviews & Schedule</Link>
          </li>
        </ul>
      ) : (
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
           <Link to="/jobs">Postings</Link>
          </li>
          <li>
            <Link to="/applications">Applications & Status</Link>
          </li>
        </ul>
      )}
      <div className="nav-profile">
        <Link to={isEmployer ? "/employer-job-writing" : "/profile"}> {topRightTextContent} </Link>
      </div>
    </div>
  );
}