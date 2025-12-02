import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { studentApi } from "../api/student";
import Card from "../common/Card";
import Section from "../common/Section";
import Modal from "../common/Modal";
import DemographicsModal from "./DemographicsModal";
import ExperiencesModal from "./ExperiencesModal";
import EducationModal from "./EducationModal";
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

function HeaderBar({ profile, user }) {
  const navigate = useNavigate();
  
  if (!profile || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="header-bar">
      <div className="header-content">
        <div className="header-info">
          <h1 className="header-name">{user.name || 'Student'}</h1>
          <p className="header-location">
            {profile.phoneNumber ? `${profile.phoneNumber}` : 'Location not set'}
          </p>
          <p className="header-degree">
            {profile.year ? `${profile.year}${getOrdinalSuffix(profile.year)} Year Student` : 'Student'} 
            {profile.major ? ` · ${profile.major}` : ''}
          </p>
          <div className="header-contact">
            <p>
              {user.email}
              {profile.phoneNumber && ` • ${profile.phoneNumber}`}
            </p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">Share</button>
          <button 
            className="btn-icon" 
            onClick={() => navigate('/settings')}
            title="Settings"
            style={{ 
              marginLeft: '0.5rem',
              padding: '0.5rem 0.75rem',
              fontSize: '1.25rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              background: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#f3f4f6'}
            onMouseOut={(e) => e.target.style.background = 'white'}
          >
            ⚙️
          </button>
        </div>
      </div>
      <div className="header-links">
        {profile.resumeUrl && (
          <div className="header-link-item">
            <div className="header-link-top">Resume</div>
            <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="header-link">
              View Resume
            </a>
          </div>
        )}
        {profile.linkedInUrl && (
          <div className="header-link-item">
            <div className="header-link-top">LinkedIn</div>
            <a href={profile.linkedInUrl} target="_blank" rel="noopener noreferrer" className="header-link">
              View LinkedIn
            </a>
          </div>
        )}
        {profile.githubUrl && (
          <div className="header-link-item">
            <div className="header-link-top">GitHub</div>
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="header-link">
              View GitHub
            </a>
          </div>
        )}
        {profile.portfolio && (
          <div className="header-link-item">
            <div className="header-link-top">Portfolio</div>
            <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="header-link">
              View Portfolio
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function getOrdinalSuffix(num) {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
}

function Stats({ interviews = 0, offers = 0, savedJobs = 0 }) {
  const stats = [
    [interviews.toString(), 'Upcoming\ninterviews'],
    [offers.toString(), 'Pending\noffers'],
    [savedJobs.toString(), 'Saved\nroles']
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

// Helper function to map database enums to display text
const formatGender = (gender) => {
  const genderMap = {
    'WOMAN': 'Woman',
    'MAN': 'Man',
    'NON_BINARY': 'Non-Binary',
    'TWO_SPIRIT': 'Two-Spirit',
    'PREFER_NOT_TO_SAY': 'Prefer not to say'
  };
  return genderMap[gender] || gender;
};

const formatEthnicity = (ethnicity) => {
  const ethnicityMap = {
    'BLACK': 'Black',
    'EAST_ASIAN': 'East Asian',
    'SOUTH_ASIAN': 'South Asian',
    'SOUTHEAST_ASIAN': 'Southeast Asian',
    'MENA': 'MENA',
    'LATINX': 'Latinx',
    'WHITE': 'White',
    'MIXED': 'Mixed',
    'PREFER_NOT_TO_SAY': 'Prefer not to say'
  };
  return ethnicityMap[ethnicity] || ethnicity;
};

const formatIdentityFlag = (flag) => {
  const flagMap = {
    'INDIGENOUS': 'Indigenous',
    'DISABILITY': 'Person with a disability',
    'VETERAN': 'Veteran'
  };
  return flagMap[flag] || flag;
};

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    interviews: 0,
    offers: 0,
    savedJobs: 0
  });

  const [modals, setModals] = useState({
    about: false,
    demographics: false,
    background: false,
    experience: false,
    preferences: false
  });

  const [formData, setFormData] = useState({
    about: "",
    demographics: {
      genders: [],
      ethnicities: [],
      isIndigenous: false,
      hasDisability: false,
      isVeteran: false,
    },
    experiences: [],
    background: [],
    preferences: [],
  });

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await studentApi.getProfile();
        
        console.log('Fetched profile data:', data);
        
        setUserData(data);
        
        // Transform the data to match your component's format
        setFormData({
          about: data.profile.aboutMe || "No about information added yet.",
          demographics: {
            genders: data.profile.gender ? [data.profile.gender] : [],
            ethnicities: data.profile.ethnicity || [],
            isIndigenous: data.profile.optional?.includes('INDIGENOUS') || false,
            hasDisability: data.profile.optional?.includes('DISABILITY') || false,
            isVeteran: data.profile.optional?.includes('VETERAN') || false,
          },
          experiences: data.experience || [],
          background: data.education || [],
          preferences: [], // You can populate this from preferences if you add them
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        // Fetch interviews
        const interviewsData = await studentApi.getInterviews();
        const upcomingInterviews = interviewsData.filter(
          interview => interview.status === 'PENDING' || interview.status === 'SCHEDULED'
        ).length;

        // Fetch applications for offers
        const applicationsData = await studentApi.getApplications();
        const pendingOffers = applicationsData.applications.filter(
          app => app.status === 'OFFER'
        ).length;

        // Fetch saved jobs
        const savedJobsData = await studentApi.getSavedJobs();
        const savedJobsCount = savedJobsData.savedJobs.length;

        setStats({
          interviews: upcomingInterviews,
          offers: pendingOffers,
          savedJobs: savedJobsCount
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
        // Keep default stats on error
      }
    };

    fetchProfile();
    fetchStats();
  }, []);

  const openModal = (type) => {
    setModals(prev => ({ ...prev, [type]: true }));
  };

  const closeModal = (type) => {
    setModals(prev => ({ ...prev, [type]: false }));
  };

  const handleUpdateAbout = async () => {
    try {
      await studentApi.updateProfile({ aboutMe: formData.about });
      
      // Update userData to reflect the change
      setUserData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          aboutMe: formData.about
        }
      }));
      
      closeModal('about');
    } catch (err) {
      console.error('Error updating about:', err);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-content">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="profile-content">
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  const handleUpdateExperiences = async (nextExperiences) => {
    try {
      setFormData(prev => ({ ...prev, experiences: nextExperiences }));

      await studentApi.updateProfile({
        experiences: nextExperiences,
      });
      
      // Refresh the full profile to get updated experience data
      const data = await studentApi.getProfile();
      setUserData(data);
      setFormData(prev => ({
        ...prev,
        experiences: data.experience || [],
      }));
      
      closeModal('experiences');
    } catch (err) {
      console.error('Error updating experiences:', err);
    }
  };

  const handleUpdateDemographics = async (nextDemo) => {
    try {
      setFormData(prev => ({ ...prev, demographics: nextDemo }));

      await studentApi.updateProfile({
        gender: nextDemo.genders[0] || null,
        ethnicity: nextDemo.ethnicities || [],
        optional: [
          ...(nextDemo.isIndigenous ? ['INDIGENOUS'] : []),
          ...(nextDemo.hasDisability ? ['DISABILITY'] : []),
          ...(nextDemo.isVeteran ? ['VETERAN'] : []),
        ],
      });
      
      // Update userData to reflect changes
      setUserData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          gender: nextDemo.genders[0] || null,
          ethnicity: nextDemo.ethnicities || [],
          optional: [
            ...(nextDemo.isIndigenous ? ['INDIGENOUS'] : []),
            ...(nextDemo.hasDisability ? ['DISABILITY'] : []),
            ...(nextDemo.isVeteran ? ['VETERAN'] : []),
          ],
        }
      }));
      
      closeModal('demographics');
    } catch (err) {
      console.error('Error updating demographics:', err);
    }
  };

  const handleUpdateEducation = async (nextEducation) => {
    try {
      setFormData(prev => ({ ...prev, background: nextEducation }));

      await studentApi.updateProfile({
        education: nextEducation,
      });
      
      // Refresh the full profile to get updated education data
      const data = await studentApi.getProfile();
      setUserData(data);
      setFormData(prev => ({
        ...prev,
        background: data.education || [],
      }));
      
      closeModal('background');
    } catch (err) {
      console.error('Error updating education:', err);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <HeaderBar profile={userData?.profile} user={userData?.user || { email: 'Loading...' }} />

        <div className="profile-grid">
          <div className="main-content">
            <Section title="About" onEdit={() => openModal('about')}>
              <p>{formData.about}</p>
            </Section>

            <Section title="Demographics" onEdit={() => openModal('demographics')}>
              {(() => {
                const d = formData.demographics || {};
                const tags = [
                  ...(d.genders || []).map(formatGender),
                  ...(d.ethnicities || []).map(formatEthnicity),
                  d.isIndigenous ? formatIdentityFlag('INDIGENOUS') : null,
                  d.hasDisability ? formatIdentityFlag('DISABILITY') : null,
                  d.isVeteran ? formatIdentityFlag('VETERAN') : null,
                ].filter(Boolean);

                if (!tags.length) {
                  return <p className="empty-state">No demographics added yet.</p>;
                }

                return (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {tags.map((t, i) => (
                      <span key={i} className="jobs-filter-option selected" style={{ cursor: "default" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                );
              })()}
            </Section>

            <Section title="Education" onEdit={() => openModal('background')}>
              <div className="background-tags">
                {formData.background.map((edu, i) => (
                  <div key={i} style={{ marginBottom: '16px' }}>
                    <strong>{edu.program}</strong> at {edu.schoolName}
                    {edu.yearOfStudy && <span> • Year {edu.yearOfStudy}</span>}
                    {edu.gradDate && (
                      <span> • Expected Graduation: {new Date(edu.gradDate).toLocaleDateString()}</span>
                    )}
                  </div>
                ))}
                {formData.background.length === 0 && (
                  <p className="empty-state">No education added yet.</p>
                )}
              </div>
            </Section>

            <Section title="Experience" onEdit={() => openModal('experiences')}>
              {formData.experiences.length === 0 ? (
                <p className="empty-state">No experience added yet.</p>
              ) : (
                <div className="section-content">
                  {formData.experiences.map((exp, i) => (
                    <div key={i} style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
                      <strong>{exp.title}</strong> at {exp.company}
                      <br />
                      <span style={{ color: '#666', fontSize: '14px' }}>
                        {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                      </span>
                      {exp.description && (
                        <p style={{ marginTop: '8px', color: '#333' }}>{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <Section title="Documents">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {userData?.profile?.resumeUrl && (
                  <a href={userData.profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="tag">
                    📄 Resume
                  </a>
                )}
                {userData?.profile?.transcript && (
                  <a href={userData.profile.transcript} target="_blank" rel="noopener noreferrer" className="tag">
                    📄 Transcript
                  </a>
                )}
                {userData?.profile?.coverLetter && (
                  <a href={userData.profile.coverLetter} target="_blank" rel="noopener noreferrer" className="tag">
                    📄 Cover Letter
                  </a>
                )}
                {!userData?.profile?.resumeUrl && !userData?.profile?.transcript && !userData?.profile?.coverLetter && (
                  <p className="empty-state">No documents uploaded yet.</p>
                )}
              </div>
            </Section>
          </div>

          <aside className="sidebar">
            <Card title="Profile Completion">
              <Ring value={calculateProfileCompletion(userData?.profile)} />
              <span className="badge">
                {calculateProfileCompletion(userData?.profile) >= 80 ? 'High discoverability' : 'Improve visibility'}
              </span>
            </Card>

            <Card title="Quick wins">
              <ul className="quick-wins-list">
                {getQuickWins(userData?.profile, formData).map((win, index) => (
                  <li key={index}>{win}</li>
                ))}
                {getQuickWins(userData?.profile, formData).length === 0 && (
                  <li>Your profile is looking great! 🎉</li>
                )}
              </ul>
            </Card>

            <Card title="Key stats">
              <Stats 
                interviews={stats.interviews}
                offers={stats.offers}
                savedJobs={stats.savedJobs}
              />
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
            onClick={handleUpdateAbout}
            className="modal-save-btn"
          >
            Save
          </button>
        </Modal>

        <DemographicsModal
          isOpen={modals.demographics}
          onClose={() => closeModal('demographics')}
          values={formData.demographics}
          onChange={handleUpdateDemographics}
        />

        <ExperiencesModal
          isOpen={modals.experiences}
          onClose={() => closeModal('experiences')}
          values={formData.experiences}
          onChange={handleUpdateExperiences}
        />

        <EducationModal
          isOpen={modals.background}
          onClose={() => closeModal('background')}
          values={formData.background}
          onChange={handleUpdateEducation}
        />
      </div>
    </div>
  );
};

// Helper function to calculate profile completion percentage
function calculateProfileCompletion(profile) {
  if (!profile) return 0;
  
  const fields = [
    profile.aboutMe,
    profile.phoneNumber,
    profile.resumeUrl,
    profile.linkedInUrl,
    profile.major,
    profile.year,
    profile.gender,
  ];
  
  const completed = fields.filter(Boolean).length;
  return Math.round((completed / fields.length) * 100);
}

// Helper function to get quick wins
function getQuickWins(profile, formData) {
  const wins = [];
  
  if (!profile?.aboutMe) {
    wins.push('Add a 2–3 line About summary');
  }
  if (!profile?.resumeUrl) {
    wins.push('Upload résumé (PDF)');
  }
  if (formData.experiences.length === 0) {
    wins.push('Add work experience');
  }
  if (formData.background.length === 0) {
    wins.push('Add education details');
  }
  if (!profile?.linkedInUrl && !profile?.githubUrl) {
    wins.push('Add LinkedIn or GitHub profile');
  }
  if (!profile?.phoneNumber) {
    wins.push('Add phone number for contact');
  }
  
  return wins;
}

export default Profile;