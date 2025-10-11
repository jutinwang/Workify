import { Route, Routes, useLocation, Link } from "react-router-dom";
import "./Landing.css";
import Header from "./common/Header.jsx";
import building from "./assets/building.jpg";
import workplace from "./assets/workplace.jpg";
import penImage from "./assets/pen.jpg";
import fem from "./assets/female-empowerment.jpg";
import animatedGrowth from "./assets/animated-growth-volatile-arrow-open-black.svg";

function Landing() {
  return (
    <div className="landingpage-container">
      <div className="landing-logo">Workify</div>

      <div className="maincontent">
        <div className="maincontent-text">
          <h1>Let’s find what works for you.</h1>
          <p className="landing-description">
            Workify doesn't just find work for you, it finds what works for you.
          </p>

          <Link className="landing-page-explore-link" to="/signup">
            <button className="explore-btn">
              Explore Opportunities <span>→</span>
            </button>
          </Link>

          <div className="landing-line-art">
            <img src={animatedGrowth}></img>
            <h4>Grow your skills and yourself, only at Workify</h4>
          </div>
        </div>

        <div className="right-side">
          <div className="image-card">
            <img src={fem}></img>
          </div>
          <div className="image-card">
            <img src={workplace}></img>
          </div>
          <div className="image-card">
            <img src={penImage}></img>
          </div>
          <div className="image-card">
            <img src={building}></img>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
