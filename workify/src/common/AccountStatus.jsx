import { useEffect, useState } from "react";
import { authApi } from "../api/auth";
import "./AccountStatus.css";

export default function AccountStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await authApi.getStatus();
        setStatus(data);
      } catch (error) {
        console.error("Failed to fetch status:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="account-status-container">
        <div className="account-status-card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!status?.authenticated) {
    window.location.href = "/";
    return null;
  }

  // If user is now active (approved/unsuspended), redirect them to their profile
  if (status.status === "active") {
    const redirectPath =
      status.user?.role === "ADMIN"
        ? "/admin"
        : status.user?.role === "EMPLOYER"
        ? "/Workify#/profile-employer"
        : "/Workify#/profile";

    return (
      <div className="account-status-container">
        <div className="account-status-card">
          <div className="status-icon" style={{ fontSize: "4rem" }}>
            ✅
          </div>
          <h1>Account Active!</h1>
          <p className="status-message">
            Your account is now active and ready to use.
          </p>
          <p className="user-info">
            Logged in as: <strong>{status.user?.email}</strong>
          </p>
          <button
            className="logout-btn"
            style={{ background: "#48bb78" }}
            onClick={() => (window.location.href = redirectPath)}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isPendingApproval = status.status === "pending_approval";
  const isSuspended = status.status === "suspended";

  return (
    <div className="account-status-container">
      <div className="account-status-card">
        {isPendingApproval && (
          <>
            <div className="status-icon pending">⏳</div>
            <h1>Account Pending Approval</h1>
            <p className="status-message">
              Your employer account has been submitted and is currently under
              review by our administrators.
            </p>
            <div className="status-details">
              <h3>What happens next?</h3>
              <ul>
                <li>
                  Our team will review your account within 1-2 business days
                </li>
                <li>
                  You'll receive an email notification once your account is
                  approved
                </li>
                <li>
                  After approval, you'll be able to access all platform features
                </li>
              </ul>
            </div>
            <p className="user-info">
              Logged in as: <strong>{status.user?.email}</strong>
            </p>
          </>
        )}

        {isSuspended && (
          <>
            <div className="status-icon suspended">🚫</div>
            <h1>Account Suspended</h1>
            <p className="status-message">
              Your account has been suspended. Please contact support for
              assistance.
            </p>
            <div className="status-details">
              <p>
                If you believe this is an error, please reach out to our support
                team at:
              </p>
              <p className="contact-info">support@workify.ca</p>
            </div>
            <p className="user-info">
              Logged in as: <strong>{status.user?.email}</strong>
            </p>
          </>
        )}

        <button className="logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
}
