import React, { useEffect, useState, useCallback } from "react";
import Card from "../common/Card";
import StudentScheduleInterviewModal from "./StudentScheduleInterviewModal"; 

const InterviewComponent = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [scheduleInterview, setScheduleInterview] = useState(null);

  const loadInterviews = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("authToken");

      const res = await fetch(
        "http://localhost:4000/users/me/interviews",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to load interviews.");
        setInterviews([]);
      } else {
        setInterviews(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error("Error loading interviews:", e);
      setError("Unexpected error while loading interviews.");
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInterviews();
  }, [loadInterviews]);

  const pendingRequests = interviews.filter(
    (req) => req.status === "PENDING"
  );
  const scheduledInterviews = interviews.filter(
    (req) => req.status === "SCHEDULED"
  );

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-CA");
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString("en-CA", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDecline = async (id) => {
    try {
      setUpdatingId(id);
      setError("");
      const token = localStorage.getItem("authToken");

      const res = await fetch(
        "http://localhost:4000/students/me/interviews/" + id + "/respond",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ decision: "decline" }),
        }
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to update interview.");
        return;
      }

      // reload list after decline
      await loadInterviews();
    } catch (e) {
      console.error("Error declining interview:", e);
      setError("Unexpected error while updating interview.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleScheduleClick = (interview) => {
    setScheduleInterview(interview);
  };

  const handleScheduleModalClose = (didSchedule = false) => {
    setScheduleInterview(null);
    if (didSchedule) {
      loadInterviews();
    }
  };

  return (
    <div>
      {error && (
        <div className="apps-error-banner">
          <p>{error}</p>
        </div>
      )}

      <Card
        title={`Interview Requests ${
          pendingRequests.length > 0 ? `(${pendingRequests.length})` : ""
        }`}
      >
        {loading ? (
          <div className="apps-empty-state">
            <p>Loading interview requests…</p>
          </div>
        ) : pendingRequests.length > 0 ? (
          <div className="apps-interview-requests-container">
            {pendingRequests.map((request) => (
              <div key={request.id} className="apps-interview-request-card">
                <div className="apps-interview-request-header">
                  <div className="apps-job-info">
                    <h3 className="apps-job-title">
                      {request.job?.title || "Untitled role"}
                    </h3>
                    <p className="apps-company-name">
                      {request.job?.company?.name ||
                        request.employer?.company?.name ||
                        "Company"}
                    </p>
                    <div className="apps-job-details">
                      {request.job?.type && (
                        <span className="apps-job-type">
                          {request.job.type}
                        </span>
                      )}
                      {request.job?.location && (
                        <>
                          <span className="apps-separator">•</span>
                          <span className="apps-job-location">
                            {request.job.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="apps-request-meta">
                    {request.employer?.user?.name && (
                      <p className="apps-interviewer">
                        From: {request.employer.user.name}
                      </p>
                    )}
                    <p className="apps-request-date">
                      Requested: {formatDate(request.createdAt)}
                    </p>
                    {request.durationMinutes && (
                      <p className="apps-request-date">
                        Duration: {request.durationMinutes} minutes
                      </p>
                    )}
                  </div>
                </div>

                {request.note && (
                  <div className="apps-interview-note">
                    <p>{request.note}</p>
                  </div>
                )}

                <div className="apps-interview-request-actions">
                  <button
                    className="btn apps-btn-success"
                    onClick={() => handleScheduleClick(request)}
                  >
                    Schedule Interview
                  </button>
                  <button
                    className="btn apps-btn-outline"
                    disabled={updatingId === request.id}
                    onClick={() => handleDecline(request.id)}
                  >
                    Decline
                  </button>
                 
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="apps-empty-state">
            <p>No pending interview requests.</p>
          </div>
        )}
      </Card>

      <Card title="Upcoming Interviews">
        {loading ? (
          <div className="apps-empty-state">
            <p>Loading interviews…</p>
          </div>
        ) : scheduledInterviews.length > 0 ? (
          <div className="apps-interviews-table-wrapper">
            <table className="apps-interviews-table">
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Company</th>
                  <th>Date &amp; Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {scheduledInterviews.map((interview) => (
                  <tr key={interview.id}>
                    <td>
                      <div className="apps-position-cell">
                        <span className="cell-strong">
                          {interview.job?.title || "Untitled role"}
                        </span>
                        <div className="apps-position-details">
                          {interview.job?.type && (
                            <span className="apps-job-type">
                              {interview.job.type}
                            </span>
                          )}
                          {interview.job?.location && (
                            <>
                              <span className="apps-separator">•</span>
                              <span>{interview.job.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      {interview.job?.company?.name ||
                        interview.employer?.company?.name ||
                        "Company"}
                    </td>
                    <td>
                      <div className="apps-datetime-cell">
                        {formatDateTime(interview.chosenStart)}
                      </div>
                    </td>
                    <td>
                      <div className="apps-interview-actions">
                        <button className="btn apps-btn-small">
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="apps-empty-state">
            <p>No upcoming interviews scheduled.</p>
          </div>
        )}
      </Card>
      {scheduleInterview && (
        <StudentScheduleInterviewModal
          interview={scheduleInterview}
          onClose={handleScheduleModalClose}
        />
      )}
    </div>
  );
};

export default InterviewComponent;
