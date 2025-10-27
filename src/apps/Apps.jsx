import { useMemo, useState } from "react";
import "./apps.css";
import { APPLICATION_STEPS, statusToStepIndex } from "./progress";
import { mockApplications } from "./mockApplications";

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
  const [type, setType] = useState("All");
  const [sortBy, setSortBy] = useState("lastUpdatedDesc");

  // Pagination
  const [page, setPage] = useState(1);

  console.log(mockApplications)

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
        return (
          statusToStepIndex(b.status) - statusToStepIndex(a.status)
        );
      }
      return 0;
    });

    return out;
  }, [search, status, type, sortBy]);

  console.log(filtered)

  // reset page when filters change
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const paged = useMemo(() => {
    const start = (pageSafe - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, pageSafe]);

  console.log(paged)

  return (
    <div className="applications-page-container">
      <ApplicationsHeader total={filtered.length} />

      <ApplicationsFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={(v) => { setStatus(v); setPage(1); }}
        type={type}
        setType={(v) => { setType(v); setPage(1); }}
        sortBy={sortBy}
        setSortBy={setSortBy}
        statusOptions={["All", ...APPLICATION_STEPS]}
        typeOptions={["All", "Full-time", "Internship", "Co-op", "Contract", "Part-time"]}
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

export default Apps;
