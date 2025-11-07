import React from "react";
import "./sections.css";

const JOB_TYPES = ["Co-op", "Internship", "Full-time", "Contract"];
const LOCATIONS = ["Remote", "Hybrid", "In-person"];
const INDUSTRIES = [
  "FinTech",
  "GovTech",
  "Startups",
  "AI/ML",
  "E-commerce",
  "Gaming",
  "Healthcare",
];

export default function PreferencesStep({ state, dispatch, onNext, onBack }) {
  function toggle(listKey, value) {
    const curr = state.preferences[listKey];
    const next = curr.includes(value)
      ? curr.filter((v) => v !== value)
      : [...curr, value];
    dispatch({ type: "SET_PREFS", payload: { [listKey]: next } });
  }

  return (
    <div className="section-card">
      <h2 className="section-title">Job Preferences</h2>
      <p className="section-sub">Help us match you to the right roles.</p>
      <hr />

      <div className="info-container">
        <label className="field">
          <span className="label">Work location</span>
          <select
            className="input"
            value={state.preferences.location}
            onChange={(e) =>
              dispatch({
                type: "SET_PREFS",
                payload: { location: e.target.value },
              })
            }
          >
            <option value="">Select…</option>
            {LOCATIONS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span className="label">Industries</span>
          <div className="chips">
            {INDUSTRIES.map((ind) => (
              <button
                key={ind}
                type="button"
                className={
                  "chip" +
                  (state.preferences.industries.includes(ind)
                    ? " selected"
                    : "")
                }
                onClick={() => {
                  const curr = state.preferences.industries;
                  const next = curr.includes(ind)
                    ? curr.filter((v) => v !== ind)
                    : [...curr, ind];
                  dispatch({
                    type: "SET_PREFS",
                    payload: { industries: next },
                  });
                }}
              >
                {ind}
              </button>
            ))}
          </div>
        </label>
      </div>

      <div className="actions">
        <button onClick={onBack} className="btn">
          Back
        </button>
        <button onClick={onNext} className="btn primary">
          Continue
        </button>
      </div>
    </div>
  );
}
