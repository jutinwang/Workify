import { useState } from "react";
import "./EmployerSignup.css";
import Hero from "./EmployerHero";
import AuthTabs from "../sign-up/AuthTabs";

const EmployerSignup = () => {
  return (
    <div className="split-container">
      <div className="left-side-container">
        <Hero />
      </div>
      <div className="right-side-container">
        <AuthTabs />
      </div>
    </div>
  );
};

export default EmployerSignup;
