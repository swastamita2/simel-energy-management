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

const monthlyData = [
  { time: "Jan", consumption: 28400, efficiency: 85 },
  { time: "Feb", consumption: 29200, efficiency: 86 },
  { time: "Mar", consumption: 26500, efficiency: 88 },
  { time: "Apr", consumption: 28900, efficiency: 87 },
  { time: "May", consumption: 31200, efficiency: 84 },
  { time: "Jun", consumption: 30800, efficiency: 85 },
  { time: "Jul", consumption: 29600, efficiency: 86 },
  { time: "Aug", consumption: 28200, efficiency: 87 },
  { time: "Sep", consumption: 27800, efficiency: 89 },
  { time: "Oct", consumption: 29100, efficiency: 88 },
];

const hourlyData = [
  { time: "00:00", consumption: 245 },
  { time: "02:00", consumption: 210 },
  { time: "04:00", consumption: 189 },
  { time: "06:00", consumption: 268 },
  { time: "08:00", consumption: 312 },
  { time: "10:00", consumption: 385 },
  { time: "12:00", consumption: 398 },
  { time: "14:00", consumption: 412 },
  { time: "16:00", consumption: 425 },
  { time: "18:00", consumption: 389 },
  { time: "20:00", consumption: 367 },
  { time: "22:00", consumption: 298 },
];

const Analytics = () => {
  const [date, setDate] = useState<Date>();

  const handleExportReport = () => {
    // Create CSV content
    const csvContent = [
      ['Energy Analytics Report'],
      [`Generated: ${new Date().toLocaleString()}`],
      [''],
      ['Monthly Data'],
      ['Month', 'Consumption (kWh)', 'Efficiency (%)'],
      ...monthlyData.map(d => [d.time, d.consumption, d.efficiency]),
      [''],
      ['Key Insights'],
      ['Metric', 'Value', 'Trend', 'Description'],
      ...insights.map(i => [i.title, i.value, `${i.trend.value}%`, i.description]),
      [''],
      ['Building Comparison'],
      ['Building', 'Consumption (kWh)', 'Efficiency (%)'],
      ['Gedung A', '8200', '92'],
      ['Gedung B', '9800', '88'],
      ['Gedung C', '12400', '85'],
      ['Gedung D', '7600', '90'],
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
      title: "Peak Usage Time",
      value: "14:00 - 16:00",
      trend: { value: 15, isPositive: false },
      description: "Highest consumption period"
    },
    {
      title: "Most Efficient Building",
      value: "Gedung A",
      trend: { value: 8, isPositive: true },
      description: "92% efficiency score"
    },
    {
      title: "Cost per kWh",
      value: "Rp 1,467",
      trend: { value: 3, isPositive: true },
      description: "Below average tariff"
    },
    {
      title: "Carbon Footprint",
      value: "3,240 kg",
      trend: { value: 12, isPositive: true },
      description: "Monthly CO₂ reduction"
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
              title="Monthly Consumption & Efficiency Trends"
              data={monthlyData}
              type="area"
            />
            <EnergyChart
              title="Hourly Consumption Pattern (Today)"
              data={hourlyData}
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
