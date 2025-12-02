import "./Header.css";
import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";
import "../var.css";
import Logo from "../assets/workifyLogo2.png";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await authApi.getStatus();
        setUserStatus(status);

        // Exempt profile wizard routes from redirect - let them complete signup first
        const isProfileWizard = location.pathname.startsWith("/profile-wizard");

        // If user is suspended or pending approval, redirect to status page
        // BUT only if they're not in the profile wizard
        if (
          status.authenticated &&
          !isProfileWizard &&
          (status.status === "suspended" ||
            status.status === "pending_approval")
        ) {
          if (location.pathname !== "/account-status") {
            navigate("/account-status", { replace: true });
          }
        }
      } catch (error) {
        console.error("Failed to fetch status:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [location.pathname, navigate]);

  if (loading || !userStatus?.authenticated) {
    return null;
  }

  // Don't show header if user is suspended or pending approval (unless in profile wizard)
  const isProfileWizard = location.pathname.startsWith("/profile-wizard");
  if (
    !isProfileWizard &&
    (userStatus.status === "suspended" ||
      userStatus.status === "pending_approval")
  ) {
    return null;
  }

  const isEmployer = userStatus.user?.role === "EMPLOYER";
  const isAdmin = userStatus.user?.role === "ADMIN";

  const topRightTextContent = isEmployer
    ? "New Co-op Posting "
    : isAdmin
    ? "Dashboard"
    : "Profile";

  return (
    <div className="navbar">
      <div className="logo">
        <img src={Logo} alt="Workify Logo" className="logo" />
      </div>
      {isAdmin ? (
        <ul className="nav-links">
          <li>
            <Link to="/admin">Dashboard</Link>
          </li>
        </ul>
      ) : isEmployer ? (
        <ul className="nav-links">
          <li>
            <Link to="/profile-employer">Profile & Interviews</Link>
          </li>
          <li>
            <Link to="/employer-candidates">Postings & Applicants</Link>
          </li>
          <li>
            <Link to="/employer-interviews">Adjust Interview Availability</Link>
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
        <Link
          to={
            isAdmin
              ? "/admin"
              : isEmployer
              ? "/employer-job-writing"
              : "/profile"
          }
        >
          {" "}
          {topRightTextContent}{" "}
        </Link>
      </div>
    </div>
  );
}
