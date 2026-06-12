import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  accent?: string;
}

export default function StatCard({ label, value, icon: Icon, accent = "text-indigo-400" }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900 p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-400">{label}</p>
        {Icon && <Icon className={`h-5 w-5 ${accent}`} />}
      </div>
      <p className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{value}</p>
    </div>
  );
}
