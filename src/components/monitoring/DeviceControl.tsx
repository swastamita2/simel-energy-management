import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Wind, Monitor, Wifi, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface DeviceControlProps {
  name: string;
  type: "light" | "ac" | "projector" | "other";
  room: string;
  status: "on" | "off" | "offline";
  power: number;
  onToggle?: (enabled: boolean) => void;
  onPowerChange?: (value: number) => void;
}

export const DeviceControl = ({
  name,
  type,
  room,
  status,
  power,
  onToggle,
  onPowerChange
}: DeviceControlProps) => {
  const [localPower, setLocalPower] = useState(power);
  const [isOn, setIsOn] = useState(status === "on");

  useEffect(() => {
    setLocalPower(power);
    setIsOn(status === "on");
  }, [power, status]);

  const icons = {
    light: Lightbulb,
    ac: Wind,
    projector: Monitor,
    other: Wifi,
  };

  const Icon = icons[type];

  const statusColors = {
    on: "bg-success/10 text-success border-success/20",
    off: "bg-muted text-muted-foreground border-border",
    offline: "bg-alert/10 text-alert border-alert/20",
  };

  const handlePowerChange = (value: number[]) => {
    const newPower = value[0];
    setLocalPower(newPower);
    onPowerChange?.(newPower);
  };

  const handleToggle = (checked: boolean) => {
    if (status === "offline") return;
    setIsOn(checked);
    onToggle?.(checked);
  };

  const getMaxPower = () => {
    switch (type) {
      case 'ac': return 1500;
      case 'projector': return 500;
      case 'light': return 300;
      default: return 1000;
    }
  };

  return (
    <Card className={cn(
      "p-4 sm:p-5 transition-all duration-300",
      status === "on" && "border-primary/30 shadow-sm hover:shadow-md",
      status === "offline" && "opacity-70"
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className={cn(
            "p-2 rounded-lg shrink-0",
            status === "on" ? "bg-primary/10" : "bg-muted"
          )}>
            <Icon className={cn(
              "h-4 w-4 sm:h-5 sm:w-5",
              status === "on" ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-foreground text-sm sm:text-base truncate">{name}</h4>
            <p className="text-xs text-muted-foreground truncate">{room}</p>
          </div>
        </div>
        <Badge className={cn("border text-xs shrink-0", statusColors[status])}>
          {status.toUpperCase()}
        </Badge>
      </div>

      {/* Offline Warning */}
      {status === "offline" && (
        <div className="flex items-center gap-2 p-2 mb-3 rounded-lg bg-alert/10 border border-alert/20">
          <AlertCircle className="h-4 w-4 text-alert shrink-0" />
          <span className="text-xs text-alert">Device not responding</span>
        </div>
      )}

      {/* Power Display & Control */}
      {status !== "offline" && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-muted-foreground">Power Usage</span>
            <span className="text-xs sm:text-sm font-semibold text-foreground">{localPower}W</span>
          </div>
          <Slider
            value={[localPower]}
            onValueChange={handlePowerChange}
            max={getMaxPower()}
            step={10}
            disabled={status !== "on"}
            className="w-full"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">0W</span>
            <span className="text-xs text-muted-foreground">{getMaxPower()}W</span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-xs sm:text-sm font-medium text-foreground">
          {status === "offline" ? "Device Offline" : "Power Control"}
        </span>
        <Switch
          checked={isOn}
          onCheckedChange={handleToggle}
          disabled={status === "offline"}
        />
      </div>
    </Card>
  );
};
