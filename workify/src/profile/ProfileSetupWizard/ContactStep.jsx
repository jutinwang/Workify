import React from "react";
import "./sections.css";
import Field from "../../common/Field";

export default function ContactStep({ state, dispatch, errors, onNext }) {
    return (
        <div className="section-card">
            <h2 className="section-title">Contact Information</h2>
            <p className="section-sub">We’ll use this to identify and reach you.</p>
            <hr />
            <div className="info-container">
                <Field label="Full Name" error={errors.fullName}>
                    <input
                        className="input"
                        value={state.contact.fullName}
                        onChange={(e) => dispatch({ type: "SET_CONTACT", payload: { fullName: e.target.value } })}
                        placeholder="Tolu Emoruwa"
                    />
                </Field>
                <Field label="Email" error={errors.email}>
                    <input
                        className="input"
                        value={state.contact.email}
                        onChange={(e) => dispatch({ type: "SET_CONTACT", payload: { email: e.target.value } })}
                        placeholder="you@school.edu"
                    />
                </Field>
                <Field label="Phone" error={errors.phone}>
                    <input
                        className="input"
                        value={state.contact.phone}
                        onChange={(e) => dispatch({ type: "SET_CONTACT", payload: { phone: e.target.value } })}
                        placeholder="+1 555 123 4567"
                    />
                </Field>
                <Field label="LinkedIn (optional)" error={errors.linkedin}>
                    <input
                        className="input"
                        value={state.contact.linkedin}
                        onChange={(e) => dispatch({ type: "SET_CONTACT", payload: { linkedin: e.target.value } })}
                        placeholder="https://www.linkedin.com/in/username"
                    />
                </Field>
                <Field label="GitHub (optional)" error={errors.github}>
                    <input
                        className="input"
                        value={state.contact.github}
                        onChange={(e) => dispatch({ type: "SET_CONTACT", payload: { github: e.target.value } })}
                        placeholder="https://github.com/username"
                    />
                </Field>
                <Field label="Portfolio (optional)" error={errors.portfolio}>
                    <input
                        className="input"
                        value={state.contact.portfolio}
                        onChange={(e) => dispatch({ type: "SET_CONTACT", payload: { portfolio: e.target.value } })}
                        placeholder="https://your-site.com"
                    />
                </Field>
            </div>
            <div className="actions end">
                <button onClick={onNext} className="btn primary">Continue</button>
            </div>
        </div>
    );
}