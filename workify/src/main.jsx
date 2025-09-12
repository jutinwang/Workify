import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Landing from "./Landing.jsx";
import Signup from "./sign-up/Signup.jsx";
import Login from "./login/Login.jsx"
import Profile from "./profile/profile.jsx";

const pageLinks = [
  { name: "Hone", url: "/home" },
  { name: "Jobs", url: "/Jobs" },
  { name: "Applications", url: "/Applications" },
  { name: "Profile", url: "/Profile" },
];

const accountActionLinks = [
  { name: "Signup", url: "/Signup" },
  { name: "Login", url: "/Login" },
];

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <Landing /> */}
  {/* <Profile /> */}
  <Signup />
  </StrictMode>
);
