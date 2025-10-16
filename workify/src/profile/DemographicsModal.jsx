import React, { useEffect, useCallback } from "react";
import "../jobs/jobs-filter.css";

const GENDERS = [
    "Woman",
    "Man",
    "Non-binary",
    "Two-Spirit",
    "Prefer not to say",
];

const ETHNICITIES = [
    "Black",
    "East Asian",
    "South Asian",
    "Southeast Asian",
    "Middle Eastern / North African",
    "Latinx",
    "Indigenous",
    "White",
    "Mixed",
    "Prefer not to say",
];

/**
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - values: {
 *     genders: string[],
 *     ethnicities: string[],
 *     isIndigenous?: boolean,
 *     hasDisability?: boolean,
 *     isVeteran?: boolean
 *   }
 * - onChange: (nextValues) => void
 */
export default function DemographicsModal({ isOpen, onClose, values, onChange }) {
    const { genders = [], ethnicities = [], isIndigenous = false, hasDisability = false, isVeteran = false } = values || {};

    const toggleMulti = useCallback(
        (key, val) => {
            const current = values[key] || [];
            const next = current.includes(val)
                ? current.filter((x) => x !== val)
                : [...current, val];
            onChange({ ...values, [key]: next });
        },
        [values, onChange]
    );

    const toggleFlag = useCallback(
        (key) => onChange({ ...values, [key]: !values[key] }),
        [values, onChange]
    );

    const clearAll = useCallback(() => {
        onChange({
            genders: [],
            ethnicities: [],
            isIndigenous: false,
            hasDisability: false,
            isVeteran: false,
        });
    }, [onChange]);

    // Close on ESC
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="jobs-filter-modal-overlay" onClick={onClose}>
            <div
                className="jobs-filter-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="demo-modal-title"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="jobs-modal-header">
                    <h3 id="demo-modal-title" className="jobs-modal-title">Demographics</h3>
                    <button className="jobs-close-button" aria-label="Close" onClick={onClose}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="jobs-modal-body">
                    <div className="jobs-filter-section">
                        <h4 className="jobs-filter-section-title">Gender</h4>
                        <div className="jobs-filter-options">
                            {GENDERS.map((g) => (
                                <button
                                key={g}
                                type="button"
                                className={`jobs-filter-option ${genders.includes(g) ? "selected" : ""}`}
                                onClick={() => toggleMulti("genders", g)}
                                >
                                {g}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="jobs-filter-section">
                        <h4 className="jobs-filter-section-title">Ethnicity</h4>
                        <div className="jobs-filter-options">
                            {ETHNICITIES.map((e) => (
                                <button
                                key={e}
                                type="button"
                                className={`jobs-filter-option ${ethnicities.includes(e) ? "selected" : ""}`}
                                onClick={() => toggleMulti("ethnicities", e)}
                                >
                                {e}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="jobs-filter-section">
                        <h4 className="jobs-filter-section-title">Optional</h4>
                        <div className="jobs-filter-options">
                            <button
                                type="button"
                                className={`jobs-filter-option ${isIndigenous ? "selected" : ""}`}
                                onClick={() => toggleFlag("isIndigenous")}
                            >
                                Indigenous
                            </button>
                            <button
                                type="button"
                                className={`jobs-filter-option ${hasDisability ? "selected" : ""}`}
                                onClick={() => toggleFlag("hasDisability")}
                            >
                                Person with a disability
                            </button>
                            <button
                                type="button"
                                className={`jobs-filter-option ${isVeteran ? "selected" : ""}`}
                                onClick={() => toggleFlag("isVeteran")}
                            >
                                Veteran
                            </button>
                        </div>
                    </div>

                    <div className="jobs-filter-section" style={{ opacity: 0.85 }}>
                        <small>
                        Your selections are used only to filter postings that explicitly state equity-focused opportunities.
                        They do not identify you to employers.
                        </small>
                    </div>
                </div>

                <div className="jobs-modal-footer">
                    <button type="button" className="jobs-clear-button" onClick={clearAll}>
                        Clear all
                    </button>
                    <button type="button" className="jobs-show-results-button" onClick={onClose}>
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
}
