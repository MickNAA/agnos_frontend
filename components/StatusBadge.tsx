import clsx from "clsx";
import { FormStatus } from "@/hooks/useSocket";

const STATUS_CONFIG: Record<FormStatus, { label: string; className: string; dot: string }> = {
  inactive: {
    label: "Inactive",
    className: "bg-gray-100 text-gray-600",
    dot: "bg-gray-400",
  },
  filling: {
    label: "Filling in",
    className: "bg-yellow-100 text-yellow-700",
    dot: "bg-yellow-400 animate-pulse",
  },
  submitted: {
    label: "Submitted",
    className: "bg-green-100 text-green-700",
    dot: "bg-green-500",
  },
};

export function StatusBadge({ status }: { status: FormStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className
      )}
    >
      <span className={clsx("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}
