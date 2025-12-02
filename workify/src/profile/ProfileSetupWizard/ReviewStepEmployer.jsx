import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { employerApi } from "../../api/employers";
import "./sections.css";

export default function ReviewStepEmployer({ state, onBack, onGoto }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function onSubmit() {
    setSubmitting(true);
    setError(null);

    try {
      // Map the wizard state to the backend schema
      const payload = {
        // Company information
        companyId: state.company?.id || undefined, // Include company ID if existing company selected
        companyName: state.company?.name || undefined,
        companyUrl: state.company?.website || undefined,
        companySize: state.company?.size || undefined,
        companyAbout: state.company?.about || undefined,
        companyCareersPage: state.company?.careersPage || undefined,
        companyLinkedInUrl: state.company?.linkedIn || undefined,

        // Recruiter/employer contact information
        workEmail: state.recruiter?.workEmail || undefined,
        workPhone: state.recruiter?.workPhone || undefined,

        // Notification preferences
        availability: state.notifyPrefs?.availability || undefined,
        notificationMethod: state.notifyPrefs?.preferredMethod || undefined,

        // Profile photo if available
        profilePhotoUrl: state.recruiter?.profilePhoto || undefined,
      };

      console.log("Submitting employer profile payload:", payload);
      const response = await employerApi.completeProfile(payload);
      console.log("Employer profile created successfully:", response);
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting employer profile:", err);
      setError(err.message || "Failed to submit profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="section-card">
        <h2 className="section-title">All set 🎉</h2>
        <p className="section-sub">Your employer profile has been submitted.</p>
        <div className="actions">
          <button className="btn" onClick={() => onGoto(0)}>
            Edit Profile
          </button>
          <button className="btn" onClick={() => navigate("/profile-employer")}>
            View Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-card">
      <h2 className="section-title">Review & Confirm</h2>
      <p className="section-sub">
        Make sure everything looks good before submitting.
      </p>

      {error && (
        <div
          className="error-banner"
          style={{
            padding: "1rem",
            backgroundColor: "#fee",
            color: "#c00",
            borderRadius: "4px",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}

      <hr />
      <div className="stack">
        <div className="card light">
          <h3 className="h3">Contact</h3>
          <pre className="pre-block">
            {JSON.stringify(state.recruiter, null, 2)}
          </pre>
          <button className="btn link" onClick={() => onGoto(0)}>
            Edit
          </button>
        </div>
        <div className="card light">
          <h3 className="h3">Company</h3>
          <pre className="pre-block">
            {JSON.stringify(state.company, null, 2)}
          </pre>
          <button className="btn link" onClick={() => onGoto(1)}>
            Edit
          </button>
        </div>
        <div className="card light">
          <h3 className="h3">Preferences</h3>
          <pre className="pre-block">
            {JSON.stringify(state.notifyPrefs, null, 2)}
          </pre>
          <button className="btn link" onClick={() => onGoto(5)}>
            Edit
          </button>
        </div>
      </div>

      <div className="actions">
        <button onClick={onBack} className="btn" disabled={submitting}>
          Back
        </button>
        <button
          onClick={onSubmit}
          className="btn primary"
          disabled={submitting}
        >
          {submitting ? "Submitting…" : "Submit"}
        </button>
      </div>
    </div>
  );
}
