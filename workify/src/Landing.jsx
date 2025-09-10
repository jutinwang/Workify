import './Landing.css'

function Landing() {
  return (
    <div className="landingpage-container">
      <div className="navbar">
        <div className="logo"><img src='Workify_Temp_Logo.png'></img></div>
        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">Jobs</a></li>
          <li><a href="#">Applications</a></li>
          <li><a href="#">Profile</a></li>
        </ul>
        <div className="account-btns">
            <button className="login-btn">Log In</button>
            <button className="signup-btn">Sign Up</button>
        </div>
      </div>

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
          <button className="explore-btn">
            Explore Opportunities <span>→</span>
          </button>
        </div>

        {/* Placeholder for whatever we put here */}
         <div className="hero-image">
          <div className="image-placeholder"></div>
          <div className="dots">
            <span></span>
            <span></span>
            <span></span>
          </div>   
        </div>
      </div>
    </div>
  )
}

export default Landing
