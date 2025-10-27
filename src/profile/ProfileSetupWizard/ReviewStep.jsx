import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './sections.css';

export default function ReviewStep({ state, dispatch, onBack, onGoto }) {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    async function onSubmit() {
        setSubmitting(true);
        // TODO: If skipWork, you might want to call your backend to parse resume now
        // and merge parsed items into `state.work` before posting the final payload.

        const payload = {
            contact: state.contact,
            education: state.education,
            work: state.work,
            skipWork: state.skipWork,
            files: { resume: !!state.files.resume, transcript: !!state.files.transcript, coverLetter: !!state.files.coverLetter },
            skills: state.skills,
            preferences: state.preferences,
        };


        // Demo: simulate a network post
        await new Promise(r => setTimeout(r, 600));

        console.log("Submitting payload:", payload);
        setSubmitted(true);
        setSubmitting(false);
    }

    if (submitted) {
        return (
            <div className="section-card">
                <h2 className="section-title">All set 🎉</h2>
                <p className="section-sub">Your profile has been submitted.</p>
                <div className="actions">
                    <button className="btn" onClick={()=>onGoto(0)}>Create another</button>
                    <button className="btn" onClick={()=>navigate('/jobs')}>Get Applying</button>
                </div>
            </div>
        );
    }

    return (
        <div className="section-card">
            <h2 className="section-title">Review & Confirm</h2>
            <p className="section-sub">Make sure everything looks good before submitting.</p>
            <hr />
            <div className="stack">
                <div className="card light">
                    <h3 className="h3">Contact</h3>
                    <pre className="pre-block">{JSON.stringify(state.contact, null, 2)}</pre>
                    <button className="btn link" onClick={()=>onGoto(0)}>Edit</button>
                </div>
                <div className="card light">
                    <h3 className="h3">Education</h3>
                    <pre className="pre-block">{JSON.stringify(state.education, null, 2)}</pre>
                    <button className="btn link" onClick={()=>onGoto(1)}>Edit</button>
                </div>
                <div className="card light">
                    <h3 className="h3">Experience {state.skipWork ? "(skipped – will parse from resume)" : ""}</h3>
                    <pre className="pre-block">{JSON.stringify(state.work, null, 2)}</pre>
                    <button className="btn link" onClick={()=>onGoto(2)}>Edit</button>
                </div>
                <div className="card light">
                    <h3 className="h3">Files</h3>
                    <pre className="pre-block">{JSON.stringify({
                        resume: !!state.files.resume,
                        transcript: !!state.files.transcript,
                        coverLetter: !!state.files.coverLetter,
                    }, null, 2)}</pre>
                    <button className="btn link" onClick={()=>onGoto(3)}>Edit</button>
                </div>
                <div className="card light">
                    <h3 className="h3">Skills</h3>
                    <pre className="pre-block">{JSON.stringify(state.skills, null, 2)}</pre>
                    <button className="btn link" onClick={()=>onGoto(4)}>Edit</button>
                </div>
                <div className="card light">
                    <h3 className="h3">Preferences</h3>
                    <pre className="pre-block">{JSON.stringify(state.preferences, null, 2)}</pre>
                    <button className="btn link" onClick={()=>onGoto(5)}>Edit</button>
                </div>
            </div>
        
        
            <div className="actions">
                <button onClick={onBack} className="btn">Back</button>
                <button onClick={onSubmit} className="btn primary" disabled={submitting}>{submitting?"Submitting…":"Submit"}</button>
            </div>
        </div>
    );
}