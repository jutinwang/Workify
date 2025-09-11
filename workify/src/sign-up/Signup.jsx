import { useState } from "react";
import "./Signup.css";
import Hero from "./Hero";
import SignupForm from "./SignUpForm";

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
