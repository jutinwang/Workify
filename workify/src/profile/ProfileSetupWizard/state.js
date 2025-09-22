export const STEPS = [
    "Contact",
    "Education",
    "Experience",
    "Files",
    "Skills",
    "Preferences",
    "Review",
];

export const initialState = {
    step: 0,
    contact: { fullName: "", email: "", phone: "", linkedin: "", github: "", portfolio: "" },
    education: { school: "", program: "", year: "", expectedGrad: "" },
    work: [],
    skipWork: false,
    files: { resume: null, transcript: null, coverLetter: null },
    skills: [],
    customSkill: "",
    preferences: { jobTypes: ["Co-op"], location: "", industries: [] },
};

export function reducer(state, action) {
    switch (action.type) {
        case "NEXT":
            return { ...state, step: Math.min(state.step + 1, 6) };
        case "BACK":
            return { ...state, step: Math.max(state.step - 1, 0) };
        case "GOTO":
            return { ...state, step: action.index };
        case "SET_CONTACT":
            return { ...state, contact: { ...state.contact, ...action.payload } };
        case "SET_EDU":
            return { ...state, education: { ...state.education, ...action.payload } };
        case "ADD_WORK":
            return {
                ...state,
                work: [
                ...state.work,
                action.payload ?? { title: "", employer: "", start: "", end: "", description: "" },
                ],
            };
        case "UPDATE_WORK": {
            const copy = [...state.work];
            copy[action.index] = { ...copy[action.index], ...action.payload };
            return { ...state, work: copy };
        }
        case "REMOVE_WORK":
            return { ...state, work: state.work.filter((_, i) => i !== action.index) };
        case "SET_SKIP_WORK":
            return { ...state, skipWork: action.value };
        case "SET_FILES":
            return { ...state, files: { ...state.files, ...action.payload } };
        case "ADD_SKILL":
            if (!action.skill?.trim()) return state;
            if (state.skills.includes(action.skill.trim())) return state;
            return { ...state, skills: [...state.skills, action.skill.trim()], customSkill: "" };
        case "REMOVE_SKILL":
            return { ...state, skills: state.skills.filter((s) => s !== action.skill) };
        case "SET_CUSTOM_SKILL":
            return { ...state, customSkill: action.value };
        case "SET_PREFS":
            return { ...state, preferences: { ...state.preferences, ...action.payload } };
        default:
            return state;
    }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /[0-9]{7,}/;

export function validateContact(ci) {
    const errors = {};
    if (!ci.fullName.trim()) errors.fullName = "Full name is required.";
    if (!EMAIL_RE.test(ci.email)) errors.email = "Enter a valid email.";
    if (!PHONE_RE.test(ci.phone)) errors.phone = "Enter a valid phone.";
    if (ci.linkedin && !/^https?:\/\//.test(ci.linkedin)) errors.linkedin = "Use a full URL (https://...)";
    if (ci.github && !/^https?:\/\//.test(ci.github)) errors.github = "Use a full URL (https://...)";
    if (ci.portfolio && !/^https?:\/\//.test(ci.portfolio)) errors.portfolio = "Use a full URL (https://...)";
    return errors;
}

export function validateEducation(ed) {
    const errors = {};
    if (!ed.school.trim()) errors.school = "School is required.";
    if (!ed.program.trim()) errors.program = "Program is required.";
    if (!ed.year) errors.year = "Select your year of study.";
    return errors;
}

export function validateFiles(files) {
    const errors = {};
    if (!files.resume) errors.resume = "Resume is required.";
    return errors;
}