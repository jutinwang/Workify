import { useMemo, useState, useEffect } from "react";
import "./apps.css";
import "../var.css";
import { APPLICATION_STEPS, statusToStepIndex } from "./progress";
import { studentApi } from "../api/student";
import { Box, Tab, Tabs } from "@mui/material";

import ApplicationsHeader from "./ApplicationsHeader";
import ApplicationsFilters from "./ApplicationsFilter";
import ApplicationsList from "./ApplicationsList";
import Pagination from "./Pagination";
import EmptyState from "./EmptyState";
import InterviewComponent from "./InterviewComponent";
import OfferModal from "./OfferModal";

const PAGE_SIZE = 8;

const Apps = () => {
  // Data
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [location, setLocation] = useState("All");
  const [length, setLength] = useState("All");
  const [activeTab, setActiveTab] = useState(0);
  const [sortBy, setSortBy] = useState("lastUpdatedDesc");
  const [selectedOffer, setSelectedOffer] = useState(null);
  // Pagination
  const [page, setPage] = useState(1);

  // Fetch applications on mount
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await studentApi.getApplications();

        // Transform backend data to match frontend structure
        console.log(response);
        const transformed = response.applications.map((app) => ({
          id: app.id,
          jobId: app.job.id,
          company: app.job.company.name,
          role: app.job.title,
          length: app.job.length,
          location: app.job.location,
          appliedAt: app.appliedAt,
          status: app.status,
          lastUpdated: app.updatedAt,
          job: app.job,
          offerLetterUrl: app.offerLetterUrl,
        }));

        setApplications(transformed);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
        setError("Failed to load applications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleViewOffer = (application) => {
    setSelectedOffer(application);
  };

  const handleAcceptOffer = async (applicationId) => {
    try {
      await studentApi.acceptOffer(applicationId);
      console.log("Accepting offer for application:", applicationId);
      alert("Offer accepted! Congratulations!");
      
      // Refresh applications
      const response = await studentApi.getApplications();
      const transformed = response.applications.map((app) => ({
        id: app.id,
        jobId: app.job.id,
        company: app.job.company.name,
        role: app.job.title,
        length: app.job.length,
        location: app.job.location,
        appliedAt: app.appliedAt,
        status: app.status,
        lastUpdated: app.updatedAt,
        job: app.job,
        offerLetterUrl: app.offerLetterUrl,
      }));
      setApplications(transformed);
      setSelectedOffer(null);
    } catch (err) {
      console.error("Failed to accept offer:", err);
      alert("Failed to accept offer. Please try again.");
    }
  };

  const handleRejectOffer = async (applicationId) => {
    try {
      await studentApi.rejectOffer(applicationId);
      console.log("Rejecting offer for application:", applicationId);
      alert("Offer declined.");
      
      // Refresh applications
      const response = await studentApi.getApplications();
      const transformed = response.applications.map((app) => ({
        id: app.id,
        jobId: app.job.id,
        company: app.job.company.name,
        role: app.job.title,
        length: app.job.length,
        location: app.job.location,
        appliedAt: app.appliedAt,
        status: app.status,
        lastUpdated: app.updatedAt,
        job: app.job,
        offerLetterUrl: app.offerLetterUrl,
      }));
      setApplications(transformed);
      setSelectedOffer(null);
    } catch (err) {
      console.error("Failed to reject offer:", err);
      alert("Failed to reject offer. Please try again.");
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    let out = applications.filter((a) => {
      const matchesSearch = !q || a.company.toLowerCase().includes(q);
      const matchesStatus = status === "All" || a.status === status;
      const matchesLocation = location === "All" || a.location === location;
      const matchesLength = length === "All" || a.length === length;
      return matchesSearch && matchesStatus && matchesLocation && matchesLength;
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
  }, [applications, search, status, location, length, sortBy]);

  // Extract unique locations and lengths for filter options
  const locationOptions = useMemo(() => {
    const locations = [
      ...new Set(applications.map((a) => a.location).filter(Boolean)),
    ];
    const opts = ["All", ...locations.sort()];
    console.log("Location options:", opts);
    return opts;
  }, [applications]);

  const lengthOptions = useMemo(() => {
    const lengths = [
      ...new Set(applications.map((a) => a.length).filter(Boolean)),
    ];
    const opts = ["All", ...lengths.sort()];
    console.log("Length options:", opts);
    return opts;
  }, [applications]);

  const ApplicationsComponent = () => {
    if (loading) {
      return (
        <div className="apps-loading-state">
          <p>Loading applications...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="apps-error-state">
          <p>{error}</p>
        </div>
      );
    }

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
          location={location}
          setLocation={(v) => {
            setLocation(v);
            setPage(1);
          }}
          length={length}
          setLength={(v) => {
            setLength(v);
            setPage(1);
          }}
          sortBy={sortBy}
          setSortBy={setSortBy}
          statusOptions={["All", ...APPLICATION_STEPS]}
          locationOptions={locationOptions}
          lengthOptions={lengthOptions}
        />
        {paged.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <ApplicationsList
              applications={paged}
              onViewOffer={handleViewOffer}
            />
            <Pagination
              page={pageSafe}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
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

  // Check if student has already accepted an offer
  const hasAcceptedOffer = applications.some(app => app.status === "ACCEPTED");

  return (
    <div className="applications-page-container">
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Applications" />
          <Tab label="Interviews" />
        </Tabs>
      </Box>
      {activeTab === 0 ? <ApplicationsComponent /> : <InterviewComponent />}
      {selectedOffer && (
        <OfferModal
          application={selectedOffer}
          onClose={() => setSelectedOffer(null)}
          onAccept={handleAcceptOffer}
          onReject={handleRejectOffer}
          hasAcceptedOffer={hasAcceptedOffer}
        />
      )}
    </div>
  );
};

export default Apps;
