import { useState } from "react";
import "./Signup.css";
import metaLogo from "../assets/metaLogo.png";
import scoLogo from "../assets/scoLogo.png";
import zonLogo from "../assets/zonLogo.png";
import sunLifeLogo from "../assets/sunLifeLogo.png";

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
              <span style={{ fontWeight: "bold", fontFamily: "Rosarivo"}}>Workify</span>
            </span>
          </div>

          <div class="brand-row">
            <div class="brand-chip">
              <img src={metaLogo} alt="Meta" />
            </div>
            <div class="brand-chip">
              <img src={scoLogo} alt="Scotiabank" />
            </div>
            <div class="brand-chip">
              <img src={zonLogo} alt="Amazon" />
            </div>
            <div class="brand-chip">
              <img src={sunLifeLogo} alt="Sun Life" />
            </div>
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
