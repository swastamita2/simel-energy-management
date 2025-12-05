import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "alert";
}

export const KPICard = ({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  trend,
  variant = "default" 
}: KPICardProps) => {
  const variantStyles = {
    default: "border-l-primary",
    success: "border-l-success",
    warning: "border-l-warning",
    alert: "border-l-alert",
  };

  const iconVariants = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    alert: "bg-alert/10 text-alert",
  };

  return (
    <Card className={cn(
      "p-6 border-l-4 hover:shadow-md transition-all duration-300",
      variantStyles[variant]
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-foreground">
              {value}
            </h3>
            {unit && (
              <span className="text-sm font-medium text-muted-foreground">
                {unit}
              </span>
            )}
          </div>
          {trend && (
            <div className={cn(
              "text-sm font-medium mt-2 flex items-center gap-1",
              trend.isPositive ? "text-success" : "text-alert"
            )}>
              <span>{trend.isPositive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground text-xs">vs last period</span>
            </div>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-xl",
          iconVariants[variant]
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
};
