import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Funnel,
  FunnelChart,
  LabelList,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Spinner from "../components/Spinner";
import { fetchApplications, fetchFunnel, fetchSources, fetchSummary, fetchTimeline } from "../api/endpoints";
import { useFetch } from "../hooks/useFetch";
import { formatShortDate } from "../utils/date";
import type { SourceStat } from "../types";

const FUNNEL_COLORS = ["#6366f1", "#8b5cf6", "#a855f7", "#10b981"];
const SOURCE_COLORS: Record<string, string> = {
  LinkedIn: "#0a66c2",
  campus: "#8b5cf6",
  referral: "#10b981",
  cold: "#f59e0b",
};
const FALLBACK_COLORS = ["#6366f1", "#ec4899", "#14b8a6", "#f97316"];

const tooltipStyle = { backgroundColor: "#111827", border: "1px solid #374151", borderRadius: 8, color: "#e5e7eb" };

function getBestSource(sources: SourceStat[]): string {
  if (sources.length === 0) return "—";
  const withOffers = sources.filter((s) => s.offer_count > 0);
  const pool = withOffers.length > 0 ? withOffers : sources;
  return pool.reduce((best, current) => {
    const bestRate = best.count ? best.offer_count / best.count : 0;
    const currentRate = current.count ? current.offer_count / current.count : 0;
    if (currentRate > bestRate) return current;
    if (currentRate === bestRate && current.count > best.count) return current;
    return best;
  }).source;
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900 p-4 sm:p-5">
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function Analytics() {
  const { data: funnel, loading: funnelLoading } = useFetch(fetchFunnel, []);
  const { data: timeline, loading: timelineLoading } = useFetch(fetchTimeline, []);
  const { data: sources, loading: sourcesLoading } = useFetch(fetchSources, []);
  const { data: summary, loading: summaryLoading } = useFetch(fetchSummary, []);
  const { data: applications, loading: appsLoading } = useFetch(fetchApplications, []);

  const last30Days = (timeline ?? []).slice(-30);

  const respondedApps = (applications ?? []).filter((app) => app.status !== "Applied");
  const avgDaysToResponse =
    respondedApps.length > 0
      ? respondedApps.reduce((sum, app) => {
          const applied = new Date(`${app.applied_date}T00:00:00`).getTime();
          const updated = new Date(app.updated_at).getTime();
          return sum + Math.max(0, (updated - applied) / (1000 * 60 * 60 * 24));
        }, 0) / respondedApps.length
      : 0;

  const bestSource = getBestSource(sources ?? []);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Analytics</h1>
        <p className="mt-1 text-sm text-gray-400">Insights into your job search pipeline.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Pipeline Funnel">
          {funnelLoading ? (
            <div className="flex h-72 items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={288}>
              <FunnelChart>
                <Tooltip contentStyle={tooltipStyle} />
                <Funnel dataKey="count" data={funnel ?? []} isAnimationActive nameKey="stage">
                  <LabelList position="right" dataKey="stage" fill="#e5e7eb" stroke="none" fontSize={12} />
                  {(funnel ?? []).map((entry, index) => (
                    <Cell key={entry.stage} fill={FUNNEL_COLORS[index % FUNNEL_COLORS.length]} />
                  ))}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Applications — Last 30 Days">
          {timelineLoading ? (
            <div className="flex h-72 items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={288}>
              <BarChart data={last30Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatShortDate}
                  stroke="#6b7280"
                  fontSize={12}
                  interval={Math.ceil(last30Days.length / 8)}
                />
                <YAxis allowDecimals={false} stroke="#6b7280" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} labelFormatter={(value) => formatShortDate(String(value))} />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Applications by Source">
          {sourcesLoading ? (
            <div className="flex h-72 items-center justify-center">
              <Spinner />
            </div>
          ) : (sources ?? []).length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-500">No source data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={288}>
              <PieChart>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#9ca3af" }} />
                <Pie
                  data={sources ?? []}
                  dataKey="count"
                  nameKey="source"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  isAnimationActive
                >
                  {(sources ?? []).map((entry, index) => (
                    <Cell
                      key={entry.source}
                      fill={SOURCE_COLORS[entry.source] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Quick Stats">
          {summaryLoading || appsLoading || sourcesLoading ? (
            <div className="flex h-72 items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <div className="flex h-72 flex-col justify-center gap-6">
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <span className="text-sm text-gray-400">Response Rate</span>
                <span className="text-2xl font-semibold text-white">
                  {Math.round((summary?.response_rate ?? 0) * 100)}%
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <span className="text-sm text-gray-400">Avg. Days to Response</span>
                <span className="text-2xl font-semibold text-white">{avgDaysToResponse.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Best Source</span>
                <span className="text-2xl font-semibold text-white">{bestSource}</span>
              </div>
            </div>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
