import React, { useState, useRef, useEffect } from "react";
import Modal from "@mui/material/Modal";
import ScheduleInterviewModal from "../coop-candidate/components/ScheduleInterviewModal";
import { employerApi } from "../api/employers";
import "./ProfileModal.css";

const ProfileModal = ({
  isOpen,
  onClose,
  selectedCandidate,
  activeTab,
  onOpenScheduleModal,
  onCompleteInterview,
  onSendOffer,
}) => {
  const [showOfferConfirm, setShowOfferConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [offerFile, setOfferFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleOfferClick = () => {
    setShowOfferConfirm(true);
    setError("");
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type (optional)
      if (file.type !== "application/pdf" && !file.type.startsWith("image/")) {
        setError("Please upload a PDF or image file");
        return;
      }
      setOfferFile(file);
      setError("");
    }
  };

  const handleConfirmOffer = async () => {
    try {
      setLoading(true);
      setError("");

      const applicationId = selectedCandidate?.applicationId;

      if (!applicationId) {
        setError("Application ID not found. Unable to send offer.");
        console.error(
          "Missing applicationId in selectedCandidate:",
          selectedCandidate
        );
        setLoading(false);
        return;
      }

      // TODO: If file is attached, upload it first before sending offer
      // For now, we'll just send the offer without the file upload

      await employerApi.sendOffer(applicationId);

      console.log("Offer sent to:", selectedCandidate);
      console.log("Application ID:", applicationId);
      console.log("Offer letter attached:", offerFile?.name || "None");

      alert(
        `Offer successfully sent to ${selectedCandidate.candidate} for ${selectedCandidate.interviewInfo}!`
      );

      // Refresh data to show updated offer status
      if (onSendOffer) {
        await onSendOffer();
      }

      onClose();
    } catch (e) {
      console.error("Error sending offer:", e);
      setError("Failed to send offer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectClick = () => {
    setShowRejectConfirm(true);
    setError("");
  };

  const handleConfirmReject = async () => {
    try {
      setLoading(true);
      setError("");

      // TODO: Backend integration - update application status to REJECTED
      // Example endpoint: PATCH /applications/:id with { status: "REJECTED" }
      // await employerApi.rejectApplication(selectedCandidate?.applicationId);

      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

      console.log("Rejecting candidate:", selectedCandidate);

      alert(`${selectedCandidate.candidate} has been rejected`);
      onClose();
    } catch (e) {
      console.error("Error rejecting candidate:", e);
      setError("Failed to reject candidate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookAnotherInterview = () => {
    if (onOpenScheduleModal && selectedCandidate) {
      onOpenScheduleModal(selectedCandidate);
    }
  };

  // Reset modal state when candidate changes or modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowOfferConfirm(false);
      setShowRejectConfirm(false);
      setOfferFile(null);
      setLoading(false);
      setError("");
    }
  }, [isOpen, selectedCandidate]);

  const renderModalContent = () => {
    if (!selectedCandidate) return null;

    // Show offer confirmation screen
    if (showOfferConfirm) {
      return (
        <div className="profile-modal-content">
          <div className="profile-modal-header">
            <h2>Offer {selectedCandidate.candidate}</h2>
            <button
              className="profile-modal-close"
              onClick={() => setShowOfferConfirm(false)}
            >
              ×
            </button>
          </div>
          <div className="profile-modal-body">
            <p className="confirm-text">
              Are you sure you want to send an offer to{" "}
              {selectedCandidate.candidate} for{" "}
              {selectedCandidate.interviewInfo}?
            </p>

            <div className="file-upload-section">
              <label htmlFor="offer-file" className="file-upload-label">
                Attach Offer Letter (Optional)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                id="offer-file"
                accept=".pdf,image/*"
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />
              <button
                className="file-select-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                {offerFile ? offerFile.name : "Choose File"}
              </button>
              {offerFile && (
                <button
                  className="file-remove-btn"
                  onClick={() => setOfferFile(null)}
                >
                  Remove
                </button>
              )}
            </div>

            {error && <p className="error-text">{error}</p>}
          </div>
          <div className="profile-modal-actions">
            <button
              className="action-btn secondary"
              onClick={() => setShowOfferConfirm(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="action-btn offer"
              onClick={handleConfirmOffer}
              disabled={loading}
            >
              {loading ? "Sending..." : "Confirm Offer"}
            </button>
          </div>
        </div>
      );
    }

    // Show reject confirmation screen
    if (showRejectConfirm) {
      return (
        <div className="profile-modal-content">
          <div className="profile-modal-header">
            <h2>Reject {selectedCandidate.candidate}</h2>
            <button
              className="profile-modal-close"
              onClick={() => setShowRejectConfirm(false)}
            >
              ×
            </button>
          </div>
          <div className="profile-modal-body">
            <p className="confirm-text">
              Are you sure you want to reject {selectedCandidate.candidate}?
              This action cannot be undone.
            </p>
            {error && <p className="error-text">{error}</p>}
          </div>
          <div className="profile-modal-actions">
            <button
              className="action-btn secondary"
              onClick={() => setShowRejectConfirm(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="action-btn reject"
              onClick={handleConfirmReject}
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm Reject"}
            </button>
          </div>
        </div>
      );
    }

    if (activeTab === 0) {
      // Upcoming tab actions
      return (
        <div className="profile-modal-content">
          <div className="profile-modal-header">
            <h2>Interview Actions - {selectedCandidate.candidate}</h2>
            <button className="profile-modal-close" onClick={onClose}>
              ×
            </button>
          </div>
          <div className="profile-modal-body">
            <div className="profile-modal-actions">
              <button
                className="action-btn schedule"
                onClick={() => alert("Reschedule feature coming soon")}
              >
                Reschedule Interview
              </button>
              <button
                className="action-btn reject"
                onClick={() => alert("Cancel feature coming soon")}
              >
                Cancel Interview
              </button>
              <button
                className="action-btn offer"
                onClick={() => alert("Join feature coming soon")}
              >
                Join Interview
              </button>
              {/* TODO: Add API implementation here. */}
              <button
                className="action-btn"
                onClick={async () => {
                  if (selectedCandidate?.interviewId) {
                    await onCompleteInterview(selectedCandidate.interviewId);
                  } else {
                    alert("Interview ID not found");
                  }
                }}
              >
                Mark Interview as Completed
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      // Completed tab - use application status from API data
      const applicationStatus = selectedCandidate?.outcome; // This is application.status
      const isOffered =
        applicationStatus === "OFFER" || applicationStatus === "ACCEPTED";
      const isRejected = applicationStatus === "REJECTED";

      return (
        <div className="profile-modal-content">
          <div className="profile-modal-header">
            <h2>Post-Interview Actions - {selectedCandidate.candidate}</h2>
            <button className="profile-modal-close" onClick={onClose}>
              ×
            </button>
          </div>
          <div className="profile-modal-body">
            {(isOffered || isRejected) && (
              <div className="status-message">
                {isOffered && (
                  <p className="status-offered">
                    ✓ Offer has been sent to this candidate for this position
                  </p>
                )}
                {isRejected && (
                  <p className="status-rejected">
                    ✗ This candidate has been rejected for this position
                  </p>
                )}
              </div>
            )}
            <div className="profile-modal-actions">
              <button
                className="action-btn offer"
                onClick={handleOfferClick}
                disabled={isOffered || isRejected}
              >
                {isOffered ? "Offer Sent" : "Offer Candidate"}
              </button>
              <button
                className="action-btn reject"
                onClick={handleRejectClick}
                disabled={isOffered || isRejected}
              >
                {isRejected ? "Already Rejected" : "Reject Candidate"}
              </button>
              <button
                className="action-btn schedule"
                onClick={handleBookAnotherInterview}
                disabled={isRejected}
              >
                Book Another Interview
              </button>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <Modal open={isOpen} onClose={onClose}>
        <div className="profile-modal-container">{renderModalContent()}</div>
      </Modal>
    </>
  );
};

export default ProfileModal;
