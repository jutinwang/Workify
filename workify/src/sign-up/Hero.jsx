import { useState } from "react";
import "./Hero.css";
import metaLogo from "../assets/metaLogo.png";
import scoLogo from "../assets/scoLogo.png";
import zonLogo from "../assets/zonLogo.png";
import sunLifeLogo from "../assets/sunLifeLogo.png";
import citiBank from "../assets/citiBank.png";
import dellLogo from "../assets/DellLogo.png";
import mastercardLogo from "../assets/mastercard.png";
import wbLogo from "../assets/warnerBros.png";
import wealthsimple from "../assets/wealthsimple.png";
import apple from "../assets/apple.png";
import teslaLogo from "../assets/teslaLogo.png";
import claudeLogo from "../assets/claudeLogo.png";
import openAiLogo from "../assets/openAiLogo.png";
import workifyLogo from "../assets/workifyLogo2.png";
import { Link } from "react-router-dom";

const employerHero = () => {
  return (
    <>
      <div className="hero-text-blocks">
        <div>
          Find the talent that{" "}
          <span className="employer-hero-subtext-span">works for you</span>{" "}
        </div>
      </div>

      <div className="hero-job-container">
        <div className="hero-job-container-blurb">
          Join leading comanies in posting the best co-ops here on{" "}
          <span style={{ fontWeight: "bold", fontFamily: "Rosarivo" }}>
            Workify
          </span>
        </div>
      </div>
    </>
  );
};

const Hero = ({ isEmployer }) => {
  return (
    <div className="hero-text-container">
      <Link className="hero-logo" to={"/"}>
        <img src={workifyLogo} alt="Workify Logo" />
      </Link>
      {isEmployer ? (
        employerHero()
      ) : (
        <>
          <div className="hero-text-blocks">
            <div>Create an Account </div>
            <div>Start Applying</div>
          </div>

          <div className="hero-job-container">
            <div className="hero-job-container-blurb">
              Pick from the best job postings here on{" "}
              <span style={{ fontWeight: "bold", fontFamily: "Rosarivo" }}>
                Workify
              </span>
            </div>
          </div>
        </>
      )}

      <div className="marquee-container">
        <div className="marquee-content">
          <div className="brand-chip">
            <img src={metaLogo} alt="Meta" />
          </div>
          <div className="brand-chip">
            <img src={openAiLogo} alt="Open Ai" />
          </div>
          <div className="brand-chip">
            <img src={apple} alt="Apple" />
          </div>
          <div className="brand-chip">
            <img src={zonLogo} alt="Amazon" />
          </div>
          <div className="brand-chip">
            <img src={sunLifeLogo} alt="Sun Life" />
          </div>
          <div className="brand-chip">
            <img src={claudeLogo} alt="Claude" />
          </div>
          <div className="brand-chip">
            <img src={teslaLogo} alt="Tesla" />
          </div>
          <div className="brand-chip">
            <img src={citiBank} alt="Citibank" />
          </div>
          <div className="brand-chip">
            <img src={scoLogo} alt="Scotiabank" />
          </div>
          <div className="brand-chip">
            <img src={wbLogo} alt="Warner Bros" />
          </div>
          <div className="brand-chip">
            <img src={wealthsimple} alt="Wealthsimple" />
          </div>
          <div className="brand-chip">
            <img src={dellLogo} alt="Dell" />
          </div>
          <div className="brand-chip">
            <img src={mastercardLogo} alt="Mastercard" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
