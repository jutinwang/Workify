const ApplicationsHeader = ({ total }) => {
  return (
    <header className="apps-header">
      <div>
        <h3 className="apps-title">Your Applications</h3>
        <p className="apps-subtitle">Track progress from draft to offer.</p>
      </div>
      <div className="apps-meta">
        <span className="apps-count">{total}</span>
        <span className="apps-count-label">matching</span>
      </div>
    </header>
  );
};

export default ApplicationsHeader;
