import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { STATUS_OPTIONS, type Application, type ApplicationStatus } from "../types";
import StatusBadge from "./StatusBadge";
import { formatDate, getDeadlineClass } from "../utils/date";

interface ApplicationRowProps {
  application: Application;
  onStatusChange: (id: number, status: ApplicationStatus) => void;
  onDelete: (id: number) => void;
}

export default function ApplicationRow({ application, onStatusChange, onDelete }: ApplicationRowProps) {
  const handleDelete = () => {
    if (window.confirm(`Delete application for "${application.role}" at ${application.company}?`)) {
      onDelete(application.id);
    }
  };

  return (
    <tr className="border-b border-gray-800 last:border-0 hover:bg-gray-900/60">
      <td className="px-4 py-3 text-sm font-medium text-white">{application.company}</td>
      <td className="px-4 py-3 text-sm text-gray-300">{application.role}</td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={application.status} />
          <select
            value={application.status}
            onChange={(e) => onStatusChange(application.id, e.target.value as ApplicationStatus)}
            className="rounded-md border border-gray-700 bg-gray-800 px-1.5 py-1 text-xs text-gray-300 focus:border-indigo-500 focus:outline-none"
            aria-label={`Change status for ${application.company}`}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-400">{formatDate(application.applied_date)}</td>
      <td className={`px-4 py-3 text-sm ${getDeadlineClass(application.deadline)}`}>
        {formatDate(application.deadline)}
      </td>
      <td className="px-4 py-3 text-sm">
        <div className="flex items-center gap-3">
          <Link to={`/edit/${application.id}`} className="font-medium text-indigo-400 hover:text-indigo-300">
            Edit
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            className="text-red-400 hover:text-red-300"
            aria-label={`Delete application for ${application.company}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
