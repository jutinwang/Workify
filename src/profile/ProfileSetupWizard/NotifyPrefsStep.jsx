import React from "react";
import "./sections.css";

const METHODS = ["email","sms","platform"];
const FREQS = ["immediate","daily","weekly"];

export default function NotifyPrefsStep({ state, dispatch, onNext, onBack }) {
    const p = state.notifyPrefs;

    function toggleMethod(m) {
        const has = p.methods.includes(m);
        const methods = has ? p.methods.filter(x=>x!==m) : [...p.methods, m];
        dispatch({ type: "SET_NOTIFY_PREFS", payload: { methods }});
    }

    return (
        <div className="section-card">
            <h2 className="section-title">Notification Preferences</h2>
            <p className="section-sub">Choose how you’d like to receive updates.</p>
            <hr />

            <div className="card light">
                <h3 className="h3">Methods</h3>
                <div className="chips">
                    {METHODS.map(m => (
                        <button key={m} type="button"
                                className={"chip"+(p.methods.includes(m)?" selected":"")}
                                onClick={()=>toggleMethod(m)}>{m.toUpperCase()}</button>
                    ))}
                </div>
            </div>

            <label className="field">
                <span className="label">Frequency</span>
                <select className="input" value={p.frequency}
                        onChange={e=>dispatch({type:"SET_NOTIFY_PREFS", payload:{frequency:e.target.value}})}>
                {FREQS.map(f => <option key={f} value={f}>{f[0].toUpperCase()+f.slice(1)}</option>)}
                </select>
            </label>

            <div className="actions">
                <button className="btn" onClick={onBack}>Back</button>
                <button className="btn primary" onClick={onNext}>Continue</button>
            </div>
        </div>
    );
}
