import React, { useState } from "react";
import "./OfferModal.css";

const OfferModal = ({ application, onClose, onAccept, onReject }) => {
  const [showAcceptConfirm, setShowAcceptConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAcceptClick = () => {
    setShowAcceptConfirm(true);
  };

  const handleRejectClick = () => {
    setShowRejectConfirm(true);
  };

  const handleConfirmAccept = async () => {
    setLoading(true);
    await onAccept(application.id);
    setLoading(false);
    onClose();
  };

  const handleConfirmReject = async () => {
    setLoading(true);
    await onReject(application.id);
    setLoading(false);
    onClose();
  };

  const renderConfirmation = () => {
    if (showAcceptConfirm) {
      return (
        <div className="offer-modal-content">
          <div className="offer-modal-header">
            <h2>Accept Offer?</h2>
            <button
              className="offer-modal-close"
              onClick={() => setShowAcceptConfirm(false)}
            >
              ×
            </button>
          </div>
          <div className="offer-modal-body">
            <p className="offer-confirm-text">
              Are you sure you want to accept the offer for{" "}
              <strong>{application.job?.title}</strong> at{" "}
              <strong>{application.job?.company?.name}</strong>?
            </p>
            <p className="offer-confirm-subtext">
              This action will notify the employer of your acceptance.
            </p>
          </div>
          <div className="offer-modal-actions">
            <button
              className="offer-action-btn secondary"
              onClick={() => setShowAcceptConfirm(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="offer-action-btn accept"
              onClick={handleConfirmAccept}
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm Accept"}
            </button>
          </div>
        </div>
      );
    }

    if (showRejectConfirm) {
      return (
        <div className="offer-modal-content">
          <div className="offer-modal-header">
            <h2>Decline Offer?</h2>
            <button
              className="offer-modal-close"
              onClick={() => setShowRejectConfirm(false)}
            >
              ×
            </button>
          </div>
          <div className="offer-modal-body">
            <p className="offer-confirm-text">
              Are you sure you want to decline the offer for{" "}
              <strong>{application.job?.title}</strong> at{" "}
              <strong>{application.job?.company?.name}</strong>?
            </p>
            <p className="offer-confirm-subtext">
              This action cannot be undone.
            </p>
          </div>
          <div className="offer-modal-actions">
            <button
              className="offer-action-btn secondary"
              onClick={() => setShowRejectConfirm(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="offer-action-btn reject"
              onClick={handleConfirmReject}
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm Decline"}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="offer-modal-content">
        <div className="offer-modal-header">
          <h2>Offer Letter</h2>
          <button className="offer-modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="offer-modal-body">
          <div className="offer-details">
            <h3>{application.job?.title}</h3>
            <p className="offer-company">{application.job?.company?.name}</p>

            <div className="offer-info-grid">
              {application.job?.type && (
                <div className="offer-info-item">
                  <span className="offer-info-label">Type:</span>
                  <span className="offer-info-value">
                    {application.job.type}
                  </span>
                </div>
              )}
              {application.job?.location && (
                <div className="offer-info-item">
                  <span className="offer-info-label">Location:</span>
                  <span className="offer-info-value">
                    {application.job.location}
                  </span>
                </div>
              )}
              {application.job?.salary && (
                <div className="offer-info-item">
                  <span className="offer-info-label">Salary:</span>
                  <span className="offer-info-value">
                    {application.job.salary}
                  </span>
                </div>
              )}
              {application.job?.length && (
                <div className="offer-info-item">
                  <span className="offer-info-label">Length:</span>
                  <span className="offer-info-value">
                    {application.job.length}
                  </span>
                </div>
              )}
            </div>

            {application.offerLetterUrl && (
              <div className="offer-letter-section">
                <h4>Offer Letter</h4>
                <a
                  href={application.offerLetterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-offer-letter-btn"
                >
                  View Offer Letter (PDF)
                </a>
              </div>
            )}

            <div className="offer-description">
              <h4>Co-Op Description</h4>
              <p>
                {application.job?.description || "No description available."}
              </p>
            </div>
          </div>
        </div>
        <div className="offer-modal-actions">
          <button
            className="offer-action-btn reject"
            onClick={handleRejectClick}
          >
            Decline Offer
          </button>
          <button
            className="offer-action-btn accept"
            onClick={handleAcceptClick}
          >
            Accept Offer
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="offer-modal-overlay" onClick={onClose}>
      <div
        className="offer-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {renderConfirmation()}
      </div>
    </div>
  );
};

export default OfferModal;
