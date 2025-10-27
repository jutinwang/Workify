import React from "react";
import Field from "../../common/Field";
import './sections.css';

export default function ExperienceStep({ state, dispatch, onNext, onBack }) {
    return (
        <div className="section-card">
            <h2 className="section-title">Work Experience (Optional)</h2>
            <p className="section-sub">Add entries or skip and we’ll parse from your resume later.</p>
            <hr />
            <label className="checkbox">
                <input
                    type="checkbox"
                    checked={state.skipWork}
                    onChange={(e) => dispatch({ type: "SET_SKIP_WORK", value: e.target.checked })}
                />
                <span>Skip manual input (parse from resume)</span>
            </label>

            {!state.skipWork && (
                <div className="stack">
                    {state.work.map((w, i) => (
                        <div key={i} className="card light">
                            <div className="info-container">
                                <Field label="Title">
                                    <input className="input" value={w.title} onChange={(e)=>dispatch({type:'UPDATE_WORK', index:i, payload:{title:e.target.value}})} />
                                </Field>
                                <Field label="Employer">
                                    <input className="input" value={w.employer} onChange={(e)=>dispatch({type:'UPDATE_WORK', index:i, payload:{employer:e.target.value}})} />
                                </Field>
                                <Field label="Start (YYYY-MM)">
                                    <input className="input" value={w.start} onChange={(e)=>dispatch({type:'UPDATE_WORK', index:i, payload:{start:e.target.value}})} />
                                </Field>
                                <Field label="End (YYYY-MM or Present)">
                                    <input className="input" value={w.end} onChange={(e)=>dispatch({type:'UPDATE_WORK', index:i, payload:{end:e.target.value}})} />
                                </Field>
                                <Field label="Description">
                                    <textarea className="input" rows={3} value={w.description} onChange={(e)=>dispatch({type:'UPDATE_WORK', index:i, payload:{description:e.target.value}})} />
                                </Field>
                            </div>
                            <div className="actions end">
                                <button className="btn danger" onClick={()=>dispatch({type:'REMOVE_WORK', index:i})}>Remove</button>
                            </div>
                        </div>
                    ))}

                    <button className="btn" onClick={()=>dispatch({type:'ADD_WORK'})}>+ Add Experience</button>
                </div>
            )}

            <div className="actions">
                <button onClick={onBack} className="btn">Back</button>
                <button onClick={onNext} className="btn primary">Continue</button>
            </div>
        </div>
    );
}