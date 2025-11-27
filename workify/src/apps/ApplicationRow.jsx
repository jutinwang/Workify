import { useNavigate } from "react-router-dom";
import { fmtDate } from "./progress";

const ApplicationRow = ({ app, onViewOffer }) => {
  const navigate = useNavigate();
  const handleViewJob = () => {
    if (app.jobId) {
      navigate(`/students/${app.jobId}`);
    }
  };

  return (
    <tr>
      <td className="cell-strong">{app.company}</td>
      <td>{app.role}</td>
      <td>{app.length}</td>
      <td>{app.location}</td>
      <td>{fmtDate(app.appliedAt)}</td>
      <td>{app.status}</td>
      <td>{fmtDate(app.lastUpdated)}</td>
      <td style={{ textAlign: "center" }}>
        {app.status === "OFFER" ? (
          <button
            className="btn apps-btn-small apps-btn-success"
            onClick={() => onViewOffer(app)}
          >
            View Offer
          </button>
        ) : (
          <button className="btn apps-btn-small" onClick={handleViewJob}>
            View Co-Op
          </button>
        )}
      </td>
    </tr>
  );
};

export default ApplicationRow;
