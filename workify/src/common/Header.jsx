import Signup from "../sign-up/Signup";

export default function Header() {

  return (
    <div className="navbar">
      <div className="logo">
        <img src="Workify_Temp_Logo.png"></img>
      </div>
      <ul className="nav-links">
        <li>
          <a href="#">Home</a>
        </li>
        <li>
          <a href="#">Jobs</a>
        </li>
        <li>
          <a href="#">Applications</a>
        </li>
        <li>
          <a href="#">Profile</a>
        </li>
      </ul>
      <div className="account-btns">
        <button className="login-btn">Log In</button>
        <button className="signup-btn" href={Signup.jsx} >Sign Up</button>
      </div>
    </div>
  );
}
