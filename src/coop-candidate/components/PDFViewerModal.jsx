import React from "react";
import "../styles/PDFViewerModal.css";

const PDFViewerModal = ({ pdfUrl, candidateName, onClose }) => {
  return (
    <div className="pdf-modal-overlay" onClick={onClose}>
      <div className="pdf-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="pdf-modal-header">
          <h3>{candidateName}'s Resume</h3>
          <button className="pdf-modal-close" onClick={onClose}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="pdf-viewer-container">
          <object
            data={pdfUrl}
            type="application/pdf"
            width="100%"
            height="100%"
          >
            <embed
              src={pdfUrl}
              type="application/pdf"
              width="100%"
              height="100%"
            />
          </object>
        </div>
      </div>
    </div>
  );
};

export default PDFViewerModal;
