import { Route, Routes, useLocation, Link } from "react-router-dom";
import "./Landing.css";
import Header from "./common/Header.jsx";
import Carousel from "./components/Carousel.jsx";

function Landing() {
  return (
    <div className="landingpage-container">
      <div className="maincontent">
        <div className="maincontent-text">
          <h1>
            Let’s find what <br></br>
            <span className="highlight">works</span> for you.
          </h1>
          <p>
            You can apply on other platforms, but you can find a job on Workify.
            Workify doesn’t just find work for you, it finds what works for you.
          </p>
          <Link to="/signup">
            <button className="explore-btn">
              Explore Opportunities <span>→</span>
            </button>
          </Link>
        </div>

        <div className="hero-image">
          <Carousel />
        </div>
      </div>
    </div>
  );
}

export default Landing;
