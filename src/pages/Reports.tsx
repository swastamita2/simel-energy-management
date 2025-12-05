import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, FileText, Download, Eye, Trash2, CheckCircle, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const savedReports = [
  { id: 1, name: "Monthly Energy Report - October 2024", type: "Monthly", date: "2024-10-31", size: "2.4 MB", status: "approved", createdBy: "Admin ITPLN" },
  { id: 2, name: "Building A Consumption Analysis", type: "Custom", date: "2024-10-28", size: "1.8 MB", status: "pending", createdBy: "Admin ITPLN" },
  { id: 3, name: "Quarterly Efficiency Report Q3 2024", type: "Quarterly", date: "2024-09-30", size: "3.2 MB", status: "approved", createdBy: "Admin ITPLN" },
  { id: 4, name: "Daily Usage Report - October 2024", type: "Daily", date: "2024-10-25", size: "856 KB", status: "pending", createdBy: "Admin ITPLN" },
];

const Reports = () => {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [reportType, setReportType] = useState("");
  const [reportName, setReportName] = useState("");
  const [exportFormat, setExportFormat] = useState("pdf");
  const [selectedBuildings, setSelectedBuildings] = useState<string[]>([]);
  const [reports, setReports] = useState(savedReports);

  // Check if user can create reports (Admin only)
  const canCreateReports = user?.role === 'admin';
  // Check if user can approve reports (Manajer only)
  const canApproveReports = user?.role === 'manajer';

  const buildings = ["Gedung A", "Gedung B", "Gedung C", "Gedung D"];

  const handleBuildingToggle = (building: string) => {
    setSelectedBuildings(prev =>
      prev.includes(building)
        ? prev.filter(b => b !== building)
        : [...prev, building]
    );
  };

  const handleGenerateReport = () => {
    if (!startDate || !endDate || !reportType) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newReport = {
      id: reports.length + 1,
      name: reportName || `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report - ${format(new Date(), 'MMMM yyyy')}`,
      type: reportType.charAt(0).toUpperCase() + reportType.slice(1),
      date: format(new Date(), 'yyyy-MM-dd'),
      size: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`,
      status: 'pending',
      createdBy: user?.name || 'Admin',
    };

    setReports(prev => [newReport, ...prev]);
    toast.success("Report generated successfully!");
    
    // Reset form
    setReportType("");
    setReportName("");
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedBuildings([]);
  };

  const handleQuickTemplate = (template: string) => {
    const today = new Date();
    let start: Date;
    let end: Date = today;
    let type: string;

    switch (template) {
      case 'today':
        start = today;
        type = 'daily';
        break;
      case 'week':
        start = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        type = 'weekly';
        break;
      case 'month':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        type = 'monthly';
        break;
      case 'quarter':
        start = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        type = 'quarterly';
        break;
      default:
        return;
    }

    setStartDate(start);
    setEndDate(end);
    setReportType(type);
    toast.info(`Template applied: ${template}`);
  };

  const handleViewReport = (reportId: number) => {
    toast.info("Opening report preview...");
  };

  const handleDownloadReport = (reportId: number) => {
    const report = reports.find(r => r.id === reportId);
    toast.success(`Downloading ${report?.name}...`);
  };

  const handleDeleteReport = (reportId: number) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
    toast.success("Report deleted successfully");
  };

  const handleApproveReport = (reportId: number) => {
    setReports(prev => prev.map(r => 
      r.id === reportId ? { ...r, status: 'approved' } : r
    ));
    toast.success("Report approved successfully");
  };

  const handleRejectReport = (reportId: number) => {
    setReports(prev => prev.map(r => 
      r.id === reportId ? { ...r, status: 'rejected' } : r
    ));
    toast.error("Report rejected");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">
              {canCreateReports ? 'Report Generator' : 'Review Reports'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {canCreateReports 
                ? 'Generate comprehensive energy consumption reports' 
                : 'Review and approve energy consumption reports'}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Report Generator Form - Admin Only */}
            {canCreateReports && (
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-6">Generate New Report</h2>
                
                <div className="space-y-6">
                  {/* Report Type */}
                  <div className="space-y-2">
                    <Label htmlFor="report-type">Report Type *</Label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger id="report-type">
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily Report</SelectItem>
                        <SelectItem value="weekly">Weekly Report</SelectItem>
                        <SelectItem value="monthly">Monthly Report</SelectItem>
                        <SelectItem value="quarterly">Quarterly Report</SelectItem>
                        <SelectItem value="annual">Annual Report</SelectItem>
                        <SelectItem value="custom">Custom Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Range */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Start Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : "Pick start date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>End Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : "Pick end date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Buildings Selection */}
                  <div className="space-y-3">
                    <Label>Select Buildings</Label>
                    <div className="grid gap-3 md:grid-cols-2">
                      {buildings.map((building) => (
                        <div key={building} className="flex items-center space-x-2">
                          <Checkbox
                            id={building}
                            checked={selectedBuildings.includes(building)}
                            onCheckedChange={() => handleBuildingToggle(building)}
                          />
                          <label
                            htmlFor={building}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {building}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Report Name */}
                  <div className="space-y-2">
                    <Label htmlFor="report-name">Report Name (Optional)</Label>
                    <Input
                      id="report-name"
                      placeholder="e.g., Monthly Energy Analysis"
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                    />
                  </div>

                  {/* Export Format */}
                  <div className="space-y-2">
                    <Label htmlFor="export-format">Export Format</Label>
                    <Select value={exportFormat} onValueChange={setExportFormat}>
                      <SelectTrigger id="export-format">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                        <SelectItem value="csv">CSV File</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Generate Button */}
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleGenerateReport}
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    Generate Report
                  </Button>
                </div>
              </Card>
            </div>
            )}

            {/* Report Templates - Admin Only */}
            {canCreateReports && (
            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Quick Templates</h3>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    size="sm"
                    onClick={() => handleQuickTemplate('today')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Today's Summary
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    size="sm"
                    onClick={() => handleQuickTemplate('week')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    This Week
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    size="sm"
                    onClick={() => handleQuickTemplate('month')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    This Month
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    size="sm"
                    onClick={() => handleQuickTemplate('quarter')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Last Quarter
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-2">Report Info</h3>
                <p className="text-sm text-muted-foreground">
                  Reports include consumption data, efficiency metrics, cost analysis, and carbon footprint calculations.
                </p>
              </Card>
            </div>
            )}
          </div>

          {/* Saved Reports */}
          <div className="mt-8">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">
                {canApproveReports ? 'Reports Awaiting Approval' : 'Recent Reports'}
              </h2>
              <div className="space-y-3">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors gap-3"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground truncate">{report.name}</h4>
                          <Badge 
                            variant={report.status === 'approved' ? 'default' : report.status === 'rejected' ? 'destructive' : 'secondary'}
                            className="shrink-0"
                          >
                            {report.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {report.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                            {report.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {report.type} • {report.date} • {report.size} • By {report.createdBy}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewReport(report.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownloadReport(report.id)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Download</span>
                      </Button>
                      
                      {/* Manajer: Approve/Reject buttons for pending reports */}
                      {canApproveReports && report.status === 'pending' && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleApproveReport(report.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Approve</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRejectReport(report.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Reject</span>
                          </Button>
                        </>
                      )}
                      
                      {/* Admin: Delete button */}
                      {canCreateReports && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteReport(report.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;
