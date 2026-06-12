import { Link } from "react-router-dom";
import { Briefcase, MessageSquare, TrendingUp, Trophy } from "lucide-react";
import { Cell, Funnel, FunnelChart, LabelList, ResponsiveContainer, Tooltip } from "recharts";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import Spinner from "../components/Spinner";
import { fetchApplications, fetchFunnel, fetchSummary } from "../api/endpoints";
import { useFetch } from "../hooks/useFetch";
import { formatDate } from "../utils/date";

const FUNNEL_COLORS = ["#6366f1", "#8b5cf6", "#a855f7", "#10b981"];

export default function Dashboard() {
  const { data: summary, loading: summaryLoading } = useFetch(fetchSummary, []);
  const { data: funnel, loading: funnelLoading } = useFetch(fetchFunnel, []);
  const { data: applications, loading: appsLoading } = useFetch(fetchApplications, []);

  const recent = applications?.slice(0, 5) ?? [];

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">Your job search at a glance.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Applications"
          value={summaryLoading ? "—" : summary?.total ?? 0}
          icon={Briefcase}
        />
        <StatCard
          label="Interviews"
          value={summaryLoading ? "—" : summary?.by_status.Interview ?? 0}
          icon={MessageSquare}
          accent="text-purple-400"
        />
        <StatCard
          label="Offers"
          value={summaryLoading ? "—" : summary?.by_status.Offer ?? 0}
          icon={Trophy}
          accent="text-emerald-400"
        />
        <StatCard
          label="Response Rate"
          value={summaryLoading ? "—" : `${Math.round((summary?.response_rate ?? 0) * 100)}%`}
          icon={TrendingUp}
          accent="text-amber-400"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-700 bg-gray-900 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3 sm:px-5">
            <h2 className="text-sm font-semibold text-white">Recent Applications</h2>
            <Link to="/applications" className="text-sm font-medium text-indigo-400 hover:text-indigo-300">
              View all
            </Link>
          </div>
          {appsLoading ? (
            <div className="flex justify-center py-10">
              <Spinner />
            </div>
          ) : recent.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-gray-500">No applications yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-4 py-2 font-medium sm:px-5">Company</th>
                    <th className="px-4 py-2 font-medium sm:px-5">Role</th>
                    <th className="px-4 py-2 font-medium sm:px-5">Status</th>
                    <th className="px-4 py-2 font-medium sm:px-5">Applied</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((app) => (
                    <tr key={app.id} className="border-t border-gray-800">
                      <td className="px-4 py-3 text-sm font-medium text-white sm:px-5">{app.company}</td>
                      <td className="px-4 py-3 text-sm text-gray-300 sm:px-5">{app.role}</td>
                      <td className="px-4 py-3 sm:px-5">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400 sm:px-5">{formatDate(app.applied_date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-700 bg-gray-900 p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-white">Pipeline Funnel</h2>
          {funnelLoading ? (
            <div className="flex h-60 items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <FunnelChart>
                <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: 8 }} />
                <Funnel dataKey="count" data={funnel ?? []} isAnimationActive nameKey="stage">
                  <LabelList position="right" dataKey="stage" fill="#e5e7eb" stroke="none" fontSize={12} />
                  {(funnel ?? []).map((entry, index) => (
                    <Cell key={entry.stage} fill={FUNNEL_COLORS[index % FUNNEL_COLORS.length]} />
                  ))}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
