import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { studentApi } from "../api/student";
import { employerApi } from "../api/employers";
import ChangePasswordModal from "./ChangePasswordModal";
import DeleteAccountModal from "./DeleteAccountModal";
import "./settings.css";

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userRole, setUserRole] = useState("");
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    workEmail: "",
    workPhone: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setUserRole(user.role);

      let profile;
      if (user.role === "STUDENT") {
        const response = await studentApi.getProfile();
        profile = {
          name: response.user.name,
          email: response.user.email,
          phoneNumber: response.profile.phoneNumber || "",
        };
      } else if (user.role === "EMPLOYER") {
        const response = await employerApi.getProfile();
        profile = {
          name: response.profile.user.name,
          email: response.profile.user.email,
          workEmail: response.profile.workEmail || "",
          workPhone: response.profile.workPhone || "",
        };
      }

      setProfileData(profile);
      setFormData({
        name: profile.name,
        email: profile.email,
        phoneNumber: profile.phoneNumber || profile.workPhone || "",
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccessMessage("");
  };

  const handleSavePersonalInfo = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Validate email for students
    if (userRole === "STUDENT" && formData.email) {
      if (!formData.email.endsWith("@uottawa.ca")) {
        setError("Email must be a uOttawa email (@uottawa.ca)");
        return;
      }
    }

    setSaving(true);
    try {
      const updates = {
        name: formData.name !== profileData.name ? formData.name : undefined,
        email:
          formData.email !== profileData.email ? formData.email : undefined,
      };

      if (userRole === "STUDENT") {
        updates.phoneNumber =
          formData.phoneNumber !== profileData.phoneNumber
            ? formData.phoneNumber
            : undefined;
      } else if (userRole === "EMPLOYER") {
        updates.workPhone =
          formData.phoneNumber !== profileData.workPhone
            ? formData.phoneNumber
            : undefined;
      }

      // Remove undefined values
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([, v]) => v !== undefined)
      );

      if (Object.keys(cleanUpdates).length === 0) {
        setSuccessMessage("No changes to save");
        setSaving(false);
        return;
      }

      if (userRole === "STUDENT") {
        await studentApi.updateAccountInfo(cleanUpdates);
      } else if (userRole === "EMPLOYER") {
        await employerApi.updateAccountInfo(cleanUpdates);
      }

      // Update stored user data
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (cleanUpdates.name) user.name = cleanUpdates.name;
      if (cleanUpdates.email) user.email = cleanUpdates.email;
      localStorage.setItem("user", JSON.stringify(user));

      setSuccessMessage("Personal information updated successfully");
      await fetchProfile(); // Refresh profile
    } catch (err) {
      setError(err.message || "Failed to update personal information");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (currentPassword, newPassword) => {
    if (userRole === "STUDENT") {
      await studentApi.changePassword(currentPassword, newPassword);
    } else if (userRole === "EMPLOYER") {
      await employerApi.changePassword(currentPassword, newPassword);
    }
  };

  const handleDeleteAccount = async (password, confirmation) => {
    if (userRole === "STUDENT") {
      await studentApi.deleteAccount(password, confirmation);
    } else if (userRole === "EMPLOYER") {
      await employerApi.deleteAccount(password, confirmation);
    }
  };

  const handleExportData = async () => {
    setExportLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      let data;
      if (userRole === "STUDENT") {
        const response = await studentApi.getProfile();
        data = {
          exportDate: new Date().toISOString(),
          user: response.user,
          profile: response.profile,
          education: response.education,
          experience: response.experience,
        };
      } else if (userRole === "EMPLOYER") {
        const response = await employerApi.getProfile();
        data = {
          exportDate: new Date().toISOString(),
          user: response.profile.user,
          profile: {
            workEmail: response.profile.workEmail,
            workPhone: response.profile.workPhone,
            availability: response.profile.availability,
            notificationMethod: response.profile.notificationMethod,
          },
          company: response.profile.company,
          jobs: response.profile.jobs,
          interviews: response.profile.interviews,
        };
      }

      // Create and download JSON file
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `workify-data-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccessMessage("Data exported successfully");
    } catch (err) {
      setError(err.message || "Failed to export data");
    } finally {
      setExportLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="settings-page">
        <div className="settings-loading">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "0.5rem",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            className="settings-back-btn"
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              padding: "0.25rem",
              color: "#6b7280",
              transition: "color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.color = "#111827")}
            onMouseOut={(e) => (e.target.style.color = "#6b7280")}
            title="Go back"
          >
            ←
          </button>
          <h1 style={{ margin: 0 }}>Account Settings</h1>
        </div>
        <p>Manage your personal information and account preferences</p>
      </div>

      {/* Personal Information Section */}
      <div className="settings-section">
        <div className="settings-section-header">
          <h2>Personal Information</h2>
          <p>Update your basic account information</p>
        </div>
        <div className="settings-section-body">
          {error && (
            <div className="settings-error-banner">
              <span className="settings-error-icon">⚠</span>
              <span className="settings-error-text">{error}</span>
            </div>
          )}
          {successMessage && (
            <div className="settings-success-message">
              <span className="settings-success-message-icon">✓</span>
              <span className="settings-success-message-text">
                {successMessage}
              </span>
            </div>
          )}
          <form onSubmit={handleSavePersonalInfo}>
            <div className="settings-form-group">
              <label htmlFor="name" className="settings-label">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="settings-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="settings-form-group">
              <label htmlFor="email" className="settings-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="settings-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {userRole === "STUDENT" && (
                <small className="settings-hint">
                  Must be a uOttawa email (@uottawa.ca)
                </small>
              )}
            </div>

            <div className="settings-form-group">
              <label htmlFor="phoneNumber" className="settings-label">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                className="settings-input"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div className="settings-button-group">
              <button
                type="submit"
                className="settings-btn primary"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Security Section */}
      <div className="settings-section">
        <div className="settings-section-header">
          <h2>Security</h2>
          <p>Manage your password and account security</p>
        </div>
        <div className="settings-section-body">
          <div className="settings-form-group">
            <label className="settings-label">Password</label>
            <p className="settings-hint" style={{ marginBottom: "0.75rem" }}>
              Last changed: Never tracked (update to set new password)
            </p>
            <button
              type="button"
              className="settings-btn secondary"
              onClick={() => setShowPasswordModal(true)}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Privacy & Data Section */}
      <div className="settings-section">
        <div className="settings-section-header">
          <h2>Privacy & Data</h2>
          <p>Export or manage your personal data</p>
        </div>
        <div className="settings-section-body">
          <div className="settings-form-group">
            <label className="settings-label">Export Your Data</label>
            <p className="settings-hint" style={{ marginBottom: "0.75rem" }}>
              Download a copy of all your data including profile information,
              {userRole === "STUDENT"
                ? " applications, saved jobs, education, and experience history"
                : " job postings, interviews, and company information"}
              .
            </p>
            <button
              type="button"
              className="settings-btn secondary"
              onClick={handleExportData}
              disabled={exportLoading}
            >
              {exportLoading ? "Exporting..." : "Download Data (JSON)"}
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="settings-section danger-zone">
        <div className="settings-section-header">
          <h2>Danger Zone</h2>
          <p>Irreversible actions that permanently affect your account</p>
        </div>
        <div className="settings-section-body">
          <div className="danger-item">
            <h3>Delete Account</h3>
            <p>
              Once you delete your account, there is no going back. This will
              permanently delete your profile, applications, and all associated
              data.
            </p>
            <button
              type="button"
              className="settings-btn danger"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onConfirm={handleChangePassword}
        />
      )}

      {showDeleteModal && (
        <DeleteAccountModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteAccount}
        />
      )}
    </div>
  );
};

export default Settings;
