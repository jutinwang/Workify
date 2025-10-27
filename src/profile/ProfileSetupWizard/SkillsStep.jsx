import React from "react";
import "./sections.css";


const TECH = ["React","Node.js","Python","Java","C++","TypeScript","SQL","PostgreSQL","MongoDB","AWS","Docker","Git","HTML/CSS"];
const SOFT = ["Communication","Teamwork","Leadership","Problem Solving","Time Management"];


export default function SkillsStep({ state, dispatch, onNext, onBack }) {
    function toggle(skill) {
        if (state.skills.includes(skill)) dispatch({ type: 'REMOVE_SKILL', skill });
        else dispatch({ type: 'ADD_SKILL', skill });
    }


    return (
        <div className="section-card">
            <h2 className="section-title">Skills & Competencies</h2>
            <p className="section-sub">Choose from presets or add your own.</p>
            <hr />
            <div className="stack">
                <div className="card light">
                    <h3 className="h3">Technical</h3>
                    <div className="chips">
                        {TECH.map(s => (
                            <button key={s} type="button" className={"chip" + (state.skills.includes(s)?" selected":"")} onClick={()=>toggle(s)}>{s}</button>
                        ))}
                    </div>
                </div>
                <div className="card light">
                    <h3 className="h3">Soft Skills</h3>
                    <div className="chips">
                    {SOFT.map(s => (
                        <button key={s} type="button" className={"chip" + (state.skills.includes(s)?" selected":"")} onClick={()=>toggle(s)}>{s}</button>
                    ))}
                </div>
            </div>

            <div className="card light add-skill">
                <label className="field">
                    <span className="label">Add Custom Skill</span>
                    <div className="row">
                        <input className="input flex" value={state.customSkill} onChange={(e)=>dispatch({type:'SET_CUSTOM_SKILL', value:e.target.value})} placeholder="e.g., Next.js"/>
                        <button className="btn" type="button" onClick={()=>dispatch({type:'ADD_SKILL', skill: state.customSkill})}>Add</button>
                    </div>
                </label>
                {!!state.skills.length && (
                    <p className="muted">Selected: {state.skills.join(", ")}</p>
                )}
                </div>
            </div>

            <div className="actions">
                <button onClick={onBack} className="btn">Back</button>
                <button onClick={onNext} className="btn primary">Continue</button>
            </div>
        </div>
    );
}