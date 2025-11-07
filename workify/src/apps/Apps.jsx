import { useMemo, useState } from "react";
import "./apps.css";
import "../var.css";
import { APPLICATION_STEPS, statusToStepIndex } from "./progress";
import { mockApplications } from "./mockApplications";
import { Box, Tab, Tabs } from "@mui/material";
import Card from "../common/Card";

import ApplicationsHeader from "./ApplicationsHeader";
import ApplicationsFilters from "./ApplicationsFilter";
import ApplicationsList from "./ApplicationsList";
import Pagination from "./Pagination";
import EmptyState from "./EmptyState";

const PAGE_SIZE = 8;

const Apps = () => {
  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [activeTab, setActiveTab] = useState(0);
  const [type, setType] = useState("All");
  const [sortBy, setSortBy] = useState("lastUpdatedDesc");
  // Pagination
  const [page, setPage] = useState(1);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  console.log(mockApplications);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    let out = mockApplications.filter((a) => {
      const matchesQ =
        !q ||
        a.company.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q) ||
        (a.location ?? "").toLowerCase().includes(q);
      const matchesStatus = status === "All" || a.status === status;
      const matchesType = type === "All" || a.type === type;
      return matchesQ && matchesStatus && matchesType;
    });

    // sort
    out.sort((a, b) => {
      const by = sortBy;
      if (by === "lastUpdatedDesc") {
        return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      }
      if (by === "appliedAtDesc") {
        return new Date(b.appliedAt) - new Date(a.appliedAt);
      }
      if (by === "companyAsc") {
        return a.company.localeCompare(b.company);
      }
      if (by === "progressDesc") {
        return statusToStepIndex(b.status) - statusToStepIndex(a.status);
      }
      return 0;
    });

    return out;
  }, [search, status, type, sortBy]);

  console.log(filtered);

  const ApplicationsComponent = () => {
    return (
      <div>
        <ApplicationsHeader total={filtered.length} />
        <ApplicationsFilters
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={(v) => {
            setStatus(v);
            setPage(1);
          }}
          type={type}
          setType={(v) => {
            setType(v);
            setPage(1);
          }}
          sortBy={sortBy}
          setSortBy={setSortBy}
          statusOptions={["All", ...APPLICATION_STEPS]}
          typeOptions={[
            "All",
            "Full-time",
            "Internship",
            "Co-op",
            "Contract",
            "Part-time",
          ]}
        />
        {paged.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <ApplicationsList applications={paged} />
            {/* <Pagination
      page={pageSafe}
      totalPages={totalPages}
      onPageChange={setPage}
    /> */}
          </>
        )}
      </div>
    );
  };

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
            <div className="interview-requests-container">
              {pendingRequests.map((request) => (
                <div key={request.id} className="interview-request-card">
                  <div className="interview-request-header">
                    <div className="job-info">
                      <h3 className="job-title">{request.job.title}</h3>
                      <p className="company-name">
                        {request.employer.company.name}
                      </p>
                      <div className="job-details">
                        <span className="job-type">{request.job.type}</span>
                        {request.job.location && (
                          <>
                            <span className="separator">•</span>
                            <span className="job-location">
                              {request.job.location}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="request-meta">
                      <p className="interviewer">
                        From: {request.employer.user.name}
                      </p>
                      <p className="request-date">
                        Requested: {formatDate(request.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="interview-request-actions">
                    <button
                      className="btn btn-success"
                      onClick={() => handleAccept(request.id)}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() => handleDecline(request.id)}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No pending interview requests.</p>
            </div>
          )}
        </Card>

        <Card title="Upcoming Interviews">
          {scheduledInterviews.length > 0 ? (
            <div className="interviews-table-wrapper">
              <table className="interviews-table">
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
                        <div className="position-cell">
                          <span className="cell-strong">
                            {interview.job.title}
                          </span>
                          <div className="position-details">
                            <span className="job-type">
                              {interview.job.type}
                            </span>
                            {interview.job.location && (
                              <>
                                <span className="separator">•</span>
                                <span>{interview.job.location}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{interview.employer.company.name}</td>
                      <td>{interview.employer.user.name}</td>
                      <td>
                        <div className="datetime-cell">
                          <div>{interview.calendarData?.date}</div>
                          <div className="time">
                            {interview.calendarData?.time}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="interview-actions">
                          <button className="btn btn-small">
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
            <div className="empty-state">
              <p>No upcoming interviews scheduled.</p>
            </div>
          )}
        </Card>
      </div>
    );
  };

  // reset page when filters change
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const paged = useMemo(() => {
    const start = (pageSafe - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, pageSafe]);

  console.log(paged);

  return (
    <div className="applications-page-container">
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Applications" />
          <Tab label="Interviews" />
        </Tabs>
      </Box>
      {activeTab === 0 ? <ApplicationsComponent /> : <InterviewComponent />}
    </div>
  );
};

export default Apps;
