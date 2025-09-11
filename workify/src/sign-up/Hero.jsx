import { useState } from "react";
import "./Hero.css";
import metaLogo from "../assets/metaLogo.png";
import scoLogo from "../assets/scoLogo.png";
import zonLogo from "../assets/zonLogo.png";
import sunLifeLogo from "../assets/sunLifeLogo.png";

const Hero = () => {
    return (
        <div className="hero-text-container">
            <div className="logo-workify">WORKIFY</div>

            <div className="hero-text-blocks">
                <div>Create an Account </div>
                <div>Start Applying</div>
            </div>

            <div class="hero-job-conatiner">
                <div className="hero-job-container-blurb"> 
                    Pick from the best job postings here on{" "} <span style={{ fontWeight: "bold", fontFamily: "Rosarivo"}}>Workify</span>
                </div>
                <div className="hero-job-row">
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
    );
};

export default Hero;
