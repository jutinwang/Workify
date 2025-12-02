import React, { useState } from "react";
import "./OfferModal.css";

const WithdrawModal = ({ application, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirmWithdraw = async () => {
    setLoading(true);
    try {
      await onConfirm(application.id);
      onClose();
    } catch {
      // Error handling is done in the parent component
      setLoading(false);
    }
  };

  return (
    <div className="offer-modal-overlay" onClick={onClose}>
      <div
        className="offer-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="offer-modal-content">
          <div className="offer-modal-header">
            <h2>Withdraw Application?</h2>
            <button
              className="offer-modal-close"
              onClick={onClose}
              disabled={loading}
            >
              ×
            </button>
          </div>
          <div className="offer-modal-body">
            <p className="offer-confirm-text">
              Are you sure you want to withdraw your application for{" "}
              <strong>{application.role}</strong> at{" "}
              <strong>{application.company}</strong>?
            </p>
            <p className="offer-confirm-subtext" style={{ color: "#dc2626" }}>
              You can re-apply to this position later if you change your mind.
            </p>
          </div>
          <div className="offer-modal-actions">
            <button
              className="offer-action-btn secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="offer-action-btn reject"
              onClick={handleConfirmWithdraw}
              disabled={loading}
            >
              {loading ? "Withdrawing..." : "Confirm Withdraw"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;
