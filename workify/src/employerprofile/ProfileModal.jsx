import React from "react";
import Modal from "@mui/material/Modal";
import "./ProfileModal.css";

const ProfileModal = ({ isOpen, onClose, selectedCandidate, activeTab }) => {
  const renderModalContent = () => {
    if (!selectedCandidate) return null;

    if (activeTab === 0) {
      // Upcoming tab actions
      return (
        <div className="modal-content">
          <h2>Actions for {selectedCandidate.candidate}</h2>
          <div className="modal-actions">
            <button
              variant="contained"
              color="primary"
              onClick={() => alert("Reschedule")}
            >
              Reschedule Interview
            </button>
            <button
              variant="contained"
              color="error"
              onClick={() => alert("Cancel")}
            >
              Cancel Interview
            </button>
            <button
              variant="contained"
              color="success"
              onClick={() => alert("Join")}
            >
              Join Interview
            </button>
          </div>
        </div>
      );
    } else {
      // Completed tab actions
      return (
        <div className="modal-content">
          <h2>Actions for {selectedCandidate.candidate}</h2>
          <div className="modal-actions">
            <Button
              variant="contained"
              color="success"
              onClick={() => alert("Offer Candidate")}
            >
              Offer Candidate
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => alert("Reject Candidate")}
            >
              Reject Candidate
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => alert("Book Another Interview")}
            >
              Book Another Interview
            </Button>
          </div>
          <div className="modal-feedback">
            <h3>Provide Feedback</h3>
            <div className="modal-feedback-buttons">
              {["Excellent", "Good", "Fair", "Poor", "Very Poor"].map(
                (feedback) => (
                  <Button
                    key={feedback}
                    variant="outlined"
                    onClick={() => alert(`Feedback: ${feedback}`)}
                  >
                    {feedback}
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="modal-container">{renderModalContent()}</div>
    </Modal>
  );
};

export default ProfileModal;
