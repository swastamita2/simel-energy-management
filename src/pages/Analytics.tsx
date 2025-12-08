import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { EnergyChart } from "@/components/dashboard/EnergyChart";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Download, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { useEnergy } from "@/contexts/EnergyContext";

const Analytics = () => {
  const { stats, realtimeData, weeklyData } = useEnergy();
  const [date, setDate] = useState<Date>();

  const handleExportReport = () => {
    // Create CSV content
    const csvContent = [
      ['Energy Analytics Report'],
      [`Generated: ${new Date().toLocaleString()}`],
      [''],
      ['Weekly Data'],
      ['Day', 'Consumption (kWh)', 'Efficiency (%)'],
      ...weeklyData.map(d => [d.time, d.consumption, d.efficiency]),
      [''],
      ['Real-time Data'],
      ['Time', 'Consumption (kWh)', 'Efficiency (%)'],
      ...realtimeData.map(d => [d.time, d.consumption, d.efficiency]),
      [''],
      ['Key Insights'],
      ['Metric', 'Value'],
      ...insights.map(i => [i.title, i.value]),
      [''],
      ['Current Statistics'],
      ['Total Consumption', `${stats.totalConsumption} kWh`],
      ['System Efficiency', `${stats.efficiency}%`],
      ['Active Devices', `${stats.activeDevices}/${stats.totalDevices}`],
      ['Cost Savings', `Rp ${stats.costSavings}M`],
    ].map(row => row.join(',')).join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `energy-analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Report exported successfully!');
  };

  const insights = [
    {
      title: "Total Consumption",
      value: `${stats.totalConsumption.toFixed(1)} kWh`,
      trend: { value: 15, isPositive: false },
      description: "Current consumption"
    },
    {
      title: "System Efficiency",
      value: `${stats.efficiency}%`,
      trend: { value: 8, isPositive: true },
      description: "Overall efficiency"
    },
    {
      title: "Cost Savings",
      value: `Rp ${stats.costSavings}M`,
      trend: { value: 3, isPositive: true },
      description: "Today's savings"
    },
    {
      title: "Carbon Reduction",
      value: `${stats.carbonReduction} kg`,
      trend: { value: 12, isPositive: true },
      description: "CO₂ reduced today"
    },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analytics & Insights</h1>
              <p className="text-muted-foreground mt-1">
                Detailed consumption analysis and trends
              </p>
            </div>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <Button variant="default" size="sm" onClick={handleExportReport}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Key Insights */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {insights.map((insight) => (
              <Card key={insight.title} className="p-5">
                <p className="text-sm text-muted-foreground mb-2">{insight.title}</p>
                <h3 className="text-2xl font-bold text-foreground mb-2">{insight.value}</h3>
                <div className="flex items-center gap-2">
                  {insight.trend.isPositive ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-alert" />
                  )}
                  <span className={cn(
                    "text-sm font-medium",
                    insight.trend.isPositive ? "text-success" : "text-alert"
                  )}>
                    {insight.trend.value}%
                  </span>
                  <span className="text-xs text-muted-foreground">{insight.description}</span>
                </div>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid gap-6 mb-6">
            <EnergyChart
              title="Weekly Consumption Trends"
              data={weeklyData}
              type="area"
            />
            <EnergyChart
              title="Real-time Consumption & Efficiency"
              data={realtimeData}
              type="line"
            />
          </div>

          {/* Building Comparison */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Building Comparison</h3>
            <div className="space-y-4">
              {[
                { name: "Gedung A", consumption: 8200, efficiency: 92, color: "bg-success" },
                { name: "Gedung B", consumption: 9800, efficiency: 88, color: "bg-primary" },
                { name: "Gedung C", consumption: 12400, efficiency: 85, color: "bg-secondary" },
                { name: "Gedung D", consumption: 7600, efficiency: 90, color: "bg-success" },
              ].map((building) => (
                <div key={building.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{building.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">{building.consumption} kWh</span>
                      <span className="text-muted-foreground">{building.efficiency}% efficient</span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", building.color)}
                      style={{ width: `${building.efficiency}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Analytics;
