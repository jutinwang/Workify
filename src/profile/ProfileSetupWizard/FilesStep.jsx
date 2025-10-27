import React from "react";
import "./sections.css";
import Field from "../../common/Field";

export default function FilesStep({ state, dispatch, errors, onNext, onBack }) {
    function handleFile(key, file) {
        dispatch({ type: 'SET_FILES', payload: { [key]: file } });
    }

    return (
        <div className="section-card">
            <h2 className="section-title">File Uploads</h2>
            <p className="section-sub">Upload your documents. Resume is required.</p>
            <hr />
            <div className="info-container">
                <Field label="Resume (PDF)" error={errors.resume}>
                    <input className="input" type="file" accept="application/pdf,.pdf" onChange={(e)=>handleFile('resume', e.target.files?.[0] || null)} />
                </Field>
                <Field label="Transcript (PDF, optional)">
                    <input className="input" type="file" accept="application/pdf,.pdf" onChange={(e)=>handleFile('transcript', e.target.files?.[0] || null)} />
                </Field>
                <Field label="Cover Letter (PDF, optional)">
                    <input className="input" type="file" accept="application/pdf,.pdf" onChange={(e)=>handleFile('coverLetter', e.target.files?.[0] || null)} />
                </Field>
            </div>

            <div className="actions">
                <button onClick={onBack} className="btn">Back</button>
                <button onClick={onNext} className="btn primary">Continue</button>
            </div>
        </div>
    );
}