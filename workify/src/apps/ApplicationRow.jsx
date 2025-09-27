import ProgressStepper from "./ProgressStepper";
import { fmtDate } from "./progress";

const ApplicationRow = ({ app }) => {
    console.log(app)
  return (
    <tr>
      <td className="cell-strong">{app.company}</td>
      <td>{app.role}</td>
      <td>{app.type}</td>
      <td>{app.location}</td>
      <td>{fmtDate(app.appliedAt)}</td>
      <td>
        <ProgressStepper status={app.status} />
      </td>
      <td>{fmtDate(app.lastUpdated)}</td>
    </tr>
  );
};

export default ApplicationRow;
