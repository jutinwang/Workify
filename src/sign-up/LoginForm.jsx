import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";
import "../var.css";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginForm = ({isEmployer}) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    try {
      console.log("Submitting:", form);
      if (isEmployer) {
        navigate("/profile-employer");
      } else navigate("/profile");
    } catch (err) {
      alert("Login failed: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form">
      <form className="login-form" onSubmit={onSubmit} noValidate>
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
          {errors.email && <p className="error">{errors.email}</p>}
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
        </div>

        <div className="login-button-container">
          <button className="submitButton" type="submit" disabled={submitting}>
            {submitting ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
