import { useState } from 'react';
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Edit, Trash2, Zap, Upload, FileText, Sparkles } from "lucide-react";
import { useEnergy, Device } from "@/contexts/EnergyContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const DevicesManagement = () => {
  const { 
    devices, 
    rooms, 
    templates,
    addDevice, 
    updateDevice, 
    deleteDevice, 
    importDevicesFromCSV,
    applyTemplate,
  } = useEnergy();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRoom, setFilterRoom] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCSVDialogOpen, setIsCSVDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [csvData, setCSVData] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedRoomForTemplate, setSelectedRoomForTemplate] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    type: "Light",
    room: "",
    building: "",
    maxPower: "",
    status: "on" as "on" | "off",
  });

  const deviceTypes = ["AC", "Light", "Projector", "Computer", "Other"];

  const filteredDevices = devices.filter(device => {
    const matchesSearch = 
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.room.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRoom = filterRoom === "all" || device.room === filterRoom;
    const matchesType = filterType === "all" || device.type === filterType;
    return matchesSearch && matchesRoom && matchesType;
  });

  const handleAddDevice = () => {
    if (!formData.name.trim() || !formData.room.trim() || !formData.building.trim() || !formData.maxPower) {
      toast.error("Please fill in all required fields");
      return;
    }

    const maxPower = parseInt(formData.maxPower);
    if (isNaN(maxPower) || maxPower <= 0) {
      toast.error("Invalid max power value");
      return;
    }

    addDevice({
      name: formData.name,
      type: formData.type,
      room: formData.room,
      building: formData.building,
      maxPower,
      power: formData.status === 'on' ? Math.round(maxPower * 0.8) : 0,
      status: formData.status,
      temperature: formData.type === 'AC' ? 24 : undefined,
    });

    toast.success(`Device "${formData.name}" added successfully`);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditDevice = () => {
    if (!selectedDevice || !formData.name.trim() || !formData.maxPower) {
      toast.error("Please fill in all required fields");
      return;
    }

    const maxPower = parseInt(formData.maxPower);
    if (isNaN(maxPower) || maxPower <= 0) {
      toast.error("Invalid max power value");
      return;
    }

    updateDevice(selectedDevice.id, {
      name: formData.name,
      type: formData.type,
      room: formData.room,
      building: formData.building,
      maxPower,
      status: formData.status as "on" | "off",
    });

    toast.success(`Device "${formData.name}" updated successfully`);
    setIsEditDialogOpen(false);
    setSelectedDevice(null);
    resetForm();
  };

  const handleDeleteDevice = () => {
    if (!selectedDevice) return;

    deleteDevice(selectedDevice.id);
    toast.success(`Device "${selectedDevice.name}" deleted successfully`);
    setIsDeleteDialogOpen(false);
    setSelectedDevice(null);
  };

  const handleCSVImport = async () => {
    if (!csvData.trim()) {
      toast.error("Please paste CSV data");
      return;
    }

    const result = await importDevicesFromCSV(csvData);
    
    if (result.success > 0) {
      toast.success(`Successfully imported ${result.success} device(s)`);
    }
    
    if (result.errors.length > 0) {
      toast.error(`${result.errors.length} error(s) occurred`, {
        description: result.errors.slice(0, 3).join('\n'),
      });
    }

    if (result.success > 0) {
      setIsCSVDialogOpen(false);
      setCSVData("");
    }
  };

  const handleApplyTemplate = () => {
    if (!selectedTemplate || !selectedRoomForTemplate) {
      toast.error("Please select both template and room");
      return;
    }

    const room = rooms.find(r => r.id === selectedRoomForTemplate);
    if (!room) return;

    const template = templates.find(t => t.id === selectedTemplate);
    applyTemplate(selectedTemplate, room.name, room.building);
    
    toast.success(`Template "${template?.name}" applied to "${room.name}"`);
    setIsTemplateDialogOpen(false);
    setSelectedTemplate("");
    setSelectedRoomForTemplate("");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "Light",
      room: "",
      building: "",
      maxPower: "",
      status: "on",
    });
  };

  const openEditDialog = (device: Device) => {
    setSelectedDevice(device);
    setFormData({
      name: device.name,
      type: device.type,
      room: device.room,
      building: device.building,
      maxPower: String(device.maxPower),
      status: device.status === 'offline' ? 'off' : device.status,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (device: Device) => {
    setSelectedDevice(device);
    setIsDeleteDialogOpen(true);
  };

  const downloadCSVTemplate = () => {
    const template = `name,type,room,building,maxPower,status
AC Unit 1,AC,Lab Komputer 1,Gedung A - Lt. 2,1500,on
LED Panel 1,Light,Lab Komputer 1,Gedung A - Lt. 2,300,on
Computer 1-10,Computer,Lab Komputer 1,Gedung A - Lt. 2,1000,on`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'devices-template.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV template downloaded");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Devices Management</h1>
                <p className="text-muted-foreground mt-1">Manage all monitoring devices</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsTemplateDialogOpen(true)}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Templates
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsCSVDialogOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import CSV
                </Button>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Device
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Devices</p>
                    <p className="text-2xl font-bold">{devices.length}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <Zap className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold">{devices.filter(d => d.status === 'on').length}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <Zap className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Device Types</p>
                    <p className="text-2xl font-bold">
                      {new Set(devices.map(d => d.type)).size}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Zap className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Power</p>
                    <p className="text-2xl font-bold">
                      {(devices.reduce((sum, d) => sum + d.maxPower, 0) / 1000).toFixed(1)}kW
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Filters */}
            <Card className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search devices..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filterRoom} onValueChange={setFilterRoom}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by room" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rooms</SelectItem>
                    {Array.from(new Set(devices.map(d => d.room))).map(room => (
                      <SelectItem key={room} value={room}>{room}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {deviceTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* Table */}
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Device Name</TableHead>
                      <TableHead className="font-semibold">Type</TableHead>
                      <TableHead className="font-semibold">Room</TableHead>
                      <TableHead className="font-semibold">Building</TableHead>
                      <TableHead className="font-semibold">Power</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  {filteredDevices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No devices found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDevices.map((device) => (
                      <TableRow key={device.id}>
                        <TableCell className="font-medium">{device.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{device.type}</Badge>
                        </TableCell>
                        <TableCell>{device.room}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {device.building}
                        </TableCell>
                        <TableCell>
                          {device.power}/{device.maxPower}W
                        </TableCell>
                        <TableCell>
                          <Badge variant={device.status === 'on' ? "default" : "secondary"}>
                            {device.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(device)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDeleteDialog(device)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              </div>
            </Card>
          </div>
        </main>
      </div>

      {/* Add/Edit Device Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        setIsAddDialogOpen(false);
        setIsEditDialogOpen(false);
        if (!open) {
          setSelectedDevice(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditDialogOpen ? 'Edit Device' : 'Add New Device'}</DialogTitle>
            <DialogDescription>
              {isEditDialogOpen ? 'Update device information' : 'Add a new monitoring device'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="device-name">Device Name *</Label>
              <Input
                id="device-name"
                placeholder="e.g., AC Unit 1"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="device-type">Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger id="device-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {deviceTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="device-room">Room *</Label>
              <Select 
                value={formData.room || undefined} 
                onValueChange={(value) => {
                  const room = rooms.find(r => r.name === value);
                  setFormData({ 
                    ...formData, 
                    room: value,
                    building: room?.building || ""
                  });
                }}
              >
                <SelectTrigger id="device-room">
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map(room => (
                    <SelectItem key={room.id} value={room.name}>
                      {room.name} ({room.building})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="device-building">Building *</Label>
              <Input
                id="device-building"
                placeholder="Auto-filled from room"
                value={formData.building}
                onChange={(e) => setFormData({ ...formData, building: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="device-power">Max Power (Watts) *</Label>
              <Input
                id="device-power"
                type="number"
                placeholder="e.g., 1500"
                value={formData.maxPower}
                onChange={(e) => setFormData({ ...formData, maxPower: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="device-status">Initial Status *</Label>
              <Select value={formData.status} onValueChange={(value: "on" | "off") => setFormData({ ...formData, status: value })}>
                <SelectTrigger id="device-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on">On</SelectItem>
                  <SelectItem value="off">Off</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddDialogOpen(false);
              setIsEditDialogOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={isEditDialogOpen ? handleEditDevice : handleAddDevice}>
              {isEditDialogOpen ? 'Save Changes' : 'Add Device'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CSV Import Dialog */}
      <Dialog open={isCSVDialogOpen} onOpenChange={setIsCSVDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Import Devices from CSV</DialogTitle>
            <DialogDescription>
              Paste CSV data or use the template format below
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="paste" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="paste">Paste CSV</TabsTrigger>
              <TabsTrigger value="template">CSV Format</TabsTrigger>
            </TabsList>
            <TabsContent value="paste" className="space-y-4">
              <Textarea
                placeholder="Paste CSV data here..."
                className="min-h-[300px] font-mono text-sm"
                value={csvData}
                onChange={(e) => setCSVData(e.target.value)}
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={downloadCSVTemplate} className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
                <Button onClick={handleCSVImport} className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Devices
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="template" className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-semibold mb-2">CSV Format:</p>
                <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
{`name,type,room,building,maxPower,status
AC Unit 1,AC,Lab Komputer 1,Gedung A - Lt. 2,1500,on
LED Panel 1,Light,Lab Komputer 1,Gedung A - Lt. 2,300,on
Computer 1-10,Computer,Lab Komputer 1,Gedung A - Lt. 2,1000,on`}
                </pre>
                <div className="mt-4 space-y-2 text-sm">
                  <p className="font-semibold">Required columns:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li><strong>name</strong>: Device name</li>
                    <li><strong>type</strong>: AC, Light, Projector, Computer, or Other</li>
                    <li><strong>room</strong>: Room name (must match existing room)</li>
                    <li><strong>building</strong>: Building location</li>
                    <li><strong>maxPower</strong>: Maximum power in Watts (number)</li>
                    <li><strong>status</strong>: on or off</li>
                  </ul>
                </div>
              </div>
              <Button variant="outline" onClick={downloadCSVTemplate} className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Download CSV Template
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Template Dialog */}
      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Apply Device Template</DialogTitle>
            <DialogDescription>
              Select a template and target room to quickly add multiple devices
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Template</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {templates.map(template => (
                  <Card
                    key={template.id}
                    className={cn(
                      "p-4 cursor-pointer transition-all hover:shadow-md",
                      selectedTemplate === template.id && "border-primary ring-2 ring-primary/20"
                    )}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold">{template.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {template.devices.length} devices • {(template.devices.reduce((sum, d) => sum + d.maxPower, 0) / 1000).toFixed(1)}kW
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="target-room">Target Room</Label>
              <Select value={selectedRoomForTemplate} onValueChange={setSelectedRoomForTemplate}>
                <SelectTrigger id="target-room">
                  <SelectValue placeholder="Select room to apply template" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map(room => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name} - {room.building}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApplyTemplate} disabled={!selectedTemplate || !selectedRoomForTemplate}>
              <Sparkles className="h-4 w-4 mr-2" />
              Apply Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Device</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedDevice?.name}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDevice} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DevicesManagement;
