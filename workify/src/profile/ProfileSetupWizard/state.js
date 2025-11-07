export const STEPS = [
  // kept for backward-compat (student Stepper can still read this if needed)
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
  // student
  contact: {
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    portfolio: "",
  },
  education: { school: "", program: "", year: "", expectedGrad: "" },
  work: [],
  skipWork: false,
  files: { resume: null, transcript: null, coverLetter: null },
  skills: [],
  customSkill: "",
  preferences: { location: "", industries: [] },

  // employee
  company: {
    name: "",
    logo: null, // File
    website: "",
    industry: "",
    size: "", // e.g. "1-10", "11-50", ...
    about: "",
    socials: { linkedin: "", twitter: "", instagram: "" },
    careersUrl: "",
  },
  recruiter: {
    name: "",
    title: "",
    email: "",
    phone: "",
    photo: null, // File
    linkedin: "",
  },
  notifyPrefs: {
    methods: ["email"], // "email", "sms", "platform"
    frequency: "daily", // "immediate" | "daily" | "weekly"
  },
};

export function reducer(state, action) {
  switch (action.type) {
    case "NEXT":
      return { ...state, step: state.step + 1 };
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
          action.payload ?? {
            title: "",
            employer: "",
            start: "",
            end: "",
            description: "",
          },
        ],
      };
    case "UPDATE_WORK": {
      const copy = [...state.work];
      copy[action.index] = { ...copy[action.index], ...action.payload };
      return { ...state, work: copy };
    }
    case "REMOVE_WORK":
      return {
        ...state,
        work: state.work.filter((_, i) => i !== action.index),
      };
    case "SET_SKIP_WORK":
      return { ...state, skipWork: action.value };
    case "SET_FILES":
      return { ...state, files: { ...state.files, ...action.payload } };
    case "ADD_SKILL":
      if (!action.skill?.trim()) return state;
      if (state.skills.includes(action.skill.trim())) return state;
      return {
        ...state,
        skills: [...state.skills, action.skill.trim()],
        customSkill: "",
      };
    case "REMOVE_SKILL":
      return {
        ...state,
        skills: state.skills.filter((s) => s !== action.skill),
      };
    case "SET_CUSTOM_SKILL":
      return { ...state, customSkill: action.value };
    case "SET_PREFS":
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload },
      };

    // employee: company/recruiter/notify
    case "SET_COMPANY":
      return { ...state, company: { ...state.company, ...action.payload } };
    case "SET_COMPANY_SOCIALS":
      return {
        ...state,
        company: {
          ...state.company,
          socials: { ...state.company.socials, ...action.payload },
        },
      };
    case "SET_RECRUITER":
      return { ...state, recruiter: { ...state.recruiter, ...action.payload } };
    case "SET_NOTIFY_PREFS":
      return {
        ...state,
        notifyPrefs: { ...state.notifyPrefs, ...action.payload },
      };

    default:
      return state;
  }
}

const URL_RE = /^https?:\/\//i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /[0-9]{7,}/;

export function validateContact(ci) {
  const errors = {};
  if (!ci.fullName.trim()) errors.fullName = "Full name is required.";
  if (!EMAIL_RE.test(ci.email)) errors.email = "Enter a valid email.";
  if (!PHONE_RE.test(ci.phone)) errors.phone = "Enter a valid phone.";
  if (ci.linkedin && !URL_RE.test(ci.linkedin))
    errors.linkedin = "Use a full URL (https://...)";
  if (ci.github && !URL_RE.test(ci.github))
    errors.github = "Use a full URL (https://...)";
  if (ci.portfolio && !URL_RE.test(ci.portfolio))
    errors.portfolio = "Use a full URL (https://...)";
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

export function validateCompany(c) {
  const errors = {};
  if (!c.name.trim()) errors.name = "Company name is required.";
  if (!c.industry.trim()) errors.industry = "Industry is required.";
  if (!c.size.trim()) errors.size = "Company size is required.";
  if (!c.website || !URL_RE.test(c.website))
    errors.website = "Valid https URL required.";
  if (c.careersUrl && !URL_RE.test(c.careersUrl))
    errors.careersUrl = "Use a full URL (https://...)";
  const s = c.socials || {};
  if (s.linkedin && !URL_RE.test(s.linkedin))
    errors.linkedin = "Use a full URL.";
  if (s.twitter && !URL_RE.test(s.twitter)) errors.twitter = "Use a full URL.";
  if (s.instagram && !URL_RE.test(s.instagram))
    errors.instagram = "Use a full URL.";
  return errors;
}

export function validateRecruiter(r) {
  const errors = {};
  if (!r.name.trim()) errors.name = "Recruiter name is required.";
  if (!r.title.trim()) errors.title = "Role / title is required.";
  if (!EMAIL_RE.test(r.email)) errors.email = "Enter a valid work email.";
  if (r.phone && !PHONE_RE.test(r.phone))
    errors.phone = "Enter a valid phone or leave blank.";
  if (r.linkedin && !URL_RE.test(r.linkedin))
    errors.linkedin = "Use a full URL.";
  return errors;
}
