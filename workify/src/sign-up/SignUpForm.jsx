import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpForm.css";
import "../var.css";
import outlookLogo from "../assets/outlook_logo.png";
import { authApi } from "../api/auth";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const uottawaEmailRegex = /@uottawa\.ca$/i;

const passwordScore = (pwd) => {
  let score = 0;
  if (!pwd) return 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return Math.min(score, 5);
};

const SignupForm = ({ isEmployer, onSwitchToLogin }) => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirm: "",
    agree: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const pwStrength = useMemo(
    () => passwordScore(form.password),
    [form.password]
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Name required.";

    if (!emailRegex.test(form.email)) {
      e.email = "Enter a valid email.";
    } else if (!isEmployer && !uottawaEmailRegex.test(form.email)) {
      e.email = "Students must use a @uottawa.ca email address.";
    }

    if (form.password.length < 8) e.password = "Min 8 characters.";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match.";
    if (!form.agree) e.agree = "You must accept the terms.";
    return e;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setSubmitting(true);
    try {
      if (isEmployer) {
        const response = await authApi.registerEmployer(form);
        if (response.token) {
          localStorage.setItem("authToken", response.token);
          localStorage.setItem("user", JSON.stringify(response.user));
        }
        navigate(`/profile-wizard/employee`);
      } else {
        const response = await authApi.registerStudent(form);
        if (response.token) {
          localStorage.setItem("authToken", response.token);
        }
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
        }
        navigate(`/profile-wizard/student`);
      }
    } catch (err) {
      setErrors({ submit: err.message || "Signup failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="signup-form-container">
      <form className="signup-form" onSubmit={onSubmit} noValidate>
        {errors.submit && (
          <div className="error submit-error">{errors.submit}</div>
        )}

        <div className="field">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            // placeholder="Full Name"
          />
          {errors.fullName && <div className="error">{errors.fullName}</div>}
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {/* <p className="pw-strength">Strength: {pwStrength}/5</p>
                    {errors.password && <p className="error">{errors.password}</p>} */}
        </div>

        <div className="field">
          <label htmlFor="confirm">Confirm Passowrd</label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            value={form.confirm}
            onChange={handleChange}
            required
          />
          {errors.confirm && <div className="error">{errors.confirm}</div>}
        </div>

        <div className="field checkbox">
          <label>
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
            />
            I agree to the Terms & Privacy Policy
          </label>
          {errors.agree && <div className="error">{errors.agree}</div>}
        </div>

        <div className="submit-button-container">
          <button className="submitButton" type="submit" disabled={submitting}>
            {submitting ? "Signing up..." : "Sign Up"}
          </button>
        </div>

        <div className="login-link">
          <p>
            Already have an account?{" "}
            <button
              type="button"
              className="link-button"
              onClick={onSwitchToLogin}
            >
              Log in
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
