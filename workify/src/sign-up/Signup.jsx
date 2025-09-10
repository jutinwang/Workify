import { useState } from "react";
import "./Signup.css";
import metaLogo from "../assets/metaLogo.png";
import scoLogo from "../assets/scoLogo.png";
import zonLogo from "../assets/zonLogo.png";
import sunLifeLogo from "../assets/sunLifeLogo.png";

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
        <div className="text-container">
          <h2 className="logo-workify">WORKIFY</h2>
          <div className="text-blocks">
            <span>Create an Account </span>
            <span>Start Applying</span>
          </div>
          <div className="subtext">
            <span>
              Pick from the best job postings here on{" "}
              <span style={{ fontWeight: "bold", fontFamily: "Rosarivo" }}>
                Workify
              </span>
            </span>
          </div>
          <div className="brand-row">
            <div className="brand-chip">
              <img src={metaLogo} alt="Meta" />
            </div>
            <div className="brand-chip">
              <img src={scoLogo} alt="Scotiabank" />
            </div>
            <div className="brand-chip">
              <img src={zonLogo} alt="Amazon" />
            </div>
            <div className="brand-chip">
              <img src={sunLifeLogo} alt="Sun Life" />
            </div>
          </div>
        </div>
      </div>
      <div className="right-side-container">
        <div className="sign-up-form-container">
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default Signup;
