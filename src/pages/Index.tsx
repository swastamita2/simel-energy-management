import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { KPICard } from "@/components/dashboard/KPICard";
import { EnergyChart } from "@/components/dashboard/EnergyChart";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, TrendingDown, DollarSign, Gauge, RefreshCw, Download, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useEnergy } from "@/contexts/EnergyContext";
import { Button } from "@/components/ui/button";

const Index = () => {
  const {
    stats,
    realtimeData,
    weeklyData,
    rooms,
    refreshData,
    isRefreshing,
    lastUpdate
  } = useEnergy();

  const handleExport = () => {
    toast.success("Exporting dashboard data...");
    setTimeout(() => {
      toast.success("Dashboard report exported successfully");
    }, 1500);
  };

  const activeDevicesPercentage = Math.round((stats.activeDevices / stats.totalDevices) * 100);
  const pendingAlerts = stats.alerts.filter(a => a.type !== 'resolved').length;
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Page Title & Actions */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Energy Management Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Real-time monitoring and analytics for ITPLN campus facilities
              </p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Last updated: {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refreshData()}
                disabled={isRefreshing}
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <KPICard
              title="Real-time Consumption"
              value={stats.totalConsumption.toFixed(1)}
              unit="kWh"
              icon={Zap}
              trend={{ value: 12.5, isPositive: false }}
              variant="default"
            />
            <KPICard
              title="Efficiency Rate"
              value={stats.efficiency.toString()}
              unit="%"
              icon={Gauge}
              trend={{ value: 5.2, isPositive: true }}
              variant="success"
            />
            <KPICard
              title="Cost Savings Today"
              value={`Rp ${stats.costSavings}M`}
              icon={DollarSign}
              trend={{ value: 8.3, isPositive: true }}
              variant="success"
            />
            <KPICard
              title="Carbon Reduction"
              value={stats.carbonReduction.toString()}
              unit="kg CO₂"
              icon={TrendingDown}
              trend={{ value: 15.1, isPositive: true }}
              variant="success"
            />
          </div>

          {/* Charts */}
          <div className="grid gap-4 md:gap-6 lg:grid-cols-2 mb-6">
            <EnergyChart
              title="Real-time Consumption & Efficiency"
              data={realtimeData}
              type="area"
            />
            <EnergyChart
              title="Weekly Consumption Trend"
              data={weeklyData}
              type="line"
            />
          </div>

          {/* Status Overview & Alerts */}
          <div className="grid gap-4 md:gap-6 lg:grid-cols-3 mb-6">
            <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-success">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Active Devices</h3>
                <div className="h-3 w-3 rounded-full bg-success animate-pulse" />
              </div>
              <p className="text-4xl font-bold text-foreground mb-3">{stats.activeDevices}/{stats.totalDevices}</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{activeDevicesPercentage}% operational</span>
                  <span className="font-semibold text-success">{stats.activeDevices} active</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-success to-success/80 transition-all duration-500 rounded-full" 
                    style={{ width: `${activeDevicesPercentage}%` }}
                  />
                </div>
              </div>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-primary">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Monitored Rooms</h3>
                <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
              </div>
              <p className="text-4xl font-bold text-foreground mb-3">{rooms.length}</p>
              <p className="text-sm text-muted-foreground mb-3">
                Across {[...new Set(rooms.map(r => r.building.split(' - ')[0]))].length} buildings
              </p>
              <div className="flex flex-wrap gap-2">
                {[...new Set(rooms.map(r => r.building.split(' - ')[0]))].map((building) => {
                  const count = rooms.filter(r => r.building.startsWith(building)).length;
                  return (
                    <Badge key={building} variant="secondary" className="text-xs font-medium px-3 py-1">
                      {building}: {count}
                    </Badge>
                  );
                })}
              </div>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-warning">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Alerts Today</h3>
                <Badge 
                  variant={pendingAlerts > 0 ? "destructive" : "secondary"}
                  className="h-7 w-7 rounded-full flex items-center justify-center p-0 font-bold"
                >
                  {pendingAlerts}
                </Badge>
              </div>
              <p className="text-4xl font-bold text-foreground mb-3">{stats.alerts.length}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Resolved</span>
                  <span className="font-semibold text-success">
                    {stats.alerts.filter(a => a.type === 'resolved').length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pending</span>
                  <span className={cn("font-semibold", pendingAlerts > 0 ? "text-destructive" : "text-muted-foreground")}>
                    {pendingAlerts}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
