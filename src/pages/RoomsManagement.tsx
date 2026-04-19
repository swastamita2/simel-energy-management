import { useMemo, useState } from 'react';
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
import { Search, Plus, Edit, Trash2, Building2 } from "lucide-react";
import { AdminRoom } from "@/services/monitoringService";
import { useAdminRooms } from "@/hooks/use-admin-rooms";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const defaultFormData = {
  name: "",
  building: "",
  enabled: true,
};

const RoomsManagement = () => {
  const { rooms, isLoading, isSubmitting, createRoom, updateRoom, deleteRoom } = useAdminRooms();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<AdminRoom | null>(null);
  const [formData, setFormData] = useState(defaultFormData);

  const filteredRooms = useMemo(() => (
    rooms.filter((room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.building.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ), [rooms, searchQuery]);

  const handleAddRoom = async () => {
    if (!formData.name.trim() || !formData.building.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const result = await createRoom({
      name: formData.name.trim(),
      building: formData.building.trim(),
      enabled: formData.enabled,
    });

    if (!result.success) {
      toast.error(result.error || "Failed to add room");
      return;
    }

    toast.success(`Room "${formData.name}" added successfully`);
    setIsAddDialogOpen(false);
    setFormData(defaultFormData);
  };

  const handleEditRoom = async () => {
    if (!selectedRoom || !formData.name.trim() || !formData.building.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const result = await updateRoom(selectedRoom.id, {
      name: formData.name.trim(),
      building: formData.building.trim(),
      enabled: formData.enabled,
    });

    if (!result.success) {
      toast.error(result.error || "Failed to update room");
      return;
    }

    toast.success(`Room "${formData.name}" updated successfully`);
    setIsEditDialogOpen(false);
    setSelectedRoom(null);
    setFormData(defaultFormData);
  };

  const handleDeleteRoom = async () => {
    if (!selectedRoom) return;

    if (selectedRoom.totalDevices > 0) {
      toast.warning(`Warning: ${selectedRoom.totalDevices} devices will be deleted with this room`);
    }

    const roomName = selectedRoom.name;
    const result = await deleteRoom(selectedRoom.id);

    if (!result.success) {
      toast.error(result.error || "Failed to delete room");
      return;
    }

    toast.success(`Room "${roomName}" deleted successfully`);
    setIsDeleteDialogOpen(false);
    setSelectedRoom(null);
  };

  const openEditDialog = (room: AdminRoom) => {
    setSelectedRoom(room);
    setFormData({
      name: room.name,
      building: room.building,
      enabled: room.enabled ?? true,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (room: AdminRoom) => {
    setSelectedRoom(room);
    setIsDeleteDialogOpen(true);
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
                    <p className="text-2xl font-bold">{rooms.filter((r) => r.enabled !== false).length}</p>
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
                      {rooms.reduce((sum, room) => sum + room.totalDevices, 0)}
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
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Loading rooms...
                      </TableCell>
                    </TableRow>
                  ) : filteredRooms.length === 0 ? (
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
                          <Badge className={cn("border", statusColors[room.status] || statusColors.normal)}>
                            {room.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={room.enabled !== false ? "default" : "secondary"}>
                            {room.enabled !== false ? "Active" : "Disabled"}
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
            <Button onClick={handleAddRoom} disabled={isSubmitting}>Add Room</Button>
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
            <Button onClick={handleEditRoom} disabled={isSubmitting}>Save Changes</Button>
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
            <AlertDialogAction onClick={handleDeleteRoom} className="bg-destructive" disabled={isSubmitting}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RoomsManagement;
