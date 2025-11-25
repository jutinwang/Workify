import { useState } from "react";
import { useLocation } from "react-router-dom";
import SignupForm from "./SignUpForm";
import LoginForm from "./LoginForm";
import "./AuthTabs.css";

const AuthTabs = () => {
  const [activeTab, setActiveTab] = useState("signup");
  const location = useLocation();
  const isEmployerSignup = location.pathname === "/signup-employer";

  const handleSwitchToSignup = () => {
    setActiveTab("signup");
  };

  const handleSwitchToLogin = () => {
    setActiveTab("login");
  };

  return (
    <div className="auth-tabs">
      <div className="tab-header">
        <button
          className={activeTab === "signup" ? "tab active" : "tab"}
          onClick={() => setActiveTab("signup")}
        >
          {isEmployerSignup ? "Employer Sign Up" : "Sign Up"}
        </button>
        <button
          className={activeTab === "login" ? "tab active" : "tab"}
          onClick={() => setActiveTab("login")}
        >
          {isEmployerSignup ? "Employer Login" : "Log In"}
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "signup" ? (
          <SignupForm
            isEmployer={isEmployerSignup}
            onSwitchToLogin={handleSwitchToLogin}
          />
        ) : (
          <LoginForm
            isEmployer={isEmployerSignup}
            onSwitchToSignup={handleSwitchToSignup}
          />
        )}
      </div>
    </div>
  );
};

export default AuthTabs;
