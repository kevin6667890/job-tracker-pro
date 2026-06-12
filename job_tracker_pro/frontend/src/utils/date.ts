export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function daysFromToday(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${dateStr}T00:00:00`);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatShortDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function getDeadlineClass(deadline: string | null): string {
  if (!deadline) return "text-gray-500";
  const diffDays = daysFromToday(deadline);
  if (diffDays < 0) return "text-gray-500";
  if (diffDays <= 3) return "text-red-400 font-semibold";
  if (diffDays <= 7) return "text-orange-400 font-medium";
  return "text-gray-300";
}
