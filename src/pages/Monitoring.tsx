import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { RoomCard } from "@/components/monitoring/RoomCard";
import { DeviceControl } from "@/components/monitoring/DeviceControl";
import { GaugeChart } from "@/components/monitoring/GaugeChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Room {
  id: number;
  name: string;
  building: string;
  consumption: number;
  temperature: number;
  devicesOn: number;
  totalDevices: number;
  status: "normal" | "warning" | "alert";
  enabled: boolean;
}

interface Device {
  id: number;
  name: string;
  type: "light" | "ac" | "projector" | "other";
  room: string;
  status: "on" | "off" | "offline";
  power: number;
}

const initialRooms: Room[] = [
  { id: 1, name: "Lab Komputer 1", building: "Gedung A - Lt. 2", consumption: 4.2, temperature: 24, devicesOn: 18, totalDevices: 20, status: "normal", enabled: true },
  { id: 2, name: "Ruang Kuliah 201", building: "Gedung A - Lt. 2", consumption: 3.8, temperature: 26, devicesOn: 12, totalDevices: 15, status: "normal", enabled: true },
  { id: 3, name: "Lab Elektronika", building: "Gedung B - Lt. 1", consumption: 8.5, temperature: 28, devicesOn: 24, totalDevices: 25, status: "warning", enabled: true },
  { id: 4, name: "Auditorium", building: "Gedung C", consumption: 12.4, temperature: 23, devicesOn: 32, totalDevices: 35, status: "alert", enabled: true },
  { id: 5, name: "Perpustakaan", building: "Gedung D - Lt. 1", consumption: 5.6, temperature: 25, devicesOn: 28, totalDevices: 30, status: "normal", enabled: true },
  { id: 6, name: "Kantor Dosen", building: "Gedung A - Lt. 3", consumption: 2.1, temperature: 26, devicesOn: 8, totalDevices: 12, status: "normal", enabled: true },
];

const initialDevices: Device[] = [
  { id: 1, name: "LED Panel 1", type: "light", room: "Lab Komputer 1", status: "on", power: 120 },
  { id: 2, name: "AC Unit 1", type: "ac", room: "Lab Komputer 1", status: "on", power: 850 },
  { id: 3, name: "Projector", type: "projector", room: "Ruang Kuliah 201", status: "on", power: 280 },
  { id: 4, name: "LED Panel 2", type: "light", room: "Ruang Kuliah 201", status: "off", power: 0 },
  { id: 5, name: "AC Unit 2", type: "ac", room: "Lab Elektronika", status: "on", power: 920 },
  { id: 6, name: "Exhaust Fan", type: "other", room: "Lab Elektronika", status: "offline", power: 0 },
  { id: 7, name: "LED Panel 3", type: "light", room: "Auditorium", status: "on", power: 200 },
  { id: 8, name: "Sound System", type: "other", room: "Auditorium", status: "on", power: 450 },
];

