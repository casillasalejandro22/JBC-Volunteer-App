import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  description?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
}

export function StatCard({
  label,
  value,
  description,
  trend,
  icon,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {icon && (
            <div className="text-muted-foreground">{icon}</div>
          )}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-3xl font-bold">{value}</p>
          {trend && (
            <span
              className={cn(
                "flex items-center text-xs font-medium",
                trend === "up" && "text-emerald-600",
                trend === "down" && "text-red-600",
                trend === "neutral" && "text-muted-foreground"
              )}
            >
              {trend === "up" && <TrendingUp className="mr-0.5 h-3 w-3" />}
              {trend === "down" && <TrendingDown className="mr-0.5 h-3 w-3" />}
              {trend === "neutral" && <Minus className="mr-0.5 h-3 w-3" />}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
