import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusVariant =
  | "open"
  | "filled"
  | "cancelled"
  | "completed"
  | "pending"
  | "approved"
  | "rejected"
  | "scheduled"
  | "no_show"
  | "excused";

const variantStyles: Record<StatusVariant, string> = {
  open: "bg-emerald-100 text-emerald-800 border-emerald-200",
  filled: "bg-blue-100 text-blue-800 border-blue-200",
  cancelled: "bg-gray-100 text-gray-600 border-gray-200",
  completed: "bg-purple-100 text-purple-800 border-purple-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  scheduled: "bg-blue-100 text-blue-800 border-blue-200",
  no_show: "bg-red-100 text-red-800 border-red-200",
  excused: "bg-gray-100 text-gray-600 border-gray-200",
};

const variantLabels: Record<StatusVariant, string> = {
  open: "Open",
  filled: "Filled",
  cancelled: "Cancelled",
  completed: "Completed",
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  scheduled: "Scheduled",
  no_show: "No Show",
  excused: "Excused",
};

interface StatusBadgeProps {
  status: StatusVariant;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(variantStyles[status], "font-medium", className)}
    >
      {variantLabels[status]}
    </Badge>
  );
}
