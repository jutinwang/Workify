import { useState } from "react";
import "./Signup.css";

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
        <span>Pick from the best job postings here on <span style={{fontWeight: "bold"}}>Workify</span></span>
        </div>


        </div>
      </div>

      <div className="right-side-container">
        <h2>Hey</h2>
      </div>
    </div>
  );
};

export default Signup;
