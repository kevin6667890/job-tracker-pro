import { SearchX } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-700 bg-gray-900/50 px-6 py-16 text-center">
      <div className="rounded-full bg-gray-800 p-3">
        <SearchX className="h-8 w-8 text-gray-500" />
      </div>
      <h3 className="mt-4 text-sm font-medium text-gray-200">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>}
    </div>
  );
}
