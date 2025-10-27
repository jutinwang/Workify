import React from "react";
import "./sections.css";
import Field from "../../common/Field";

export default function EducationStep({ state, dispatch, errors, onNext, onBack }) {
    return (
        <div className="section-card">
            <h2 className="section-title">Education Details</h2>
            <p className="section-sub">Tell employers about your academic background.</p>
            <hr />
            <div className="info-container">
                <Field label="School" error={errors.school}>
                    <input
                        className="input"
                        value={state.education.school}
                        onChange={(e) => dispatch({ type: "SET_EDU", payload: { school: e.target.value } })}
                    />
                </Field>
                <Field label="Program" error={errors.program}>
                    <input
                        className="input"
                        value={state.education.program}
                        onChange={(e) => dispatch({ type: "SET_EDU", payload: { program: e.target.value } })}
                    />
                </Field>
                <Field label="Year of Study" error={errors.year}>
                    <select
                        className="input"
                        value={state.education.year}
                        onChange={(e) => dispatch({ type: "SET_EDU", payload: { year: e.target.value } })}
                    >
                        <option value="">Select…</option>
                        {['1','2','3','4','5+','Grad','Other'].map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </Field>
                <Field label="Expected Graduation (YYYY-MM)">
                    <input
                        className="input"
                        value={state.education.expectedGrad}
                        onChange={(e) => dispatch({ type: "SET_EDU", payload: { expectedGrad: e.target.value } })}
                        placeholder="2026-04"
                    />
                </Field>
            </div>

            <div className="actions">
                <button onClick={onBack} className="btn">Back</button>
                <button onClick={onNext} className="btn primary">Continue</button>
            </div>
        </div>
    );
}