import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GaugeChartProps {
  title: string;
  value: number;
  max: number;
  unit: string;
  status?: "normal" | "warning" | "alert";
}

export const GaugeChart = ({ 
  title, 
  value, 
  max, 
  unit,
  status = "normal" 
}: GaugeChartProps) => {
  // Pastikan percentage tidak lebih dari 100
  const percentage = Math.min((value / max) * 100, 100);
  
  const getColor = () => {
    if (status === "alert" || percentage > 90) return "text-alert";
    if (status === "warning" || percentage > 75) return "text-warning";
    return "text-success";
  };

  const getStrokeColor = () => {
    if (status === "alert" || percentage > 90) return "hsl(var(--alert))";
    if (status === "warning" || percentage > 75) return "hsl(var(--warning))";
    return "hsl(var(--success))";
  };

  // SVG arc calculation
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="p-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">{title}</h3>
      
      <div className="relative flex items-center justify-center">
        {/* SVG Gauge */}
        <svg width="200" height="200" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={getStrokeColor()}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500"
          />
        </svg>
        
        {/* Center Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-4xl font-bold", getColor())}>
            {value}
          </span>
          <span className="text-sm text-muted-foreground mt-1">{unit}</span>
          <span className="text-xs text-muted-foreground mt-1">
            of {max} {unit}
          </span>
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <div className={cn("h-2 w-2 rounded-full", 
          status === "alert" ? "bg-alert" : 
          status === "warning" ? "bg-warning" : "bg-success"
        )} />
        <span className={cn("text-sm font-medium",
          status === "alert" ? "text-alert" : 
          status === "warning" ? "text-warning" : "text-success"
        )}>
          {percentage.toFixed(1)}% Usage
        </span>
      </div>
    </Card>
  );
};
