import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Wind, Thermometer, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface RoomCardProps {
  name: string;
  building: string;
  consumption: number;
  temperature: number;
  devicesOn: number;
  totalDevices: number;
  status: "normal" | "warning" | "alert";
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
}

export const RoomCard = ({
  name,
  building,
  consumption,
  temperature,
  devicesOn,
  totalDevices,
  status,
  enabled = true,
  onToggle
}: RoomCardProps) => {
  const [isEnabled, setIsEnabled] = useState(enabled);

  useEffect(() => {
    setIsEnabled(devicesOn > 0);
  }, [devicesOn]);

  const statusColors = {
    normal: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    alert: "bg-alert/10 text-alert border-alert/20",
  };

  const statusLabels = {
    normal: "Normal",
    warning: "High Usage",
    alert: "Critical",
  };

  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked);
    onToggle?.(checked);
  };

  return (
    <Card className="p-4 sm:p-5 hover:shadow-lg transition-all duration-300 hover:border-primary/50">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-foreground text-base sm:text-lg truncate">{name}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">{building}</p>
        </div>
        <Badge className={cn("border shrink-0 text-xs", statusColors[status])}>
          {statusLabels[status]}
        </Badge>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-muted/50">
          <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Power</p>
            <p className="font-bold text-foreground text-sm sm:text-base truncate">{consumption} kW</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-muted/50">
          <Thermometer className="h-4 w-4 sm:h-5 sm:w-5 text-secondary shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Temp</p>
            <p className="font-bold text-foreground text-sm sm:text-base truncate">{temperature}°C</p>
          </div>
        </div>
      </div>

      {/* Devices Status */}
      <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/30 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <Lightbulb className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-xs sm:text-sm text-muted-foreground truncate">
            Devices: <span className="font-semibold text-foreground">{devicesOn}/{totalDevices}</span> active
          </span>
        </div>
        <Wind className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>

      {/* Quick Control */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-xs sm:text-sm font-medium text-foreground">Master Control</span>
        <Switch
          checked={isEnabled}
          onCheckedChange={handleToggle}
        />
      </div>
    </Card>
  );
};
