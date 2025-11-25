import Card from "../common/Card";

const mockInterviewData = [
  {
    id: 1,
    status: "PENDING",
    jobId: 1,
    createdAt: "2024-12-01T10:00:00Z",
    employer: {
      user: {
        name: "Sarah Connor",
      },
      company: {
        name: "Innovatech Solutions",
        url: "https://innovatech.com",
      },
    },
    job: {
      title: "Frontend Developer",
      location: "Toronto, ON",
      type: "Full-time",
    },
  },
  {
    id: 2,
    status: "SCHEDULED",
    jobId: 2,
    createdAt: "2024-11-28T14:30:00Z",
    calendarData: {
      date: "2024-12-15",
      time: "10:00 AM",
      duration: "60 minutes",
      meetingLink: "https://zoom.us/j/123456789",
    },
    employer: {
      user: {
        name: "John Doe",
      },
      company: {
        name: "TechCorp Inc",
      },
    },
    job: {
      title: "Software Engineer",
      location: "Vancouver, BC",
      type: "Full-time",
    },
  },
  {
    id: 3,
    status: "PENDING",
    jobId: 3,
    createdAt: "2024-11-30T16:45:00Z",
    employer: {
      user: {
        name: "Jane Smith",
      },
      company: {
        name: "Startup Labs",
      },
    },
    job: {
      title: "Backend Engineer",
      location: "Remote",
      type: "Internship",
    },
  },
];

const InterviewComponent = () => {
  const pendingRequests = mockInterviewData.filter(
    (req) => req.status === "PENDING"
  );
  const scheduledInterviews = mockInterviewData.filter(
    (req) => req.status === "SCHEDULED"
  );

  const handleAccept = (id) => {
    console.log("Accepting interview request:", id);
    // TODO: API call to update status to SCHEDULED
    // This would trigger a calendar scheduling flow
  };

  const handleDecline = (id) => {
    console.log("Declining interview request:", id);
    // TODO: API call to update status to CANCELLED
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-CA");
  };

  return (
    <div>
      <Card
        title={`Interview Requests ${
          pendingRequests.length > 0 ? `(${pendingRequests.length})` : ""
        }`}
      >
        {pendingRequests.length > 0 ? (
          <div className="apps-interview-requests-container">
            {pendingRequests.map((request) => (
              <div key={request.id} className="apps-interview-request-card">
                <div className="apps-interview-request-header">
                  <div className="apps-job-info">
                    <h3 className="apps-job-title">{request.job.title}</h3>
                    <p className="apps-company-name">
                      {request.employer.company.name}
                    </p>
                    <div className="apps-job-details">
                      <span className="apps-job-type">{request.job.type}</span>
                      {request.job.location && (
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
                    <p className="apps-interviewer">
                      From: {request.employer.user.name}
                    </p>
                    <p className="apps-request-date">
                      Requested: {formatDate(request.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="apps-interview-request-actions">
                  <button
                    className="btn apps-btn-success"
                    onClick={() => handleAccept(request.id)}
                  >
                    Accept
                  </button>
                  <button
                    className="btn apps-btn-outline"
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
        {scheduledInterviews.length > 0 ? (
          <div className="apps-interviews-table-wrapper">
            <table className="apps-interviews-table">
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Company</th>
                  <th>Interviewer</th>
                  <th>Date & Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {scheduledInterviews.map((interview) => (
                  <tr key={interview.id}>
                    <td>
                      <div className="apps-position-cell">
                        <span className="cell-strong">
                          {interview.job.title}
                        </span>
                        <div className="apps-position-details">
                          <span className="apps-job-type">
                            {interview.job.type}
                          </span>
                          {interview.job.location && (
                            <>
                              <span className="apps-separator">•</span>
                              <span>{interview.job.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{interview.employer.company.name}</td>
                    <td>{interview.employer.user.name}</td>
                    <td>
                      <div className="apps-datetime-cell">
                        <div>{interview.calendarData?.date}</div>
                        <div className="apps-time">
                          {interview.calendarData?.time}
                        </div>
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
    </div>
  );
};

export default InterviewComponent;
