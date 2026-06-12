import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import ApplicationRow from "../components/ApplicationRow";
import EmptyState from "../components/EmptyState";
import Spinner from "../components/Spinner";
import { deleteApplication, fetchApplications, updateApplicationStatus } from "../api/endpoints";
import { getErrorMessage } from "../api/client";
import { useToast } from "../context/ToastContext";
import { STATUS_OPTIONS, type Application, type ApplicationStatus } from "../types";

const TABS = ["All", "Active", ...STATUS_OPTIONS] as const;
type Tab = (typeof TABS)[number];

const ACTIVE_STATUSES: ApplicationStatus[] = ["Applied", "OA", "Interview"];

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [tab, setTab] = useState<Tab>("All");
  const { showToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const params: { status?: string; search?: string } = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (tab !== "All" && tab !== "Active") params.status = tab;

    setLoading(true);
    fetchApplications(params)
      .then(setApplications)
      .catch((err: unknown) => showToast(getErrorMessage(err)))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, tab]);

  const visible = useMemo(() => {
    if (tab === "Active") {
      return applications.filter((app) => ACTIVE_STATUSES.includes(app.status));
    }
    return applications;
  }, [applications, tab]);

  const handleStatusChange = async (id: number, status: ApplicationStatus) => {
    try {
      const updated = await updateApplicationStatus(id, status);
      setApplications((prev) => prev.map((app) => (app.id === id ? updated : app)));
    } catch (err) {
      showToast(getErrorMessage(err));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteApplication(id);
      setApplications((prev) => prev.filter((app) => app.id !== id));
      showToast("Application deleted", "success");
    } catch (err) {
      showToast(getErrorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Applications</h1>
        <p className="mt-1 text-sm text-gray-400">{applications.length} application(s)</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company or role..."
            className="w-full rounded-md border border-gray-700 bg-gray-900 py-2 pl-9 pr-3 text-sm text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === t
                  ? "border-indigo-500 bg-indigo-500 text-white"
                  : "border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center rounded-xl border border-gray-700 bg-gray-900 py-16">
          <Spinner />
        </div>
      ) : visible.length === 0 ? (
        <EmptyState
          title="No applications found"
          description="Try adjusting your search or filters, or add a new application to get started."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-700 bg-gray-900">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Applied</th>
                <th className="px-4 py-3 font-medium">Deadline</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((app) => (
                <ApplicationRow
                  key={app.id}
                  application={app}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
