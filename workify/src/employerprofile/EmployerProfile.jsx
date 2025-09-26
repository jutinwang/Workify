import React, { useState } from "react";
import Slider from "react-slick";
import Header from "../common/Header";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./EmployerProfile.css";

function Ring({ value = 75 }) {
  const style = {
    background: `conic-gradient(#000000 ${value}%, #f0f0f0 0), radial-gradient(closest-side, #ffffff 70%, transparent 70%)`,
  };
  return (
    <div className="ring-container">
      <div className="ring" style={style} />
      <div className="ring-percentage">{value}%</div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="card">
      {title && <h3 className="card-title">{title}</h3>}
      {children}
    </div>
  );
}

function Section({ title, children, onEdit }) {
  return (
    <section className="section-modern">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        {onEdit && (
          <button className="edit-button" onClick={onEdit}>
            Edit
          </button>
        )}
      </div>
      <div className="section-content">{children}</div>
    </section>
  );
}

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

function HeaderBar() {
  return (
    <div className="header-bar">
      <div className="header-content">
        <div className="header-info">
          <h1 className="header-name">Employer Man</h1>
          <p className="header-location">Ottawa, ON · He/Him</p>
          <p className="header-company">Nokia</p>
          <p className="header-role">Recruiter</p>          
        </div>
        <div className="header-actions">
          {/* <button className="btn-secondary">Share</button> */}
          <button className="btn-primary">Edit Profile</button>
        </div>
      </div>
    </div>
  );
}

function Stats() {
  const stats = [
    ['4', 'Upcoming\ninterviews'],
    ['3', 'Pending\ndecision'],
    ['2', 'Unread\nresumes'],
    ['1', 'Partridge in\na pear tree']
  ];

  return (
    <div className="stats-grid">
      {stats.map(([number, label]) => (
        <div key={label} className="stat-item">
          <strong className="stat-number">{number}</strong>
          <span className="stat-label">{label}</span>
        </div>
      ))}
    </div>
  );
}

function JobPostings() {
const jobs = ["Job 1", "Job 2", "Job 3", "Job 4", "Job 5", "Job 6"];

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    centerMode: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div>
      <h3 className="slide-title">Jobs Posted</h3>
      <div className="job-board">
        <Slider {...settings}>
          {jobs.map((job, index) => (
            <div key={index}>
              <div
                style={{
                  height: "190px",
                  width: "190px",
                  margin: "10px",
                  borderRadius: "12px",
                  backgroundColor: "#f9d4b7",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  padding: "10px",
                  fontWeight: "bold",
                  fontFamily: "PT Sans"
                }}
              >
                {job}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

function OtherEmployees() {
const employees = ["Employer Woman", "Employer Boss", "Employer Recruiter", "Employer Interviewer", "Employer HR", "Employer (Other) Man"];

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    centerMode: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div>
      <h3 className="slide-title">Other Employees</h3>
      <div className="employee-board">
        <Slider {...settings}>
          {employees.map((employee, index) => (
            <div key={index}>
              <div
                style={{
                  height: "190px",
                  width: "190px",
                  margin: "10px",
                  borderRadius: "12px",
                  backgroundColor: "#BAD8E0",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  padding: "10px",
                  fontWeight: "bold",
                  fontFamily: "PT Sans"
                }}
              >
                {employee}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

const EmployerProfile = () => {
  const [modals, setModals] = useState({
    about: false,
    background: false,
  });

  const [formData, setFormData] = useState({
    about: "About section content goes here...",
    background: [],
  });

  const [newBackground, setNewBackground] = useState('');

  const openModal = (type) => {
    setModals(prev => ({ ...prev, [type]: true }));
  };

  const closeModal = (type) => {
    setModals(prev => ({ ...prev, [type]: false }));
  };

  const handleAddBackground = () => {
    if (newBackground.trim()) {
      setFormData(prev => ({
        ...prev,
        background: [...prev.background, newBackground.trim()]
      }));
      setNewBackground('');
      closeModal('background');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <HeaderBar />
        <JobPostings />
        <div className="profile-grid">
          <div className="main-content">
            <Section title="About" className="section-title" onEdit={() => openModal('about')}>
              <p>{formData.about}</p>
            </Section>

            <Section title="Background" className="section-title" onEdit={() => openModal('background')}>
              <div className="background-tags">
                {formData.background.map((item, i) => (
                  <span key={i} className="tag">
                    {item}
                  </span>
                ))}
                {formData.background.length === 0 && (
                  <p className="empty-state">No background items added yet.</p>
                )}
              </div>
            </Section>
          </div>

          <aside className="sidebar">
            <Card title="Key stats">
              <Stats />
            </Card>
          </aside>
        </div>
        <OtherEmployees />

        {/* Modals */}
        <Modal isOpen={modals.about} onClose={() => closeModal('about')} title="Edit About">
          <textarea 
            className="modal-textarea"
            rows={4}
            value={formData.about}
            onChange={(e) => setFormData(prev => ({ ...prev, about: e.target.value }))}
          />
          <button 
            onClick={() => closeModal('about')}
            className="modal-save-btn"
          >
            Save
          </button>
        </Modal>

        <Modal isOpen={modals.background} onClose={() => closeModal('background')} title="Add Background Item">
          <input 
            type="text"
            placeholder="e.g., JavaScript, React, Node.js"
            className="modal-input"
            value={newBackground}
            onChange={(e) => setNewBackground(e.target.value)}
          />
          <button 
            onClick={handleAddBackground}
            className="modal-save-btn"
          >
            Add Item
          </button>
        </Modal>
      </div>
    </div>
  );
};

export default EmployerProfile;