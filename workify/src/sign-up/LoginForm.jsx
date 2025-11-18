import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";
import "./LoginForm.css";
import "../var.css";
import { Link } from "react-router-dom";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginForm = ({ isEmployer, onSwitchToSignup }) => {
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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((e) => ({ ...e, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const response = await authApi.login(form.email, form.password);

      // Store token and user data
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      console.log("Token: ", JSON.stringify(response.token))
      console.log("User: ", JSON.stringify(response.user))

      // Navigate based on user role
      if (response.user.role === "EMPLOYER") {
        navigate("/profile-employer");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      const errorMessage = err.message || "Login failed. Please try again.";

      // Check if it's an invalid credentials error
      if (errorMessage.includes("Invalid email or password")) {
        setErrors({
          // TODO: We need to update the error response on the Backend.
          email: "",
          general: "Please check your credentials and try again.",
        });
      } else {
        setErrors({ general: errorMessage });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form">
      <form className="login-form" onSubmit={onSubmit} noValidate>
        {errors.general && (
          <p className="error general-error">{errors.general}</p>
        )}

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
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <div className="login-button-container">
          <button className="submitButton" type="submit" disabled={submitting}>
            {submitting ? "Logging in..." : "Login"}
          </button>
        </div>
        <div className="signup-link">
          <p>
            Don't have an account?{" "}
            <button
              className="link-button"
              onClick={onSwitchToSignup}
              type="button"
            >
              Sign up
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
