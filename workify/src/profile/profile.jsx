import React, { useState } from "react";
import Card from "../common/Card";
import Section from "../common/Section";
import Modal from "../common/Modal";
import DemographicsModal from "./DemographicsModal";
import Header from "../common/Header";
import "./Profile.css";

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

function HeaderBar() {
  return (
    <div className="header-bar">
      <div className="header-content">
        <div className="header-info">
          <h1 className="header-name">Toluwanimi Emoruwa</h1>
          <p className="header-location">Ottawa, ON · He/Him</p>
          <p className="header-degree">4th Year Student · Bachelor's in Computer Science</p>
          <div className="header-contact">
            <p>temor010@uottawa.ca • +1 (289) 931-2139</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">Share</button>
          <button className="btn-primary">Edit Profile</button>
        </div>
      </div>
    </div>
  );
}

function Stats() {
  const stats = [
    ['7', 'Upcoming\ninterviews'],
    ['2', 'Pending\noffers'],
    ['5', 'Saved\nroles']
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

const Profile = () => {
  const [modals, setModals] = useState({
    about: false,
    demographics: false,
    background: false,
    experience: false,
    preferences: false
  });

  const [formData, setFormData] = useState({
    about: "About section content goes here...",
    demographics: "Demographics content goes here...",
    background: [],
    experience: [],
    preferences: ["Frontend SWE", "Toronto", "Remote", "FinTech", "DevTools"]
  });

  const [newExperience, setNewExperience] = useState({
    title: '',
    company: '',
    duration: '',
    description: '',
    image: ''
  });

  const [newBackground, setNewBackground] = useState('');

  const openModal = (type) => {
    setModals(prev => ({ ...prev, [type]: true }));
  };

  const closeModal = (type) => {
    setModals(prev => ({ ...prev, [type]: false }));
  };

  const handleAddExperience = () => {
    if (newExperience.title && newExperience.company) {
      setFormData(prev => ({
        ...prev,
        experience: [...prev.experience, { ...newExperience, id: Date.now() }]
      }));
      setNewExperience({ title: '', company: '', duration: '', description: '', image: '' });
      closeModal('experience');
    }
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

        <div className="profile-grid">
          <div className="main-content">
            <Section title="About" onEdit={() => openModal('about')}>
              <p>{formData.about}</p>
            </Section>

            <Section title="Demographics" onEdit={() => openModal('demographics')}>
              <p>{formData.demographics}</p>
            </Section>

            <Section title="Background" onEdit={() => openModal('background')}>
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

            <Section title="Experience" onEdit={() => openModal('experience')}>
              <div className="experience-list">
                {formData.experience.map((exp) => (
                  <div key={exp.id} className="experience-item">
                    <div className="experience-content">
                      <div className="experience-header">
                        {exp.image && (
                          <div className="experience-image">
                            <img src={exp.image} alt={exp.company} />
                          </div>
                        )}
                        <div className="experience-details">
                          <h4 className="experience-title">{exp.title}</h4>
                          <p className="experience-company">{exp.company} • {exp.duration}</p>
                        </div>
                      </div>
                      <p className="experience-description">{exp.description}</p>
                    </div>
                  </div>
                ))}
                {formData.experience.length === 0 && (
                  <p className="empty-state">No experience added yet.</p>
                )}
              </div>
            </Section>

            <Section title="Job Preferences" onEdit={() => openModal('preferences')}>
              <div className="preferences-tags">
                {formData.preferences.map(pref => (
                  <span key={pref} className="tag">
                    {pref}
                  </span>
                ))}
              </div>
            </Section>
          </div>

          <aside className="sidebar">
            <Card title="Profile Completion">
              <Ring value={95} />
              <span className="badge">High discoverability</span>
            </Card>

            <Card title="Quick wins">
              <ul className="quick-wins-list">
                <li>Add a 2–3 line About summary</li>
                <li>Pin 5 top skills</li>
                <li>Upload résumé (PDF)</li>
              </ul>
              <button className="btn-full">Open checklist</button>
            </Card>

            <Card title="AI Coach">
              <p className="coach-description">Tailor résumé, fill gaps, prep interviews.</p>
              <div className="coach-tags">
                {['Tailor Resume','Improve Summary','Interview Prep'].map(c => (
                  <span key={c} className="tag small">{c}</span>
                ))}
              </div>
            </Card>

            <Card title="Key stats">
              <Stats />
            </Card>
          </aside>
        </div>

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

        <DemographicsModal
          isOpen={modals.demographics}
          onClose={() => closeModal('demographics')}
          values={formData.demographics}
          onChange={(next) => setFormData(prev => ({ ...prev, demographics: next }))}
        />

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

        <Modal isOpen={modals.experience} onClose={() => closeModal('experience')} title="Add Experience">
          <div className="modal-form">
            <input 
              type="text"
              placeholder="Job Title"
              className="modal-input"
              value={newExperience.title}
              onChange={(e) => setNewExperience(prev => ({ ...prev, title: e.target.value }))}
            />
            <input 
              type="text"
              placeholder="Company"
              className="modal-input"
              value={newExperience.company}
              onChange={(e) => setNewExperience(prev => ({ ...prev, company: e.target.value }))}
            />
            <input 
              type="text"
              placeholder="Duration (e.g., Jan 2023 - Present)"
              className="modal-input"
              value={newExperience.duration}
              onChange={(e) => setNewExperience(prev => ({ ...prev, duration: e.target.value }))}
            />
            <input 
              type="url"
              placeholder="Company Logo URL (optional)"
              className="modal-input"
              value={newExperience.image}
              onChange={(e) => setNewExperience(prev => ({ ...prev, image: e.target.value }))}
            />
            <textarea 
              placeholder="Description"
              className="modal-textarea"
              rows={3}
              value={newExperience.description}
              onChange={(e) => setNewExperience(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <button 
            onClick={handleAddExperience}
            className="modal-save-btn"
          >
            Add Experience
          </button>
        </Modal>
      </div>
    </div>
  );
};

export default Profile;