import React, { useState, useMemo, useCallback } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor } from "slate";
import { Link } from "react-router-dom";
import "./OfferModal.css";

const OfferModal = ({
  application,
  onClose,
  onAccept,
  onReject,
  hasAcceptedOffer,
}) => {
  const [showAcceptConfirm, setShowAcceptConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const isCurrentlyAccepted = application.status === "ACCEPTED";
  const cannotAccept = hasAcceptedOffer && !isCurrentlyAccepted;

  const parseSlateContent = (
    content,
    fallbackText = "No content available"
  ) => {
    if (!content) {
      return [{ type: "paragraph", children: [{ text: fallbackText }] }];
    }
    try {
      return JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse content:", e);
      return [{ type: "paragraph", children: [{ text: fallbackText }] }];
    }
  };

  const Element = ({ attributes, children, element }) => {
    switch (element.type) {
      case "code":
        return (
          <pre {...attributes}>
            <code>{children}</code>
          </pre>
        );
      case "bulleted-list":
        return <ul {...attributes}>{children}</ul>;
      case "numbered-list":
        return <ol {...attributes}>{children}</ol>;
      case "list-item":
        return <li {...attributes}>{children}</li>;
      default:
        return <p {...attributes}>{children}</p>;
    }
  };

  const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) children = <strong>{children}</strong>;
    if (leaf.code) children = <code>{children}</code>;
    if (leaf.italic) children = <em>{children}</em>;
    if (leaf.underline) children = <u>{children}</u>;
    if (leaf.strikethrough) children = <s>{children}</s>;

    return <span {...attributes}>{children}</span>;
  };

  const editor = useMemo(() => withReact(createEditor()), []);
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

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
          {isCurrentlyAccepted && (
            <div className="offer-accepted-banner">
              <span className="offer-accepted-icon">✓</span>
              <span className="offer-accepted-text">
                You have accepted this offer
              </span>
            </div>
          )}
          {cannotAccept && (
            <div className="offer-warning-banner">
              <span className="offer-warning-icon">⚠</span>
              <span className="offer-warning-text">
                You have already accepted another offer. You cannot accept
                multiple offers.
              </span>
            </div>
          )}
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
                  <div className="offer-info-value">
                    <Slate
                      key={`salary-${application.id}`}
                      editor={editor}
                      initialValue={parseSlateContent(
                        application.job.salary,
                        "No salary posted"
                      )}
                    >
                      <Editable
                        readOnly
                        renderElement={renderElement}
                        renderLeaf={renderLeaf}
                      />
                    </Slate>
                  </div>
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
              <div className="offer-job-link-section">
                <Link
                  to={`/students/${application.jobId}`}
                  className="view-job-btn"
                >
                  View Full Job Posting
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="offer-modal-actions">
          <button
            className="offer-action-btn reject"
            onClick={handleRejectClick}
            disabled={isCurrentlyAccepted}
          >
            Decline Offer
          </button>
          <button
            className="offer-action-btn accept"
            onClick={handleAcceptClick}
            disabled={isCurrentlyAccepted || cannotAccept}
            title={
              cannotAccept ? "You have already accepted another offer" : ""
            }
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
