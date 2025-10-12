import { useState } from "react";
import "./Signup.css";
import "../var.css"
import Hero from "./Hero";
import SignupForm from "./SignUpForm";
import AuthTabs from "./AuthTabs";

const Signup = ({isEmployer}) => {
  return (
    <div className="split-container">
      <div className="left-side-container">
        <Hero isEmployer={isEmployer}/>
      </div>
      <div className="right-side-container">
        <AuthTabs />
      </div>
    </div>
  );
};

export default Signup;
