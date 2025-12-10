import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Eye, CheckCircle, Calendar as CalendarIcon, TrendingUp, Filter } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

// Mock data - Laporan yang sudah diapprove
const approvedReports = [
  { 
    id: 1, 
    name: "Monthly Energy Report - November 2024", 
    type: "Monthly", 
    date: "2024-11-30", 
    size: "2.4 MB", 
    status: "approved", 
    createdBy: "Admin ITPLN",
    approvedBy: "Manajer Energi",
    approvedDate: "2024-12-01",
    summary: "Total konsumsi: 12,450 kWh. Efisiensi meningkat 8% dibanding bulan lalu.",
  },
  { 
    id: 3, 
    name: "Quarterly Efficiency Report Q4 2024", 
    type: "Quarterly", 
    date: "2024-12-09", 
    size: "3.2 MB", 
    status: "approved", 
    createdBy: "Admin ITPLN",
    approvedBy: "Manajer Energi",
    approvedDate: "2024-12-10",
    summary: "Penghematan energi mencapai 15% di Q4. Target tahunan tercapai 102%.",
  },
  { 
    id: 5, 
    name: "Weekly Building Analysis - Week 49", 
    type: "Weekly", 
    date: "2024-12-08", 
    size: "1.5 MB", 
    status: "approved", 
    createdBy: "Admin ITPLN",
    approvedBy: "Manajer Energi",
    approvedDate: "2024-12-09",
    summary: "Gedung A: 3,200 kWh, Gedung B: 2,800 kWh. Anomali terdeteksi di Gedung C.",
  },
  { 
    id: 7, 
    name: "Annual Energy Report 2024", 
    type: "Annual", 
    date: "2024-12-05", 
    size: "5.8 MB", 
    status: "approved", 
    createdBy: "Admin ITPLN",
    approvedBy: "Manajer Energi",
    approvedDate: "2024-12-06",
    summary: "Total konsumsi tahunan: 145,600 kWh. Carbon reduction: 62 ton CO2.",
  },
  { 
    id: 9, 
    name: "Building A Consumption Analysis", 
    type: "Custom", 
    date: "2024-12-03", 
    size: "1.8 MB", 
    status: "approved", 
    createdBy: "Admin ITPLN",
    approvedBy: "Manajer Energi",
    approvedDate: "2024-12-04",
    summary: "Lab Komputer: 45% dari total. Rekomendasi: upgrade AC ke inverter.",
  },
];

const MonitoringLaporan = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [reports] = useState(approvedReports);

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.createdBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || report.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const handleDownload = (reportId: number, reportName: string) => {
    toast.success(`Downloading ${reportName}...`);
    // Simulate download
    setTimeout(() => {
      toast.success("Download completed!");
    }, 1500);
  };

  const handleView = (reportId: number, reportName: string) => {
    toast.info(`Opening ${reportName}...`);
  };

  // Calculate statistics
  const totalReports = reports.length;
  const thisMonth = reports.filter(r => {
    const reportDate = new Date(r.date);
    const now = new Date();
    return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Monitoring Laporan</h1>
            <p className="text-muted-foreground mt-1">
              Laporan energi yang telah disetujui oleh Manajer
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Laporan</p>
                  <p className="text-2xl font-bold">{totalReports}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Laporan Bulan Ini</p>
                  <p className="text-2xl font-bold">{thisMonth}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-lg font-semibold text-green-600">All Approved</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari laporan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Tipe Laporan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Reports List */}
          <Card className="overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Laporan yang Disetujui</h2>
              
              {filteredReports.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Tidak ada laporan ditemukan</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <Card key={report.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <FileText className="h-8 w-8 text-primary" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-semibold text-lg text-foreground truncate">
                              {report.name}
                            </h3>
                            <Badge variant="default" className="flex-shrink-0">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approved
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4" />
                              <span>Dibuat: {format(new Date(report.date), 'dd MMM yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span>Disetujui: {format(new Date(report.approvedDate), 'dd MMM yyyy')}</span>
                            </div>
                            <div>
                              <span className="font-medium">Pembuat:</span> {report.createdBy}
                            </div>
                            <div>
                              <span className="font-medium">Disetujui oleh:</span> {report.approvedBy}
                            </div>
                          </div>

                          {/* Summary */}
                          <div className="bg-muted/50 rounded-lg p-3 mb-3">
                            <p className="text-sm">
                              <span className="font-semibold">Ringkasan:</span> {report.summary}
                            </p>
                          </div>

                          {/* Meta Info */}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <Badge variant="outline">{report.type}</Badge>
                            <span>{report.size}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex sm:flex-col gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(report.id, report.name)}
                            className="flex-1 sm:flex-none"
                          >
                            <Eye className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleDownload(report.id, report.name)}
                            className="flex-1 sm:flex-none"
                          >
                            <Download className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Download</span>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default MonitoringLaporan;
