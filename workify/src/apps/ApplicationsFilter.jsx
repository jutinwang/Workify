import Dropdown from "../common/Dropdown";

const toOpts = (arr) => arr.map((x) =>
    typeof x === "string" ? { value: x, label: x } : x
);

const ApplicationsFilters = ({
    search, setSearch,
    status, setStatus,
    location, setLocation,
    length, setLength,
    sortBy, setSortBy,
    statusOptions,
    locationOptions,
    lengthOptions,
}) => {
    console.log('Filter props:', { locationOptions, lengthOptions, location, length });

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
                    placeholder="Search by company name…"
                />

                <Dropdown
                    value={status}
                    options={toOpts(statusOptions)}
                    onChange={(v) => setStatus(v)}
                    placeholder="Status"
                />

                <Dropdown
                    value={location}
                    options={toOpts(locationOptions)}
                    onChange={(v) => setLocation(v)}
                    placeholder="Location"
                />

                <Dropdown
                    value={length}
                    options={toOpts(lengthOptions)}
                    onChange={(v) => setLength(v)}
                    placeholder="Length"
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
