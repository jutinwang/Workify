import React, { useEffect, useRef, useState, useCallback } from "react";
import "../jobs/jobs-filter.css";

// Stable ID helper so React doesn't remount inputs while typing
const mkId = () => Math.random().toString(36).slice(2);

const EMPTY_ROW = () => ({
    _id: mkId(),
    jobTitle: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    details: "",
});

export default function ExperiencesModal({ isOpen, onClose, values, onChange }) {
    // Initialize once on open; keep all edits local
    const [draft, setDraft] = useState([]);
    const firstInputRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        const seeded = Array.isArray(values) ? values : [];
        setDraft(
            seeded.map((e) => ({
                _id: mkId(),
                jobTitle: e.jobTitle || "",
                company: e.company || "",
                location: e.location || "",
                startDate: e.startDate || "",
                endDate: e.endDate || "",
                current: !!e.current,
                details: e.details || "",
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

    const addExperience = () => {
        setDraft((prev) => {
            const next = [...prev, EMPTY_ROW()];
            return next;
        });
        requestAnimationFrame(() => {
            firstInputRef.current?.focus();
        });
    };

    const removeExperience = (id) => {
        setDraft((prev) => prev.filter((e) => e._id !== id));
    };

    const updateField = useCallback((id, field, value) => {
        setDraft((prev) =>
            prev.map((row) => {
                if (row._id !== id) return row;
                const next = { ...row, [field]: value };
                if (field === "current" && value) next.endDate = "";
                return next;
            })
        );
    }, []);

    const clearAll = () => setDraft([]);

    const apply = () => {
        const cleaned = draft.map(({ _id, ...rest }) => rest).filter((e) => e.jobTitle.trim() && e.company.trim() && e.startDate);
        onChange(cleaned);
        onClose();
    };

    const inputStyle = {
        width: "100%",
        padding: "10px 12px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        fontSize: "14px",
        boxSizing: "border-box"
    };

    const labelStyle = { fontWeight: 600, marginBottom: 6, display: "block" };
    const twoCol = { display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" };

    return (
        <div className="jobs-filter-modal-overlay" onClick={onClose}>
            <div
                className="jobs-filter-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="exp-modal-title"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="jobs-modal-header">
                    <h3 id="exp-modal-title" className="jobs-modal-title">Experiences</h3>
                    <button className="jobs-close-button" aria-label="Close" onClick={onClose}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                        style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 12 }}
                        >
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <h4 className="jobs-filter-section-title" style={{ margin: 0 }}>
                                    {`Experience ${idx + 1}`}
                                </h4>
                                <button
                                type="button"
                                title="Remove"
                                aria-label="Remove"
                                onClick={() => removeExperience(e._id)}
                                className="edit-icon-btn"
                                style={{ marginLeft: "auto" }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                        <path d="M10 11v6" />
                                        <path d="M14 11v6" />
                                        <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                                    </svg>
                                </button>
                            </div>

                            <div className="jobs-filter-options" style={{ display: "grid", gap: 12, marginTop: 8 }}>
                                <div>
                                    <label style={labelStyle}>Job title</label>
                                    <input
                                        ref={idx === draft.length - 1 ? firstInputRef : null}
                                        style={inputStyle}
                                        type="text"
                                        placeholder="Software Engineer"
                                        value={e.jobTitle}
                                        onChange={(ev) => updateField(e._id, "jobTitle", ev.target.value)}
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>Company</label>
                                    <input
                                        style={inputStyle}
                                        type="text"
                                        placeholder="Example Corp"
                                        value={e.company}
                                        onChange={(ev) => updateField(e._id, "company", ev.target.value)}
                                    />
                                </div>

                                <div style={twoCol}>
                                    <div>
                                        <label style={labelStyle}>Start date</label>
                                        <input
                                        style={inputStyle}
                                        type="month"
                                        value={e.startDate}
                                        onChange={(ev) => updateField(e._id, "startDate", ev.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>End date</label>
                                        <input
                                        style={inputStyle}
                                        type="month"
                                        value={e.current ? "" : e.endDate}
                                        onChange={(ev) => updateField(e._id, "endDate", ev.target.value)}
                                        disabled={e.current}
                                        />
                                    </div>
                                </div>

                                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <input
                                        type="checkbox"
                                        checked={!!e.current}
                                        onChange={(ev) => updateField(e._id, "current", ev.target.checked)}
                                    />
                                    I currently work here
                                </label>

                                <div>
                                    <label style={labelStyle}>Location (optional)</label>
                                    <input
                                        style={inputStyle}
                                        type="text"
                                        placeholder="Toronto, ON • Hybrid"
                                        value={e.location}
                                        onChange={(ev) => updateField(e._id, "location", ev.target.value)}
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>Details</label>
                                    <textarea
                                        style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
                                        placeholder="Briefly describe what you worked on, notable projects, impact, tools…"
                                        value={e.details}
                                        onChange={(ev) => updateField(e._id, "details", ev.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="jobs-filter-section">
                        <button
                        type="button"
                        className="jobs-filter-option"
                        onClick={addExperience}
                        style={{ fontWeight: 600 }}
                        >
                        + Add experience
                        </button>
                    </div>
                </div>

                <div className="jobs-modal-footer">
                    <button type="button" className="jobs-clear-button" onClick={clearAll}>
                        Clear all
                    </button>
                    <button type="button" className="jobs-show-results-button" onClick={apply}>
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
}
