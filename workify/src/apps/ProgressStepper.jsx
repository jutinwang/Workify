import { APPLICATION_STEPS, statusToStepIndex } from "./progress";

const ProgressStepper = ({ status }) => {
  const activeIndex = statusToStepIndex(status);

  return (
    <div className="stepper" aria-label={`Application status: ${status}`}>
      {APPLICATION_STEPS.map((label, idx) => {
        const isActive = idx <= activeIndex;
        return (
          <div className="step" key={label}>
            <div className={`dot ${isActive ? "dot-active" : ""}`} />
            <div className={`bar ${idx < APPLICATION_STEPS.length - 1 ? (isActive ? "bar-active" : "") : "bar-end"}`} />
            <span className={`step-label ${isActive ? "step-label-active" : ""}`}>{label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressStepper;

