import React, { useReducer, useState } from "react";
import Stepper from "./Stepper";
import ContactStep from "./ContactStep";
import EducationStep from "./EducationStep";
import ExperienceStep from "./ExperienceStep";
import FilesStep from "./FilesStep";
import SkillsStep from "./SkillsStep";
import PreferencesStep from "./PreferencesStep";
import ReviewStep from "./ReviewStep";
import { initialState, reducer, STEPS, validateContact, validateEducation, validateFiles } from "./state";
import "./profileWizard.css";


export default function ProfileWizard() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [errors, setErrors] = useState({});


    function next() {
        // minimal step-specific validation
        if (state.step === 0) {
            const e = validateContact(state.contact);
            setErrors(e);
            if (Object.keys(e).length) return;
        }
        if (state.step === 1) {
            const e = validateEducation(state.education);
            setErrors(e);
            if (Object.keys(e).length) return;
        }
        if (state.step === 3) {
            const e = validateFiles(state.files);
            setErrors(e);
            if (Object.keys(e).length) return;
        }
        setErrors({});
        dispatch({ type: "NEXT" });
    }
    function back() {
        setErrors({});
        dispatch({ type: "BACK" });
    }
    function goto(i) {
        dispatch({ type: "GOTO", index: i });
    }

    return (
        <div className="wizard">
            <Stepper current={state.step} onGoto={goto} />
            {state.step === 0 && (
                <ContactStep state={state} dispatch={dispatch} errors={errors} onNext={next} />
            )}
            {state.step === 1 && (
                <EducationStep state={state} dispatch={dispatch} errors={errors} onNext={next} onBack={back} />
            )}
            {state.step === 2 && (
                <ExperienceStep state={state} dispatch={dispatch} onNext={next} onBack={back} />
            )}
            {state.step === 3 && (
                <FilesStep state={state} dispatch={dispatch} errors={errors} onNext={next} onBack={back} />
            )}
            {state.step === 4 && (
                <SkillsStep state={state} dispatch={dispatch} onNext={next} onBack={back} />
            )}
            {state.step === 5 && (
                <PreferencesStep state={state} dispatch={dispatch} onNext={next} onBack={back} />
            )}
            {state.step === 6 && (
                <ReviewStep state={state} dispatch={dispatch} onBack={back} onGoto={goto} />
            )}
        </div>
    );
}