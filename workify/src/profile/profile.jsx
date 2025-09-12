import React from "react";
import Header from "../common/Header";
import "./Profile.css";

const Section = ({ title, children }) => (
  <div className="section">
    <h2>{title}</h2>
    <hr className="section__rule" />
    {children}
  </div>
);

const ProfileHeader = () => (
  <div className="profile-header">
    <div className="profile-info">
      <h1 className="profile-name">Toluwanimi Emoruwa</h1>
      <p className="profile-location">Ottawa, Ontario, CA · He/Him</p>
      <p className="profile-degree">4th Year Student - Bachelor's Degree in Computer Science</p>
      
      <div className="contact-info">
        <h3>Contact Information</h3>
        <p> temor010@uottawa.ca </p>
        <p>+1 (289) 931-2139</p>
      </div>
    </div>
    
    <div className="profile-sidebar">
      <button className="btn btn--primary">Action</button>
      <div className="profile-completion">
        <div className="completion-circle">
          <span className="completion-percentage">95%</span>
        </div>
        <h4>Profile Completion</h4>
        <span className="discoverability-badge">High discoverability</span>
        <p>You have the highest chance of being discovered by recruiters.</p>
      </div>
    </div>
  </div>
);

const Profile = () => {
  return (
    <div className="main">
      <div className="page-container">
        <ProfileHeader />
        
        <Section title="About">
          <p>About section content goes here...</p>
        </Section>
        
        <Section title="Demographics">
          <p>Demographics section content goes here...</p>
        </Section>
        
        <Section title="Background">
          <p>Background section content goes here...</p>
        </Section>
        
        <Section title="Experience">
          <p>Experience section content goes here...</p>
        </Section>
      </div>
    </div>
  );
};

export default Profile;
