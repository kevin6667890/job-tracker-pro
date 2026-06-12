interface SpinnerProps {
  className?: string;
}

export default function Spinner({ className = "h-6 w-6" }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`animate-spin rounded-full border-2 border-gray-700 border-t-indigo-500 ${className}`}
    />
  );
}
