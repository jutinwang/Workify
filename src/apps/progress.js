export const APPLICATION_STEPS = [
  "Saved",
  "Applied",
  "Assessment",
  "Interview",
  "Offer"
];

export const statusToStepIndex = (status) => {
  const idx = APPLICATION_STEPS.indexOf(status);
  return idx === -1 ? 0 : idx;
};

export const fmtDate = (iso) => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "-";
  }
};
