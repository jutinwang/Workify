import { useState } from "react";
import { useLocation } from "react-router-dom";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import "./AuthTabs.css";

const AuthTabs = () => {
  const [activeTab, setActiveTab] = useState("signup");
  const location = useLocation();
  const isEmployerSignup = location.pathname === "/signup-employer";

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
          <SignupForm isEmployer={isEmployerSignup} />
        ) : (
          <LoginForm isEmployer={isEmployerSignup}/>
        )}
      </div>
    </div>
  );
};

export default AuthTabs;
