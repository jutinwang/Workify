import Dropdown from "../common/Dropdown";

const toOpts = (arr) => arr.map((x) =>
    typeof x === "string" ? { value: x, label: x } : x
);

const ApplicationsFilters = ({
    search, setSearch,
    status, setStatus,
    type, setType,
    sortBy, setSortBy,
    statusOptions,
    typeOptions
}) => {

    const sortOptions = [
        { value: "lastUpdatedDesc", label: "Last updated (new → old)" },
        { value: "appliedAtDesc", label: "Applied date (new → old)" },
        { value: "companyAsc", label: "Company (A → Z)" },
        { value: "progressDesc", label: "Progress (high → low)" },
    ];

    return (
        <section className="apps-filters">
            <div className="filters-row">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input"
                    placeholder="Search by company, role, or location…"
                />

                <Dropdown
                    value={status}
                    options={toOpts(statusOptions)}
                    onChange={(v) => setStatus(v)}
                    placeholder="Status"
                />

                <Dropdown
                    value={type}
                    options={toOpts(typeOptions)}
                    onChange={(v) => setType(v)}
                    placeholder="Type"
                />

                <Dropdown
                    value={sortBy}
                    options={sortOptions}
                    onChange={(v) => setSortBy(v)}
                    placeholder="Sort by"
                />
            </div>
        </section>
    );
};

export default ApplicationsFilters;
