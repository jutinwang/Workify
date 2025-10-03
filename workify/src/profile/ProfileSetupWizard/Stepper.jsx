import React from "react";
import { STEPS } from "./state";
import "./stepper.css";


export default function Stepper({ current, onGoto, steps = [] }) {
    return (
        <ol className="stepper">
            {steps.map((label, i) => (
                <li key={label} className={i === current ? "active" : i < current ? "done" : "idle"}>
                    <button type="button" className="step-btn" onClick={() => onGoto(i)}>
                    <span className="step-index">{i + 1}</span>
                    <span className="step-label">{label}</span>
                    </button>
                    {i < steps.length - 1 && <span className="step-sep" aria-hidden>→</span>}
                </li>
            ))}
        </ol>
    );
}