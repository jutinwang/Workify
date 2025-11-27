import React, { useState, useRef, useEffect } from "react";
import Modal from "@mui/material/Modal";
import ScheduleInterviewModal from "../coop-candidate/components/ScheduleInterviewModal";
import "./ProfileModal.css";

const ProfileModal = ({
  isOpen,
  onClose,
  selectedCandidate,
  activeTab,
  onOpenScheduleModal,
}) => {
  const [showOfferConfirm, setShowOfferConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [offerFile, setOfferFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [offeredCandidates, setOfferedCandidates] = useState(new Set());
  const [rejectedCandidates, setRejectedCandidates] = useState(new Set());
  const fileInputRef = useRef(null);

  // Load offered/rejected candidates from localStorage on mount
  useEffect(() => {
    const offered = JSON.parse(
      localStorage.getItem("offeredCandidates") || "[]"
    );
    const rejected = JSON.parse(
      localStorage.getItem("rejectedCandidates") || "[]"
    );
    setOfferedCandidates(new Set(offered));
    setRejectedCandidates(new Set(rejected));
  }, []);

  const getCandidateId = (candidate) => {
    return candidate?.studentId || candidate?.id || candidate?.candidate;
  };

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

      // TODO: Backend integration - update application status to OFFER
      // If file is attached, upload it first
      // Example endpoint: POST /applications/:id/offer
      // const token = localStorage.getItem("authToken");
      // For now, we'll simulate the action

      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

      console.log("Offering candidate:", selectedCandidate);
      console.log("Offer letter attached:", offerFile?.name || "None");

      // Mark candidate as offered
      const candidateId = getCandidateId(selectedCandidate);
      const newOffered = new Set(offeredCandidates);
      newOffered.add(candidateId);
      setOfferedCandidates(newOffered);
      localStorage.setItem(
        "offeredCandidates",
        JSON.stringify([...newOffered])
      );

      alert(
        `Offer sent to ${selectedCandidate.candidate}${
          offerFile ? " with attached offer letter" : ""
        }`
      );
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
      // const token = localStorage.getItem("authToken");
      // For now, we'll simulate the action

      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

      console.log("Rejecting candidate:", selectedCandidate);

      // Mark candidate as rejected
      const candidateId = getCandidateId(selectedCandidate);
      const newRejected = new Set(rejectedCandidates);
      newRejected.add(candidateId);
      setRejectedCandidates(newRejected);
      localStorage.setItem(
        "rejectedCandidates",
        JSON.stringify([...newRejected])
      );

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
              {selectedCandidate.candidate}?
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
            </div>
          </div>
        </div>
      );
    } else {
      // Completed tab actions
      const candidateId = getCandidateId(selectedCandidate);
      const isOffered = offeredCandidates.has(candidateId);
      const isRejected = rejectedCandidates.has(candidateId);

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
                    ✓ Offer has been sent to this candidate
                  </p>
                )}
                {isRejected && (
                  <p className="status-rejected">
                    ✗ This candidate has been rejected
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
