import "./Header.css";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  // For all employer routing please include employer in the path name
  const isEmployer = location.pathname.includes("employer");
  const topRightTextContent = isEmployer
    ? "New Co-op Posting "
    : "Profile";
  return (
    <div className="navbar">
      <div className="logo">Workify</div>
      {isEmployer ? (
        <ul className="nav-links">
          <li>
            <a href="/profile-employer">View Your Profile</a>
          </li>
          <li>
            <a href="/employer-candidates">Co-op Applicants</a>
          </li>
          <li>
            <a href="/employer-interviews">Interviews & Schedule</a>
          </li>
        </ul>
      ) : (
        <ul className="nav-links">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/jobs">Jobs</a>
          </li>
          <li>
            <a href="/applications">Applications</a>
          </li>
        </ul>
      )}
      <div className="nav-profile">
        <a href={isEmployer ? "/employer-job-writing" : "/profile"}>{topRightTextContent}</a>
      </div>
    </div>
  );
}
