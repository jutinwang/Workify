import { useState } from "react";
import "./Signup.css";
import Hero from "./Hero";
import SignupForm from "./SignUpForm";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Sign up for an account</h2>
      <form className="signup-form">
        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Email</label>
          <input
            type="email"
            name="confirmEmail"
            value={formData.confirmEmail}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="register-btn">
          Register
        </button>
      </form>
      <p className="login-link">
        Already have an account? <a href="/login">Log in.</a>
      </p>
    </div>
  );
};

const Signup = () => {
  return (
    <div className="split-container">
      <div className="left-side-container">
        <Hero />
      </div>
      <div className="right-side-container">
        <div className="tab-section">
          Tab Section
        </div>
        <div className="signup-form-conatainer">
          <SignupForm />
        </div>
        
      </div>
    </div>
  );
};

export default Signup;
