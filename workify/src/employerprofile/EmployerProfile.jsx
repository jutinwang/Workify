import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./EmployerProfile.css";
import { Box, Tab, Tabs } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import ProfileModal from "./ProfileModal";
import ScheduleInterviewModal from "../coop-candidate/components/ScheduleInterviewModal";
import { employerApi } from "../api/employers";
import { formatDateTime } from "../common/utility";

function HeaderBar({ profileData }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    about: "About section content goes here...",
    background: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedAbout, setEditedAbout] = useState(formData.about);

  useEffect(() => {
    if (profileData?.company?.about) {
      setFormData((prev) => ({ ...prev, about: profileData.company.about }));
      setEditedAbout(profileData.company.about);
    }
  }, [profileData]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedAbout(formData.about);
  };

  const handleSave = () => {
    setFormData({ ...formData, about: editedAbout });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedAbout(formData.about);
    setIsEditing(false);
  };

  return (
    <div className="ep-header-bar">
      <div className="ep-header-content">
        <div className="ep-header-info">
          <h1 className="ep-header-name">
            {profileData?.user?.name || "Loading..."}
          </h1>
          <p className="ep-header-location">{profileData?.user?.email || ""}</p>
          <p className="ep-header-company">
            {profileData?.company?.name || "Company Unknown"}
          </p>
          <p className="ep-header-role">Recruiter</p>
        </div>
        <div className="ep-header-actions">
          <button className="ep-btn-primary" onClick={handleEdit}>
            Edit Profile
          </button>
          <button 
            className="ep-btn-icon" 
            onClick={() => navigate('/settings-employer')}
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
      <div className="ep-about-section">
        <h2 className="ep-about-title">About</h2>
        {isEditing ? (
          <div className="ep-edit-container">
            <textarea
              className="ep-about-textarea"
              value={editedAbout}
              onChange={(e) => setEditedAbout(e.target.value)}
              rows={4}
            />
            <div className="ep-edit-actions">
              <button className="ep-btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
              <button className="ep-btn-primary" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="ep-about-text">
            <p>{formData.about}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Table for Completed
function BasicTable({ handleActionClick, interviews = [], loading }) {
  const getRowClassName = (status) => {
    if (status === "ACCEPTED") return "ep-status-accepted";
    if (status === "REJECTED") return "ep-status-rejected";
    if (status === "OFFER") return "ep-status-offer";
    return "";
  };

  if (loading) {
    return (
      <TableContainer component={Paper}>
        <div style={{ padding: "20px", textAlign: "center" }}>
          Loading completed interviews...
        </div>
      </TableContainer>
    );
  }

  if (interviews.length === 0) {
    return (
      <TableContainer component={Paper}>
        <div style={{ padding: "20px", textAlign: "center" }}>
          No completed interviews
        </div>
      </TableContainer>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table
        className="ep-main-table"
        sx={{ minWidth: 650 }}
        aria-label="simple table"
      >
        <TableHead className="ep-table-header">
          <TableRow className="ep-table-head-row">
            <TableCell className="ep-table-header-label">Candidate</TableCell>
            <TableCell className="ep-table-header-label">
              Interview Info.
            </TableCell>
            <TableCell className="ep-table-header-label">
              Interview Date
            </TableCell>
            <TableCell className="ep-table-header-label">
              Application Status
            </TableCell>
            <TableCell align="center" className="ep-table-header-label">
              Next Steps
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {interviews.map((interview) => (
            <TableRow
              key={interview.id}
              className={getRowClassName(interview?.application?.status)}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {interview.student?.user?.name || "Unknown"}
              </TableCell>
              <TableCell>{interview.job?.title || "N/A"}</TableCell>
              <TableCell>{formatDateTime(interview.chosenStart)}</TableCell>
              <TableCell>{interview?.application?.status || "N/A"}</TableCell>
              <TableCell>
                <button
                  className="action-btn schedule"
                  onClick={() =>
                    handleActionClick({
                      candidate: interview.student?.user?.name,
                      interviewInfo: interview.job?.title,
                      date: formatDateTime(interview.chosenStart),
                      outcome: interview.application?.status,
                      interviewId: interview.id,
                      studentId: interview.student?.id,
                      jobId: interview.job?.id,
                      applicationId: interview.application?.id,
                    })
                  }
                >
                  Open Next Steps
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// Table for Upcoming
function UpcomingTable({ handleActionClick, interviews = [], loading }) {
  // Filter for non-completed interviews (PENDING or SCHEDULED)
  const upcomingInterviews = (interviews || []).filter(
    (interview) => interview.status !== "COMPLETED"
  );

  if (loading) {
    return (
      <TableContainer component={Paper}>
        <div style={{ padding: "20px", textAlign: "center" }}>
          Loading interviews...
        </div>
      </TableContainer>
    );
  }

  if (upcomingInterviews.length === 0) {
    return (
      <TableContainer component={Paper}>
        <div style={{ padding: "20px", textAlign: "center" }}>
          No upcoming interviews
        </div>
      </TableContainer>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table
        className="ep-main-table"
        sx={{ minWidth: 650 }}
        aria-label="simple table"
      >
        <TableHead className="ep-table-header">
          <TableRow className="ep-table-head-row">
            <TableCell className="ep-table-header-label">Candidate</TableCell>
            <TableCell className="ep-table-header-label">
              Co-Op Posting
            </TableCell>
            <TableCell className="ep-table-header-label">
              Interview Date & Time
            </TableCell>
            <TableCell className="ep-table-header-label">Status</TableCell>
            <TableCell align="center" className="ep-table-header-label">
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {upcomingInterviews.map((interview) => (
            <TableRow
              key={interview.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {interview.student?.user?.name || "Unknown"}
              </TableCell>
              <TableCell component="th" scope="row">
                {interview.job?.title || "N/A"}
              </TableCell>
              <TableCell component="th" scope="row">
                {formatDateTime(interview.chosenStart)}
              </TableCell>
              <TableCell>{interview.status}</TableCell>
              <TableCell>
                <button
                  className="action-btn schedule"
                  onClick={() =>
                    handleActionClick({
                      candidate: interview.student?.user?.name,
                      posting: interview.job?.title,
                      date: formatDateTime(interview.chosenStart),
                      status: interview.status,
                      interviewId: interview.id,
                      studentId: interview.student?.id,
                      jobId: interview.job?.id,
                    })
                  }
                >
                  Action
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// Main Employer Profile Component
const EmployerProfile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleCandidate, setScheduleCandidate] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [interviewsLoading, setInterviewsLoading] = useState(true);
  const [completedInterviews, setCompletedInterviews] = useState([]);
  const [completedLoading, setCompletedLoading] = useState(true);
  const [colleagues, setColleagues] = useState([]);
  const [colleaguesLoading, setColleaguesLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching profile and interviews...");
        const [profileResponse, interviewsResponse, completedResponse, colleaguesResponse] =
          await Promise.all([
            employerApi.getProfile(),
            employerApi.getAllInterviews(),
            employerApi.getCompletedInterviews(),
            employerApi.getColleagues(),
          ]);
        console.log("Profile response:", profileResponse);
        console.log("Interviews response:", interviewsResponse);
        console.log("Completed interviews response:", completedResponse);
        console.log("Colleagues response:", colleaguesResponse);
        setProfileData(profileResponse.profile);
        setInterviews(interviewsResponse.interviews || []);
        setCompletedInterviews(completedResponse.interviews || []);
        setColleagues(colleaguesResponse.colleagues || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
        setInterviewsLoading(false);
        setCompletedLoading(false);
        setColleaguesLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleActionClick = (candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const handleCompleteInterview = async (interviewId) => {
    try {
      await employerApi.completeInterview(interviewId);
      // Refresh data after completing interview
      const [profileResponse, interviewsResponse, completedResponse] =
        await Promise.all([
          employerApi.getProfile(),
          employerApi.getAllInterviews(),
          employerApi.getCompletedInterviews(),
        ]);
      setProfileData(profileResponse.profile);
      setInterviews(interviewsResponse.interviews || []);
      setCompletedInterviews(completedResponse.interviews || []);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error completing interview:", error);
      alert("Failed to complete interview. Please try again.");
    }
  };

  const handleSendOffer = async () => {
    try {
      // Refresh data after sending offer
      const completedResponse = await employerApi.getCompletedInterviews();
      setCompletedInterviews(completedResponse.interviews || []);
    } catch (error) {
      console.error("Error refreshing data after offer:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCandidate(null);
  };

  const handleOpenScheduleModal = (candidate) => {
    setScheduleCandidate(candidate);
    setShowScheduleModal(true);
    setIsModalOpen(false);
  };

  const handleCloseScheduleModal = (wasScheduled) => {
    setShowScheduleModal(false);
    setScheduleCandidate(null);
    if (wasScheduled) {
      // Optionally refresh data or show success message
    }
  };

  if (loading) {
    return <div className="profile-container">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-content">
        <HeaderBar profileData={profileData} />
        <div className="profile-grid">
          <div className="main-content">
            <div className="ep-interviews-section">
              <h2 className="ep-section-title">Interview Overview</h2>
              <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                  <Tab label="Upcoming" />
                  <Tab label="Completed" />
                </Tabs>
              </Box>
              {activeTab === 1 ? (
                <BasicTable
                  handleActionClick={handleActionClick}
                  interviews={completedInterviews}
                  loading={completedLoading}
                />
              ) : (
                <UpcomingTable
                  handleActionClick={handleActionClick}
                  interviews={interviews}
                  loading={interviewsLoading}
                />
              )}
            </div>
            <div className="ep-colleagues-section">
              <h2 className="ep-section-title">
                Colleagues at {profileData?.company?.name || "Company"}
              </h2>
              {colleaguesLoading ? (
                <div style={{ padding: "20px", textAlign: "center" }}>
                  Loading colleagues...
                </div>
              ) : colleagues.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
                  No colleagues found at this company yet.
                </div>
              ) : (
                <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
                  {colleagues.map((colleague) => (
                    <div
                      key={colleague.id}
                      style={{
                        padding: "1rem",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        backgroundColor: "white",
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem"
                      }}
                    >
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          backgroundColor: "#e5e7eb",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "20px",
                          fontWeight: "600",
                          color: "#6b7280"
                        }}
                      >
                        {colleague.user?.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
                          {colleague.user?.name || "Unknown"}
                        </div>
                        <div style={{ fontSize: "14px", color: "#6b7280" }}>
                          {colleague.user?.email || ""}
                        </div>
                        {colleague.workPhone && (
                          <div style={{ fontSize: "14px", color: "#6b7280" }}>
                            {colleague.workPhone}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ProfileModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedCandidate={selectedCandidate}
        activeTab={activeTab}
        onOpenScheduleModal={handleOpenScheduleModal}
        onCompleteInterview={handleCompleteInterview}
        onSendOffer={handleSendOffer}
      />
      {showScheduleModal && scheduleCandidate && (
        <ScheduleInterviewModal
          candidate={{
            name: scheduleCandidate.candidate,
            studentId: scheduleCandidate.studentId,
          }}
          jobId={scheduleCandidate.jobId}
          onClose={handleCloseScheduleModal}
        />
      )}
    </div>
  );
};

export default EmployerProfile;
