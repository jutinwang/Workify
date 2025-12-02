import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Tab, Tabs } from "@mui/material";
import { adminApi } from "../api/admin";
import "./admin.css";

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Employers data
  const [pendingEmployers, setPendingEmployers] = useState([]);
  const [allEmployers, setAllEmployers] = useState([]);
  const [loadingEmployers, setLoadingEmployers] = useState(false);

  // Students data
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Jobs data
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  // Modal states
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    action: null,
    data: null,
  });

  // Check if user is admin
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "ADMIN") {
      navigate("/");
      return;
    }
  }, [navigate]);

  // Fetch stats on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminApi.getStats();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === 0) fetchPendingEmployers();
    else if (activeTab === 1) fetchAllEmployers();
    else if (activeTab === 2) fetchStudents();
    else if (activeTab === 3) fetchJobs();
  }, [activeTab]);

  const fetchPendingEmployers = async () => {
    try {
      setLoadingEmployers(true);
      const data = await adminApi.getPendingEmployers();
      setPendingEmployers(data);
    } catch (err) {
      console.error("Error fetching pending employers:", err);
    } finally {
      setLoadingEmployers(false);
    }
  };

  const fetchAllEmployers = async () => {
    try {
      setLoadingEmployers(true);
      const data = await adminApi.getAllEmployers();
      setAllEmployers(data);
    } catch (err) {
      console.error("Error fetching employers:", err);
    } finally {
      setLoadingEmployers(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      const data = await adminApi.getAllStudents();
      setStudents(data);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      const data = await adminApi.getAllJobs();
      setJobs(data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleApproveEmployer = async (employerId) => {
    try {
      await adminApi.approveEmployer(employerId);
      // Refresh data and stats
      await fetchPendingEmployers();
      const newStats = await adminApi.getStats();
      setStats(newStats);
    } catch (err) {
      console.error("Error approving employer:", err);
      alert("Failed to approve employer");
    }
  };

  const handleDeclineEmployer = async (employerId) => {
    try {
      await adminApi.declineEmployer(employerId);
      // Refresh data and stats
      await fetchPendingEmployers();
      const newStats = await adminApi.getStats();
      setStats(newStats);
    } catch (err) {
      console.error("Error declining employer:", err);
      alert("Failed to decline employer");
    }
  };

  const handleSuspendUser = async (userId) => {
    try {
      await adminApi.suspendUser(userId);
      // Refresh current tab data
      if (activeTab === 1) fetchAllEmployers();
      else if (activeTab === 2) fetchStudents();
    } catch (err) {
      console.error("Error suspending user:", err);
      alert("Failed to suspend/unsuspend user");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await adminApi.deleteUser(userId);
      // Refresh data
      if (activeTab === 1) fetchAllEmployers();
      else if (activeTab === 2) fetchStudents();
      const newStats = await adminApi.getStats();
      setStats(newStats);
    } catch (err) {
      console.error("Error deleting user:", err);
      alert(err.message || "Failed to delete user");
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await adminApi.deleteJob(jobId);
      // Refresh jobs and stats
      await fetchJobs();
      const newStats = await adminApi.getStats();
      setStats(newStats);
    } catch (err) {
      console.error("Error deleting job:", err);
      alert(err.message || "Failed to delete job");
    }
  };

  const openConfirmModal = (action, data) => {
    setConfirmModal({ open: true, action, data });
  };

  const closeConfirmModal = () => {
    setConfirmModal({ open: false, action: null, data: null });
  };

  const executeConfirmedAction = async () => {
    const { action, data } = confirmModal;
    closeConfirmModal();

    if (action === "approve") await handleApproveEmployer(data.userId);
    else if (action === "decline") await handleDeclineEmployer(data.userId);
    else if (action === "suspend") await handleSuspendUser(data.userId);
    else if (action === "deleteUser") await handleDeleteUser(data.userId);
    else if (action === "deleteJob") await handleDeleteJob(data.jobId);
  };

  if (loading) {
    return <div className="admin-loading">Loading admin dashboard...</div>;
  }

  if (error) {
    return <div className="admin-error">{error}</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users, employers, and job postings</p>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <h3>Total Students</h3>
          <div className="stat-value">{stats?.totalStudents || 0}</div>
          <div className="stat-label">Registered Students</div>
        </div>
        <div className="admin-stat-card">
          <h3>Total Employers</h3>
          <div className="stat-value">{stats?.totalEmployers || 0}</div>
          <div className="stat-label">Registered Employers</div>
        </div>
        <div className="admin-stat-card">
          <h3>Pending Approvals</h3>
          <div className="stat-value">{stats?.pendingEmployers || 0}</div>
          <div className="stat-label">Awaiting Review</div>
        </div>
        <div className="admin-stat-card">
          <h3>Active Jobs</h3>
          <div className="stat-value">{stats?.activeJobs || 0}</div>
          <div className="stat-label">of {stats?.totalJobs || 0} total</div>
        </div>
        <div className="admin-stat-card">
          <h3>Total Applications</h3>
          <div className="stat-value">{stats?.totalApplications || 0}</div>
          <div className="stat-label">All Time</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs-container">
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
            <Tab
              label={`Pending Employers (${stats?.pendingEmployers || 0})`}
            />
            <Tab label="All Employers" />
            <Tab label="Students" />
            <Tab label="Jobs" />
          </Tabs>
        </Box>

        <div className="admin-tab-content">
          {/* Pending Employers Tab */}
          {activeTab === 0 && (
            <div>
              {loadingEmployers ? (
                <div className="admin-loading">
                  Loading pending employers...
                </div>
              ) : pendingEmployers.length === 0 ? (
                <div className="admin-table-empty">
                  No pending employer approvals
                </div>
              ) : (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>User Info</th>
                        <th>Company</th>
                        <th>Work Email</th>
                        <th>Status</th>
                        <th>Registered</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingEmployers.map((emp) => (
                        <tr key={emp.id}>
                          <td>
                            <div className="admin-user-info">
                              <div className="admin-user-name">{emp.name}</div>
                              <div className="admin-user-email">
                                {emp.email}
                              </div>
                              <div className="admin-user-id">ID: {emp.id}</div>
                            </div>
                          </td>
                          <td>
                            {emp.employer?.company ? (
                              <div className="admin-company-info">
                                <div className="admin-company-name">
                                  {emp.employer.company.name}
                                </div>
                                {emp.employer.company.url && (
                                  <a
                                    href={emp.employer.company.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="admin-company-url"
                                  >
                                    {emp.employer.company.url}
                                  </a>
                                )}
                              </div>
                            ) : (
                              <span style={{ color: "#999" }}>No company</span>
                            )}
                          </td>
                          <td>{emp.employer?.workEmail || "—"}</td>
                          <td>
                            <span className="admin-badge admin-badge-warning">
                              Pending
                            </span>
                          </td>
                          <td>
                            {new Date(emp.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <button
                              className="admin-btn admin-btn-primary"
                              onClick={() =>
                                openConfirmModal("approve", { userId: emp.id })
                              }
                            >
                              Approve
                            </button>
                            <button
                              className="admin-btn admin-btn-danger"
                              onClick={() =>
                                openConfirmModal("decline", { userId: emp.id })
                              }
                              style={{ marginLeft: "8px" }}
                            >
                              Decline
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* All Employers Tab */}
          {activeTab === 1 && (
            <div>
              {loadingEmployers ? (
                <div className="admin-loading">Loading employers...</div>
              ) : allEmployers.length === 0 ? (
                <div className="admin-table-empty">No employers found</div>
              ) : (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>User Info</th>
                        <th>Company</th>
                        <th>Status</th>
                        <th>Suspended</th>
                        <th>Registered</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allEmployers.map((emp) => (
                        <tr key={emp.id}>
                          <td>
                            <div className="admin-user-info">
                              <div className="admin-user-name">{emp.name}</div>
                              <div className="admin-user-email">
                                {emp.email}
                              </div>
                              <div className="admin-user-id">ID: {emp.id}</div>
                            </div>
                          </td>
                          <td>
                            {emp.employer?.company ? (
                              <div className="admin-company-info">
                                <div className="admin-company-name">
                                  {emp.employer.company.name}
                                </div>
                              </div>
                            ) : (
                              <span style={{ color: "#999" }}>No company</span>
                            )}
                          </td>
                          <td>
                            {emp.employer?.approved ? (
                              <span className="admin-badge admin-badge-success">
                                Approved
                              </span>
                            ) : (
                              <span className="admin-badge admin-badge-warning">
                                Pending
                              </span>
                            )}
                          </td>
                          <td>
                            {emp.suspended ? (
                              <span className="admin-badge admin-badge-danger">
                                Yes
                              </span>
                            ) : (
                              <span className="admin-badge admin-badge-success">
                                No
                              </span>
                            )}
                          </td>
                          <td>
                            {new Date(emp.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <button
                              className={`admin-btn ${
                                emp.suspended
                                  ? "admin-btn-secondary"
                                  : "admin-btn-warning"
                              }`}
                              onClick={() =>
                                openConfirmModal("suspend", { userId: emp.id })
                              }
                            >
                              {emp.suspended ? "Unsuspend" : "Suspend"}
                            </button>
                            <button
                              className="admin-btn admin-btn-danger"
                              onClick={() =>
                                openConfirmModal("deleteUser", {
                                  userId: emp.id,
                                })
                              }
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 2 && (
            <div>
              {loadingStudents ? (
                <div className="admin-loading">Loading students...</div>
              ) : students.length === 0 ? (
                <div className="admin-table-empty">No students found</div>
              ) : (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>User Info</th>
                        <th>Major</th>
                        <th>Year</th>
                        <th>Suspended</th>
                        <th>Registered</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id}>
                          <td>
                            <div className="admin-user-info">
                              <div className="admin-user-name">
                                {student.name}
                              </div>
                              <div className="admin-user-email">
                                {student.email}
                              </div>
                              <div className="admin-user-id">
                                ID: {student.id}
                              </div>
                            </div>
                          </td>
                          <td>{student.student?.major || "—"}</td>
                          <td>{student.student?.year || "—"}</td>
                          <td>
                            {student.suspended ? (
                              <span className="admin-badge admin-badge-danger">
                                Yes
                              </span>
                            ) : (
                              <span className="admin-badge admin-badge-success">
                                No
                              </span>
                            )}
                          </td>
                          <td>
                            {new Date(student.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <button
                              className={`admin-btn ${
                                student.suspended
                                  ? "admin-btn-secondary"
                                  : "admin-btn-warning"
                              }`}
                              onClick={() =>
                                openConfirmModal("suspend", {
                                  userId: student.id,
                                })
                              }
                            >
                              {student.suspended ? "Unsuspend" : "Suspend"}
                            </button>
                            <button
                              className="admin-btn admin-btn-danger"
                              onClick={() =>
                                openConfirmModal("deleteUser", {
                                  userId: student.id,
                                })
                              }
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Jobs Tab */}
          {activeTab === 3 && (
            <div>
              {loadingJobs ? (
                <div className="admin-loading">Loading jobs...</div>
              ) : jobs.length === 0 ? (
                <div className="admin-table-empty">No jobs found</div>
              ) : (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Job Title</th>
                        <th>Company</th>
                        <th>Posted By</th>
                        <th>Applications</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((job) => (
                        <tr key={job.id}>
                          <td>
                            <div className="admin-job-title">{job.title}</div>
                            <div className="admin-job-meta">
                              <span>{job.location || "Remote"}</span>
                              <span>{job.length || "—"}</span>
                            </div>
                          </td>
                          <td>{job.company?.name || "—"}</td>
                          <td>
                            <div className="admin-user-info">
                              <div className="admin-user-name">
                                {job.employer?.user?.name || "—"}
                              </div>
                              <div className="admin-user-email">
                                {job.employer?.user?.email || "—"}
                              </div>
                            </div>
                          </td>
                          <td>{job._count?.applications || 0}</td>
                          <td>
                            {job.postingStatus === "ACTIVE" && (
                              <span className="admin-badge admin-badge-success">
                                Active
                              </span>
                            )}
                            {job.postingStatus === "ARCHIVED" && (
                              <span className="admin-badge admin-badge-warning">
                                Archived
                              </span>
                            )}
                            {job.postingStatus === "DELETED" && (
                              <span className="admin-badge admin-badge-danger">
                                Deleted
                              </span>
                            )}
                          </td>
                          <td>
                            {new Date(job.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            {job.postingStatus !== "DELETED" && (
                              <button
                                className="admin-btn admin-btn-danger"
                                onClick={() =>
                                  openConfirmModal("deleteJob", {
                                    jobId: job.id,
                                  })
                                }
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal.open && (
        <div className="admin-modal-overlay" onClick={closeConfirmModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Confirm Action</h2>
            <p>
              {confirmModal.action === "approve" &&
                "Are you sure you want to approve this employer? They will gain full access to the platform."}
              {confirmModal.action === "decline" &&
                "Are you sure you want to decline this employer? This will permanently delete their account and they will need to re-register."}
              {confirmModal.action === "suspend" &&
                "Are you sure you want to suspend/unsuspend this user? This will toggle their access to the platform."}
              {confirmModal.action === "deleteUser" &&
                "Are you sure you want to delete this user? This action cannot be undone and will remove all associated data."}
              {confirmModal.action === "deleteJob" &&
                "Are you sure you want to delete this job posting? This will soft-delete the job and hide it from searches."}
            </p>
            <div className="admin-modal-actions">
              <button
                className="admin-btn admin-btn-secondary"
                onClick={closeConfirmModal}
              >
                Cancel
              </button>
              <button
                className={`admin-btn ${
                  confirmModal.action === "approve"
                    ? "admin-btn-primary"
                    : "admin-btn-danger"
                }`}
                onClick={executeConfirmedAction}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
