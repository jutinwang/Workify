import React, { useState, useEffect } from "react";
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

function HeaderBar({ profileData }) {
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
function BasicTable({ handleActionClick }) {
  function createData(
    candidate,
    interviewInfo,
    interviewer,
    feedback,
    outcome,
    action
  ) {
    return { candidate, interviewInfo, interviewer, feedback, outcome, action };
  }

  const rows = [
    createData(
      "Ali Bhangu",
      "SWE Interview",
      "John Doe",
      "GOOD",
      "Hired",
      "View"
    ),
    createData(
      "Justin Wang",
      "Frontend Interview",
      "Jane Smith",
      "EXCELLENT",
      "Hired",
      "View"
    ),
    createData(
      "Bilal Khan",
      "Backend Interview",
      "Alex Brown",
      "FAIR",
      "Rejected",
      "View"
    ),
    createData(
      "Sara Li",
      "Design Interview",
      "Chris Lee",
      "STRONG",
      "Pending",
      "View"
    ),
    createData(
      "Toluwanimi Emoruwa",
      "Data Interview",
      "Emily White",
      "GOOD",
      "Hired",
      "View"
    ),
  ];

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
            <TableCell className="ep-table-header-label">Interviewer</TableCell>
            <TableCell className="ep-table-header-label">Status</TableCell>
            <TableCell align="center" className="ep-table-header-label">
              Next Steps
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.candidate}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.candidate}
              </TableCell>
              <TableCell>{row.interviewInfo}</TableCell>
              <TableCell>{row.interviewer}</TableCell>
              <TableCell>{row.outcome}</TableCell>
              <TableCell>
                <button
                  className="action-btn schedule"
                  onClick={() => handleActionClick(row)}
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
function UpcomingTable({ handleActionClick }) {
  function createData(candidate, posting, date, interviewer, action, link) {
    return { candidate, posting, date, interviewer, action, link };
  }

  const rows = [
    createData(
      "Ali Bhangu",
      "SWE Interview",
      "10:00AM on Sept 20, 2024",
      "John Doe",
      "Action",
      "Link"
    ),
  ];

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
            </TableCell>{" "}
            <TableCell className="ep-table-header-label">Interviewer</TableCell>
            <TableCell className="ep-table-header-label">Link</TableCell>
            <TableCell align="center" className="ep-table-header-label">
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.candidate}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.candidate}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.posting}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.date}
              </TableCell>
              <TableCell>{row.interviewer}</TableCell>
              <TableCell>{row.link}</TableCell>

              <TableCell>
                <button
                  className="action-btn schedule"
                  onClick={() => handleActionClick(row)}
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await employerApi.getProfile();
        setProfileData(response.profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleActionClick = (candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
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
                <BasicTable handleActionClick={handleActionClick} />
              ) : (
                <UpcomingTable handleActionClick={handleActionClick} />
              )}
            </div>
            <div className="ep-colleagues-section">
              <h2 className="ep-section-title">
                Colleagues at {profileData?.company?.name || "Company"}
              </h2>
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
