import React from "react";
import "./sections.css";

export default function RecruiterStep({ state, dispatch, errors = {}, onNext, onBack }) {
    const r = state.recruiter;
    function setRecruiter(p) { dispatch({ type: "SET_RECRUITER", payload: p }); }

    return (
        <div className="section-card">
            <h2 className="section-title">Recruiter Information</h2>
            <p className="section-sub">We’ll use this as the main point of contact.</p>
            <hr />

            <div className="info-container">
                <label className="field">
                    <span className="label">Name</span>
                    <input className="input" value={r.name} onChange={e=>setRecruiter({name:e.target.value})}/>
                    {errors.name && <span className="error">{errors.name}</span>}
                </label>

                <label className="field">
                    <span className="label">Role / Title</span>
                    <input className="input" value={r.title} onChange={e=>setRecruiter({title:e.target.value})}/>
                    {errors.title && <span className="error">{errors.title}</span>}
                </label>

                <label className="field">
                    <span className="label">Work Email</span>
                    <input className="input" value={r.email} onChange={e=>setRecruiter({email:e.target.value})}/>
                    {errors.email && <span className="error">{errors.email}</span>}
                </label>

                <label className="field">
                    <span className="label">Work Phone (optional)</span>
                    <input className="input" value={r.phone} onChange={e=>setRecruiter({phone:e.target.value})}/>
                    {errors.phone && <span className="error">{errors.phone}</span>}
                </label>

                <label className="field">
                    <span className="label">Profile Photo</span>
                    <input className="input" type="file" accept="image/*"
                            onChange={(e)=>setRecruiter({photo: e.target.files?.[0] || null})}/>
                </label>

                <label className="field">
                    <span className="label">LinkedIn (optional)</span>
                    <input className="input" placeholder="https://linkedin.com/in/..."
                            value={r.linkedin} onChange={e=>setRecruiter({linkedin:e.target.value})}/>
                    {errors.linkedin && <span className="error">{errors.linkedin}</span>}
                </label>
            </div>

            <div className="actions">
                <button className="btn" onClick={onBack}>Back</button>
                <button className="btn primary" onClick={onNext}>Continue</button>
            </div>
        </div>
    );
}