const Monitoring = () => {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [roomSearchQuery, setRoomSearchQuery] = useState("");
  const [deviceSearchQuery, setDeviceSearchQuery] = useState("");
  const [buildingFilter, setBuildingFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculate total consumption
  const totalConsumption = rooms.reduce((sum, room) => sum + (room.enabled ? room.consumption : 0), 0);
  const peakLoad = Math.max(...rooms.map(r => r.consumption));
  const activeDevices = devices.filter(d => d.status === "on").length;
  const efficiency = Math.round((activeDevices / devices.length) * 100);

  // Handle room master control
  const handleRoomToggle = (roomId: number, enabled: boolean) => {
    setRooms(prevRooms =>
      prevRooms.map(room =>
        room.id === roomId
          ? {
              ...room,
              enabled,
              devicesOn: enabled ? room.totalDevices : 0,
              consumption: enabled ? room.consumption : 0
            }
          : room
      )
    );

    const room = rooms.find(r => r.id === roomId);
    toast.success(`${room?.name} ${enabled ? 'enabled' : 'disabled'}`, {
      description: enabled ? 'All devices turned on' : 'All devices turned off'
    });

    // Update devices in this room
    if (room) {
      setDevices(prevDevices =>
        prevDevices.map(device =>
          device.room === room.name
            ? { ...device, status: enabled ? "on" : "off", power: enabled ? (device.type === 'ac' ? 850 : device.type === 'light' ? 120 : 280) : 0 }
            : device
        )
      );
    }
  };

  // Handle device toggle
  const handleDeviceToggle = (deviceId: number, enabled: boolean) => {
    setDevices(prevDevices =>
      prevDevices.map(device =>
        device.id === deviceId
          ? {
              ...device,
              status: device.status === "offline" ? "offline" : (enabled ? "on" : "off"),
              power: enabled ? (device.type === 'ac' ? 850 : device.type === 'light' ? 120 : 280) : 0
            }
          : device
      )
    );

    const device = devices.find(d => d.id === deviceId);
    if (device?.status !== "offline") {
      toast.success(`${device?.name} turned ${enabled ? 'on' : 'off'}`);
      
      // Update room consumption
      const roomName = device?.room;
      if (roomName) {
        setRooms(prevRooms =>
          prevRooms.map(room => {
            if (room.name === roomName) {
              const roomDevices = devices.filter(d => d.room === roomName);
              const devicesOn = roomDevices.filter(d => d.status === "on" || (d.id === deviceId && enabled)).length;
              const consumption = roomDevices.reduce((sum, d) => 
                sum + (d.status === "on" || (d.id === deviceId && enabled) ? (d.power / 1000) : 0), 0
              );
              return { ...room, devicesOn, consumption: Number(consumption.toFixed(1)) };
            }
            return room;
          })
        );
      }
    }
  };

  // Handle device power change
  const handleDevicePowerChange = (deviceId: number, power: number) => {
    setDevices(prevDevices =>
      prevDevices.map(device =>
        device.id === deviceId ? { ...device, power } : device
      )
    );

    // Update room consumption
    const device = devices.find(d => d.id === deviceId);
    if (device) {
      setRooms(prevRooms =>
        prevRooms.map(room => {
          if (room.name === device.room) {
            const roomDevices = devices.filter(d => d.room === device.room);
            const consumption = roomDevices.reduce((sum, d) => 
              sum + (d.id === deviceId ? power : d.power) / 1000, 0
            );
            return { ...room, consumption: Number(consumption.toFixed(1)) };
          }
          return room;
        })
      );
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.info("Refreshing data...");
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Data refreshed successfully");
    }, 1000);
  };

  // Handle export
  const handleExport = () => {
    const csvContent = [
      ["Room", "Building", "Consumption (kW)", "Temperature (°C)", "Devices On", "Total Devices", "Status"],
      ...rooms.map(r => [r.name, r.building, r.consumption, r.temperature, r.devicesOn, r.totalDevices, r.status])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `monitoring-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success("Report exported successfully");
  };

  // Get unique buildings for filter
  const buildings = Array.from(new Set(rooms.map(r => r.building)));

  // Filter rooms based on search query and filters
  const filteredRooms = rooms.filter((room) => {
    const query = roomSearchQuery.toLowerCase();
    const matchesSearch = room.name.toLowerCase().includes(query) || room.building.toLowerCase().includes(query);
    const matchesBuilding = buildingFilter === "all" || room.building === buildingFilter;
    const matchesStatus = statusFilter === "all" || room.status === statusFilter;
    return matchesSearch && matchesBuilding && matchesStatus;
  });

  // Filter devices based on search query
  const filteredDevices = devices.filter((device) => {
    const query = deviceSearchQuery.toLowerCase();
    return (
      device.name.toLowerCase().includes(query) ||
      device.room.toLowerCase().includes(query) ||
      device.type.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Real-time Monitoring</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Monitor and control all devices across campus facilities
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>

          {/* Usage Gauges */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            <GaugeChart
              title="Total Campus Consumption"
              value={Number(totalConsumption.toFixed(1))}
              max={50}
              unit="kW"
              status={totalConsumption > 40 ? "alert" : totalConsumption > 30 ? "warning" : "normal"}
            />
            <GaugeChart
              title="Peak Load Today"
              value={Number(peakLoad.toFixed(1))}
              max={50}
              unit="kW"
              status={peakLoad > 10 ? "warning" : "normal"}
            />
            <GaugeChart
              title="Active Devices"
              value={activeDevices}
              max={devices.length}
              unit=""
              status="normal"
            />
          </div>

          {/* Tabs for Rooms and Devices */}
          <Tabs defaultValue="rooms" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="rooms">Rooms Overview</TabsTrigger>
              <TabsTrigger value="devices">Device Control</TabsTrigger>
            </TabsList>

            {/* Rooms Tab */}
            <TabsContent value="rooms" className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
                <div className="relative flex-1 w-full sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search rooms..."
                    className="pl-10"
                    value={roomSearchQuery}
                    onChange={(e) => setRoomSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Select value={buildingFilter} onValueChange={setBuildingFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="All Buildings" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Buildings</SelectItem>
                      {buildings.map(building => (
                        <SelectItem key={building} value={building}>{building}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="alert">Alert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(roomSearchQuery || buildingFilter !== "all" || statusFilter !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setRoomSearchQuery("");
                      setBuildingFilter("all");
                      setStatusFilter("all");
                    }}
                    className="w-full sm:w-auto"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              {filteredRooms.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No rooms found matching your filters</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setRoomSearchQuery("");
                      setBuildingFilter("all");
                      setStatusFilter("all");
                    }}
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredRooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      {...room}
                      onToggle={(enabled) => handleRoomToggle(room.id, enabled)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Devices Tab */}
            <TabsContent value="devices" className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
                <div className="relative flex-1 w-full sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search devices by name, room, or type..."
                    className="pl-10"
                    value={deviceSearchQuery}
                    onChange={(e) => setDeviceSearchQuery(e.target.value)}
                  />
                </div>
                {deviceSearchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeviceSearchQuery("")}
                    className="w-full sm:w-auto"
                  >
                    Clear Search
                  </Button>
                )}
              </div>

              {filteredDevices.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No devices found matching "{deviceSearchQuery}"</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeviceSearchQuery("")}
                    className="mt-4"
                  >
                    Clear Search
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4 px-1">
                    <p className="text-sm text-muted-foreground">
                      Showing {filteredDevices.length} of {devices.length} devices
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Active: <span className="font-semibold text-success">{filteredDevices.filter(d => d.status === "on").length}</span> | 
                      Off: <span className="font-semibold text-muted-foreground ml-1">{filteredDevices.filter(d => d.status === "off").length}</span> | 
                      Offline: <span className="font-semibold text-alert ml-1">{filteredDevices.filter(d => d.status === "offline").length}</span>
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredDevices.map((device) => (
                      <DeviceControl
                        key={device.id}
                        {...device}
                        onToggle={(enabled) => handleDeviceToggle(device.id, enabled)}
                        onPowerChange={(power) => handleDevicePowerChange(device.id, power)}
                      />
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Monitoring;
