import React, { useReducer, useState, useMemo } from "react";
import Stepper from "./Stepper";
import ContactStep from "./ContactStep";
import EducationStep from "./EducationStep";
import ExperienceStep from "./ExperienceStep";
import FilesStep from "./FilesStep";
import SkillsStep from "./SkillsStep";
import PreferencesStep from "./PreferencesStep";
import ReviewStep from "./ReviewStep";
import { initialState, reducer, validateContact, validateEducation, validateFiles, validateCompany, validateRecruiter } from "./state";
import CompanyStep from "./CompanyStep";
import RecruiterStep from "./RecruiterStep";
import NotifyPrefsStep from "./NotifyPrefsStep";
import "./profileWizard.css";

const STEP_DEFS = {
    contact: { label: "Contact", Component: ContactStep, validate: (s)=>validateContact(s.contact) },
    education: { label: "Education", Component: EducationStep, validate: (s)=>validateEducation(s.education) },
    experience: { label: "Experience", Component: ExperienceStep },
    files: { label: "Files", Component: FilesStep, validate: (s)=>validateFiles(s.files) },
    skills: { label: "Skills", Component: SkillsStep },
    preferences: { label: "Preferences", Component: PreferencesStep },
    review: { label: "Review", Component: ReviewStep },
  
    company: { label: "Company", Component: CompanyStep, validate: (s)=>validateCompany(s.company) },
    recruiter: { label: "Recruiter", Component: RecruiterStep, validate: (s)=>validateRecruiter(s.recruiter) },
    notifications: { label: "Notifications", Component: NotifyPrefsStep },
};
  
const FLOWS = {
    student: ["contact","education","experience","files","skills","preferences","review"],
    employee: ["company","recruiter","notifications","review"],
};

export default function ProfileWizard({ userType = "employee" }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [errors, setErrors] = useState({});
  
    const flow = useMemo(() => FLOWS[userType] || FLOWS.student, [userType]);
    const safeIndex = Math.min(state.step, flow.length - 1);
    const currentKey = flow[safeIndex];
    const current = STEP_DEFS[currentKey];
  
    const labels = flow.map((k) => STEP_DEFS[k].label);
    const Step = current.Component;
  
    function next() {
        if (current.validate) {
            const e = current.validate(state);
            setErrors(e);
            if (e && Object.keys(e).length) return;
        }
        setErrors({});
        if (safeIndex < flow.length - 1) dispatch({ type: "NEXT" });
    }
    function back() {
        setErrors({});
        if (safeIndex > 0) dispatch({ type: "BACK" });
    }
    function goto(i) {
        if (i >= 0 && i < flow.length) {
            setErrors({});
            dispatch({ type: "GOTO", index: i });
        }
    }
  
    return (
        <div className="wizard">
            <Stepper current={safeIndex} onGoto={goto} steps={labels} />
            <Step state={state} dispatch={dispatch} errors={errors} onNext={next} onBack={back} onGoto={goto} />
        </div>
    );
}