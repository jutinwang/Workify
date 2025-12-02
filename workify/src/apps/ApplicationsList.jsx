import ApplicationRow from "./ApplicationRow";

const ApplicationsList = ({ applications, onViewOffer, onWithdraw }) => {
  const rows = Array.isArray(applications) ? applications.filter(Boolean) : [];

  return (
    <div className="apps-table-wrapper">
      <table className="apps-table" role="table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Role</th>
            <th>Length</th>
            <th>Location</th>
            <th>Applied</th>
            <th>Status</th>
            <th>Last Updated</th>
            <th style={{ textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((app) => (
            <ApplicationRow
              key={app?.id ?? crypto.randomUUID()}
              app={app}
              onViewOffer={onViewOffer}
              onWithdraw={onWithdraw}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationsList;
