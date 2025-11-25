import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { studentApi } from "../../api/student";
import "./sections.css";

export default function ReviewStep({ state, onBack, onGoto }) {
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
        contact: {
          phoneNumber: state.contact.phone || "",
          linkedInUrl: state.contact.linkedin || undefined,
          githubUrl: state.contact.github || undefined,
          portfolio: state.contact.portfolio || undefined,
        },
        education: [
          {
            program: state.education.program || "",
            yearOfStudy: parseInt(state.education.year) || 1,
            gradDate: state.education.expectedGrad || undefined,
            schoolName: state.education.school || "",
          },
        ],
        experience:
          Array.isArray(state.work) && !state.skipWork
            ? state.work
                .filter((exp) => exp.position && exp.company && exp.startDate)
                .map((exp) => ({
                  title: exp.position,
                  company: exp.company,
                  startDate: exp.startDate,
                  endDate: exp.endDate || undefined,
                  description: exp.description || "",
                }))
            : [],
        files: {
          // Use placeholder URL for file uploads or empty string
          resumeUrl: state.files?.resume
            ? typeof state.files.resume === "string"
              ? state.files.resume
              : "https://placeholder.com/resume.pdf"
            : "",
          transcript: state.files?.transcript
            ? typeof state.files.transcript === "string"
              ? state.files.transcript
              : "https://placeholder.com/transcript.pdf"
            : undefined,
          coverLetter: state.files?.coverLetter
            ? typeof state.files.coverLetter === "string"
              ? state.files.coverLetter
              : "https://placeholder.com/cover.pdf"
            : undefined,
        },
        aboutMe: state.preferences?.bio || "",
        major: state.education.program || "",
        year: parseInt(state.education.year) || 1,
        demographics: state.demographics
          ? {
              gender: state.demographics.gender,
              ethnicity: state.demographics.ethnicity || [],
              optional: state.demographics.optional || [],
            }
          : undefined,
      };

      console.log("Submitting payload:", payload);
      const response = await studentApi.completeProfile(payload);
      console.log("Profile created successfully:", response);
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting profile:", err);
      setError(err.message || "Failed to submit profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="section-card">
        <h2 className="section-title">All set 🎉</h2>
        <p className="section-sub">Your profile has been submitted.</p>
        <div className="actions">
          <button className="btn" onClick={() => onGoto(0)}>
            Create another
          </button>
          <button className="btn" onClick={() => navigate("/jobs")}>
            Get Applying
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
            {JSON.stringify(state.contact, null, 2)}
          </pre>
          <button className="btn link" onClick={() => onGoto(0)}>
            Edit
          </button>
        </div>
        <div className="card light">
          <h3 className="h3">Education</h3>
          <pre className="pre-block">
            {JSON.stringify(state.education, null, 2)}
          </pre>
          <button className="btn link" onClick={() => onGoto(1)}>
            Edit
          </button>
        </div>
        <div className="card light">
          <h3 className="h3">
            Experience{" "}
            {state.skipWork ? "(skipped – will parse from resume)" : ""}
          </h3>
          <pre className="pre-block">{JSON.stringify(state.work, null, 2)}</pre>
          <button className="btn link" onClick={() => onGoto(2)}>
            Edit
          </button>
        </div>
        <div className="card light">
          <h3 className="h3">Files</h3>
          <pre className="pre-block">
            {JSON.stringify(
              {
                resume: !!state.files.resume,
                transcript: !!state.files.transcript,
                coverLetter: !!state.files.coverLetter,
              },
              null,
              2
            )}
          </pre>
          <button className="btn link" onClick={() => onGoto(3)}>
            Edit
          </button>
        </div>
        <div className="card light">
          <h3 className="h3">Skills</h3>
          <pre className="pre-block">
            {JSON.stringify(state.skills, null, 2)}
          </pre>
          <button className="btn link" onClick={() => onGoto(4)}>
            Edit
          </button>
        </div>
        <div className="card light">
          <h3 className="h3">Preferences</h3>
          <pre className="pre-block">
            {JSON.stringify(state.preferences, null, 2)}
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
