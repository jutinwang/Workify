import { useState } from "react";
import "./Login.css";
import Hero from "./HeroLogin";
// import LoginForm from "./LoginForm";

const Login = () => {
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
          {/* <LoginForm /> */}
        </div>
      </div>
    </div>
  );
};

export default Login;