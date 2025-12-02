import React, { useState } from "react";
import "./settings.css";

const ChangePasswordModal = ({ onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (formData.newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError("New password must be different from current password");
      return;
    }

    setLoading(true);
    try {
      await onConfirm(formData.currentPassword, formData.newPassword);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to change password");
      setLoading(false);
    }
  };

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div
        className="settings-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="settings-modal-content">
          <div className="settings-modal-header">
            <h2>Change Password</h2>
            <button
              className="settings-modal-close"
              onClick={onClose}
              disabled={loading}
            >
              ×
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="settings-modal-body">
              {error && (
                <div className="settings-error-banner">
                  <span className="settings-error-icon">⚠</span>
                  <span className="settings-error-text">{error}</span>
                </div>
              )}
              
              <div className="settings-form-group">
                <label htmlFor="currentPassword" className="settings-label">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  className="settings-input"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>

              <div className="settings-form-group">
                <label htmlFor="newPassword" className="settings-label">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  className="settings-input"
                  value={formData.newPassword}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  minLength={8}
                />
                <small className="settings-hint">
                  Must be at least 8 characters
                </small>
              </div>

              <div className="settings-form-group">
                <label htmlFor="confirmPassword" className="settings-label">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="settings-input"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            </div>
            <div className="settings-modal-actions">
              <button
                type="button"
                className="settings-action-btn secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="settings-action-btn primary"
                disabled={loading}
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
