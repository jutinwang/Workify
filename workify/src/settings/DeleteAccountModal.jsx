import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./settings.css";

const DeleteAccountModal = ({ onClose, onConfirm }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmation: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleInitialDelete = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setError("");

    if (!formData.password) {
      setError("Password is required");
      return;
    }

    if (formData.confirmation !== "DELETE") {
      setError('You must type "DELETE" to confirm');
      return;
    }

    setLoading(true);
    try {
      await onConfirm(formData.password, formData.confirmation);
      
      // Show success message
      setShowSuccess(true);
      
      // Clear auth token and redirect after 2 seconds
      setTimeout(() => {
        localStorage.removeItem("authToken");
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to delete account");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (showConfirm) {
      setShowConfirm(false);
      setFormData({ password: "", confirmation: "" });
      setError("");
    } else {
      onClose();
    }
  };

  if (showSuccess) {
    return (
      <div className="settings-modal-overlay">
        <div className="settings-modal-container">
          <div className="settings-modal-content">
            <div className="settings-modal-body">
              <div className="settings-success-banner">
                <span className="settings-success-icon">✓</span>
                <span className="settings-success-text">Account Deleted.</span>
              </div>
              <p className="settings-redirect-text">Redirecting to home page...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-modal-overlay" onClick={!loading ? handleCancel : undefined}>
      <div
        className="settings-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="settings-modal-content">
          <div className="settings-modal-header">
            <h2>Delete Account</h2>
            <button
              className="settings-modal-close"
              onClick={handleCancel}
              disabled={loading}
            >
              ×
            </button>
          </div>
          <div className="settings-modal-body">
            {!showConfirm ? (
              <>
                <div className="settings-warning-banner">
                  <span className="settings-warning-icon">⚠</span>
                  <span className="settings-warning-text">
                    This action cannot be undone
                  </span>
                </div>
                <p className="settings-confirm-text">
                  Deleting your account will permanently remove:
                </p>
                <ul className="settings-delete-list">
                  <li>Your profile and personal information</li>
                  <li>All job applications and saved jobs</li>
                  <li>Interview schedules and history</li>
                  <li>All account data and preferences</li>
                </ul>
                <p className="settings-confirm-text">
                  Are you sure you want to continue?
                </p>
              </>
            ) : (
              <>
                {error && (
                  <div className="settings-error-banner">
                    <span className="settings-error-icon">⚠</span>
                    <span className="settings-error-text">{error}</span>
                  </div>
                )}
                <div className="settings-warning-banner">
                  <span className="settings-warning-icon">⚠</span>
                  <span className="settings-warning-text">
                    Final confirmation required
                  </span>
                </div>
                <div className="settings-form-group">
                  <label htmlFor="password" className="settings-label">
                    Enter your password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="settings-input"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="settings-form-group">
                  <label htmlFor="confirmation" className="settings-label">
                    Type "DELETE" to confirm
                  </label>
                  <input
                    type="text"
                    id="confirmation"
                    name="confirmation"
                    className="settings-input"
                    value={formData.confirmation}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="DELETE"
                    required
                  />
                </div>
              </>
            )}
          </div>
          <div className="settings-modal-actions">
            <button
              className="settings-action-btn secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            {!showConfirm ? (
              <button
                className="settings-action-btn danger"
                onClick={handleInitialDelete}
              >
                Delete Account
              </button>
            ) : (
              <button
                className="settings-action-btn danger"
                onClick={handleConfirmDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Confirm Delete"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
