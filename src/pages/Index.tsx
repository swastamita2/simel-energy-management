import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { KPICard } from "@/components/dashboard/KPICard";
import { EnergyChart } from "@/components/dashboard/EnergyChart";
import { Zap, TrendingDown, DollarSign, Gauge } from "lucide-react";

// Mock data for charts
const realtimeData = [
  { time: "00:00", consumption: 245, efficiency: 92 },
  { time: "04:00", consumption: 189, efficiency: 95 },
  { time: "08:00", consumption: 312, efficiency: 88 },
  { time: "12:00", consumption: 398, efficiency: 85 },
  { time: "16:00", consumption: 425, efficiency: 82 },
  { time: "20:00", consumption: 367, efficiency: 87 },
];

const weeklyData = [
  { time: "Mon", consumption: 2840 },
  { time: "Tue", consumption: 2920 },
  { time: "Wed", consumption: 2650 },
  { time: "Thu", consumption: 2890 },
  { time: "Fri", consumption: 3120 },
  { time: "Sat", consumption: 1850 },
  { time: "Sun", consumption: 1640 },
];

const Index = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Energy Management Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Real-time monitoring and analytics for ITPLN campus facilities
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <KPICard
              title="Real-time Consumption"
              value="367"
              unit="kW"
              icon={Zap}
              trend={{ value: 12.5, isPositive: false }}
              variant="default"
            />
            <KPICard
              title="Efficiency Rate"
              value="87"
              unit="%"
              icon={Gauge}
              trend={{ value: 5.2, isPositive: true }}
              variant="success"
            />
            <KPICard
              title="Cost Savings Today"
              value="Rp 2.4M"
              icon={DollarSign}
              trend={{ value: 8.3, isPositive: true }}
              variant="success"
            />
            <KPICard
              title="Carbon Reduction"
              value="124"
              unit="kg CO₂"
              icon={TrendingDown}
              trend={{ value: 15.1, isPositive: true }}
              variant="success"
            />
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2 mb-6">
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

          {/* Status Overview */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Active Devices</h3>
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              </div>
              <p className="text-2xl font-bold text-foreground">248/280</p>
              <p className="text-sm text-muted-foreground mt-1">88.6% operational</p>
            </div>
            
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Monitored Rooms</h3>
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              </div>
              <p className="text-2xl font-bold text-foreground">42</p>
              <p className="text-sm text-muted-foreground mt-1">Across 5 buildings</p>
            </div>
            
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Alerts Today</h3>
                <div className="h-2 w-2 rounded-full bg-warning animate-pulse" />
              </div>
              <p className="text-2xl font-bold text-foreground">3</p>
              <p className="text-sm text-muted-foreground mt-1">2 resolved, 1 pending</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
