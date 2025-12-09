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
import { Search, Plus, Edit, Trash2, Building2, Download, Upload } from "lucide-react";
import { useEnergy, Room } from "@/contexts/EnergyContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const RoomsManagement = () => {
  const { rooms, addRoom, updateRoom, deleteRoom, exportData, importData } = useEnergy();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    building: "",
    enabled: true,
  });

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.building.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddRoom = () => {
    if (!formData.name.trim() || !formData.building.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    addRoom({
      name: formData.name,
      building: formData.building,
      enabled: formData.enabled,
      devicesOn: 0,
      totalDevices: 0,
      consumption: 0,
      status: 'normal',
    });

    toast.success(`Room "${formData.name}" added successfully`);
    setIsAddDialogOpen(false);
    setFormData({ name: "", building: "", enabled: true });
  };

  const handleEditRoom = () => {
    if (!selectedRoom || !formData.name.trim() || !formData.building.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    updateRoom(selectedRoom.id, {
      name: formData.name,
      building: formData.building,
      enabled: formData.enabled,
    });

    toast.success(`Room "${formData.name}" updated successfully`);
    setIsEditDialogOpen(false);
    setSelectedRoom(null);
    setFormData({ name: "", building: "", enabled: true });
  };

  const handleDeleteRoom = () => {
    if (!selectedRoom) return;

    if (selectedRoom.totalDevices > 0) {
      toast.warning(`Warning: ${selectedRoom.totalDevices} devices will be deleted with this room`);
    }

    deleteRoom(selectedRoom.id);
    toast.success(`Room "${selectedRoom.name}" deleted successfully`);
    setIsDeleteDialogOpen(false);
    setSelectedRoom(null);
  };

  const openEditDialog = (room: Room) => {
    setSelectedRoom(room);
    setFormData({
      name: room.name,
      building: room.building,
      enabled: room.enabled,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (room: Room) => {
    setSelectedRoom(room);
    setIsDeleteDialogOpen(true);
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `energy-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully");
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string;
        importData(jsonData);
        toast.success("Data imported successfully");
      } catch (error) {
        toast.error("Failed to import data. Please check the file format.");
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const statusColors = {
    normal: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    alert: "bg-alert/10 text-alert border-alert/20",
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
                <h1 className="text-3xl font-bold text-foreground">Rooms Management</h1>
                <p className="text-muted-foreground mt-1">Manage building rooms and spaces</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <label className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={handleImport}
                    />
                  </label>
                </Button>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Room
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Rooms</p>
                    <p className="text-2xl font-bold">{rooms.length}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <Building2 className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold">{rooms.filter(r => r.enabled).length}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <Building2 className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Buildings</p>
                    <p className="text-2xl font-bold">
                      {new Set(rooms.map(r => r.building.split(' - ')[0])).size}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Building2 className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Devices</p>
                    <p className="text-2xl font-bold">
                      {rooms.reduce((sum, r) => sum + r.totalDevices, 0)}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Search */}
            <Card className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search rooms by name or building..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </Card>

            {/* Table */}
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Room Name</TableHead>
                      <TableHead className="font-semibold">Building</TableHead>
                      <TableHead className="font-semibold">Devices</TableHead>
                      <TableHead className="font-semibold">Consumption</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Active</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  {filteredRooms.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No rooms found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRooms.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell className="font-medium">{room.name}</TableCell>
                        <TableCell>{room.building}</TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {room.devicesOn}/{room.totalDevices}
                          </span>
                        </TableCell>
                        <TableCell>{room.consumption.toFixed(1)} kWh</TableCell>
                        <TableCell>
                          <Badge className={cn("border", statusColors[room.status])}>
                            {room.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={room.enabled ? "default" : "secondary"}>
                            {room.enabled ? "Active" : "Disabled"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(room)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDeleteDialog(room)}
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

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
            <DialogDescription>
              Create a new room for monitoring devices
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Room Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Lab Komputer 1"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="building">Building & Floor *</Label>
              <Input
                id="building"
                placeholder="e.g., Gedung A - Lt. 2"
                value={formData.building}
                onChange={(e) => setFormData({ ...formData, building: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRoom}>Add Room</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>
              Update room information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Room Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-building">Building & Floor *</Label>
              <Input
                id="edit-building"
                value={formData.building}
                onChange={(e) => setFormData({ ...formData, building: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditRoom}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Room</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedRoom?.name}"?
              {selectedRoom && selectedRoom.totalDevices > 0 && (
                <span className="block mt-2 text-destructive font-semibold">
                  Warning: This will also delete {selectedRoom.totalDevices} device(s) in this room.
                </span>
              )}
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRoom} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RoomsManagement;
