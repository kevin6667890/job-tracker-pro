import type { ApplicationStatus } from "../types";

export const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Applied: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  OA: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  Interview: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  Offer: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  Rejected: "bg-red-500/10 text-red-400 border-red-500/30",
};

export default function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
