import React, { useEffect, useRef, useState, useCallback } from "react";
import "../jobs/jobs-filter.css";
import { AVAILABLE_PROGRAMS } from "../constants/programs";

// Stable ID helper so React doesn't remount inputs while typing
const mkId = () => Math.random().toString(36).slice(2);

const EMPTY_ROW = () => ({
  _id: mkId(),
  program: "",
  schoolName: "",
  yearOfStudy: "",
  gradDate: "",
});

export default function EducationModal({ isOpen, onClose, values, onChange }) {
  // Initialize once on open; keep all edits local
  const [draft, setDraft] = useState([]);
  const firstInputRef = useRef(null);

  const updateField = useCallback((id, field, value) => {
    setDraft((prev) =>
      prev.map((row) => {
        if (row._id !== id) return row;
        return { ...row, [field]: value };
      })
    );
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const seeded = Array.isArray(values) ? values : [];
    setDraft(
      seeded.map((e) => ({
        _id: mkId(),
        program: e.program || "",
        schoolName: e.schoolName || "",
        yearOfStudy: e.yearOfStudy?.toString() || "",
        gradDate: e.gradDate ? e.gradDate.split("T")[0] : "",
      }))
    );
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const addEducation = () => {
    setDraft((prev) => {
      const next = [...prev, EMPTY_ROW()];
      return next;
    });
    requestAnimationFrame(() => {
      firstInputRef.current?.focus();
    });
  };

  const removeEducation = (id) => {
    setDraft((prev) => prev.filter((e) => e._id !== id));
  };

  const clearAll = () => setDraft([]);

  const apply = () => {
    const cleaned = draft
      .filter((e) => e.program.trim() && e.schoolName.trim())
      .map(({ _id, ...rest }) => ({
        program: rest.program,
        schoolName: rest.schoolName,
        yearOfStudy: rest.yearOfStudy ? parseInt(rest.yearOfStudy) : null,
        gradDate: rest.gradDate || null,
      }));
    onChange(cleaned);
    onClose();
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    boxSizing: "border-box",
  };

  const labelStyle = { fontWeight: 600, marginBottom: 6, display: "block" };
  const twoCol = { display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" };

  return (
    <div className="jobs-filter-modal-overlay" onClick={onClose}>
      <div
        className="jobs-filter-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edu-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="jobs-modal-header">
          <h3 id="edu-modal-title" className="jobs-modal-title">
            Education
          </h3>
          <button
            className="jobs-close-button"
            aria-label="Close"
            onClick={onClose}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="jobs-modal-body" style={{ display: "grid", gap: 16 }}>
          {draft.map((e, idx) => (
            <div
              key={e._id}
              className="jobs-filter-section"
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <h4 className="jobs-filter-section-title" style={{ margin: 0 }}>
                  {`Education ${idx + 1}`}
                </h4>
                <button
                  type="button"
                  title="Remove"
                  aria-label="Remove"
                  onClick={() => removeEducation(e._id)}
                  className="edit-icon-btn"
                  style={{ marginLeft: "auto" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>

              <div
                className="jobs-filter-options"
                style={{ display: "grid", gap: 12, marginTop: 8 }}
              >
                <div>
                  <label style={labelStyle}>Program</label>
                  <select
                    ref={idx === draft.length - 1 ? firstInputRef : null}
                    style={inputStyle}
                    value={e.program}
                    onChange={(ev) =>
                      updateField(e._id, "program", ev.target.value)
                    }
                  >
                    <option value="">Select a program...</option>
                    {AVAILABLE_PROGRAMS.map((program) => (
                      <option key={program} value={program}>
                        {program}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>School Name</label>
                  <input
                    style={inputStyle}
                    type="text"
                    placeholder="University of Ottawa"
                    value={e.schoolName}
                    onChange={(ev) =>
                      updateField(e._id, "schoolName", ev.target.value)
                    }
                  />
                </div>

                <div style={twoCol}>
                  <div>
                    <label style={labelStyle}>Year of Study (optional)</label>
                    <input
                      style={inputStyle}
                      type="number"
                      min="1"
                      max="6"
                      placeholder="3"
                      value={e.yearOfStudy}
                      onChange={(ev) =>
                        updateField(e._id, "yearOfStudy", ev.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>
                      Expected Graduation (optional)
                    </label>
                    <input
                      style={inputStyle}
                      type="date"
                      value={e.gradDate}
                      onChange={(ev) =>
                        updateField(e._id, "gradDate", ev.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="jobs-filter-section">
            <button
              type="button"
              className="jobs-filter-option"
              onClick={addEducation}
              style={{ fontWeight: 600 }}
            >
              + Add education
            </button>
          </div>
        </div>

        <div className="jobs-modal-footer">
          <button
            type="button"
            className="jobs-clear-button"
            onClick={clearAll}
          >
            Clear all
          </button>
          <button
            type="button"
            className="jobs-show-results-button"
            onClick={apply}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
