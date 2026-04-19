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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Edit, Trash2, Zap } from "lucide-react";
import { AdminDevice, CreateDevicePayload } from "@/services/monitoringService";
import { useAdminDevices } from "@/hooks/use-admin-devices";
import { useAdminRooms } from "@/hooks/use-admin-rooms";
import { toast } from "sonner";

const deviceTypes: CreateDevicePayload['type'][] = ['ac', 'light', 'projector', 'computer', 'other'];

const deviceTypeLabel: Record<CreateDevicePayload['type'], string> = {
  ac: 'AC',
  light: 'Light',
  projector: 'Projector',
  computer: 'Computer',
  other: 'Other',
};

const defaultFormData = {
  name: '',
  type: 'light' as CreateDevicePayload['type'],
  roomId: '',
  room: '',
  building: '',
  maxPower: '',
  status: 'on' as 'on' | 'off',
};

const DevicesManagement = () => {
  const { devices, isLoading, isSubmitting, createDevice, updateDevice, deleteDevice } = useAdminDevices();
  const { rooms: availableRooms, isLoading: isRoomsLoading } = useAdminRooms();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRoom, setFilterRoom] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<AdminDevice | null>(null);
  const [formData, setFormData] = useState(defaultFormData);

  const roomOptions = useMemo(
    () => Array.from(new Set(devices.map((device) => device.room))).sort(),
    [devices],
  );

  const filteredDevices = useMemo(
    () =>
      devices.filter((device) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          device.name.toLowerCase().includes(query) ||
          device.room.toLowerCase().includes(query) ||
          device.building.toLowerCase().includes(query);
        const matchesRoom = filterRoom === 'all' || device.room === filterRoom;
        const matchesType = filterType === 'all' || device.type === filterType;

        return matchesSearch && matchesRoom && matchesType;
      }),
    [devices, filterRoom, filterType, searchQuery],
  );

  const roomSelectOptions = useMemo(
    () =>
      availableRooms
        .map((room) => ({
          id: String(room.id),
          name: room.name,
          building: room.building,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [availableRooms],
  );

  const resetForm = () => {
    setFormData(defaultFormData);
  };

  const handleAddDevice = async () => {
    if (!formData.name.trim() || !formData.room.trim() || !formData.building.trim() || !formData.maxPower.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const maxPower = Number.parseInt(formData.maxPower, 10);
    if (Number.isNaN(maxPower) || maxPower <= 0) {
      toast.error('Invalid max power value');
      return;
    }

    const result = await createDevice({
      name: formData.name.trim(),
      type: formData.type,
      room: formData.room.trim(),
      building: formData.building.trim(),
      maxPower,
      status: formData.status,
      temperature: formData.type === 'ac' ? 24 : undefined,
    });

    if (!result.success) {
      toast.error(result.error || 'Failed to add device');
      return;
    }

    toast.success(`Device "${formData.name}" added successfully`);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditDevice = async () => {
    if (!selectedDevice || !formData.name.trim() || !formData.maxPower.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const maxPower = Number.parseInt(formData.maxPower, 10);
    if (Number.isNaN(maxPower) || maxPower <= 0) {
      toast.error('Invalid max power value');
      return;
    }

    const result = await updateDevice(selectedDevice.id, {
      name: formData.name.trim(),
      type: formData.type,
      room: formData.room.trim(),
      building: formData.building.trim(),
      maxPower,
      status: formData.status,
      temperature: formData.type === 'ac' ? selectedDevice.temperature ?? 24 : undefined,
    });

    if (!result.success) {
      toast.error(result.error || 'Failed to update device');
      return;
    }

    toast.success(`Device "${formData.name}" updated successfully`);
    setIsEditDialogOpen(false);
    setSelectedDevice(null);
    resetForm();
  };

  const handleDeleteDevice = async () => {
    if (!selectedDevice) return;

    const deviceName = selectedDevice.name;
    const result = await deleteDevice(selectedDevice.id);
    if (!result.success) {
      toast.error(result.error || 'Failed to delete device');
      return;
    }

    toast.success(`Device "${deviceName}" deleted successfully`);
    setIsDeleteDialogOpen(false);
    setSelectedDevice(null);
  };

  const openEditDialog = (device: AdminDevice) => {
    const matchedRoom = roomSelectOptions.find(
      (room) => room.name === device.room && room.building === device.building,
    );

    setSelectedDevice(device);
    setFormData({
      name: device.name,
      type: device.type,
      roomId: matchedRoom?.id || '',
      room: device.room,
      building: device.building,
      maxPower: String(device.maxPower),
      status: device.status === 'offline' ? 'off' : device.status,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (device: AdminDevice) => {
    setSelectedDevice(device);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Devices Management</h1>
                <p className="text-muted-foreground mt-1">Manage all monitoring devices</p>
              </div>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Device
              </Button>
            </div>

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
                    <p className="text-2xl font-bold">{devices.filter((device) => device.status === 'on').length}</p>
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
                    <p className="text-2xl font-bold">{new Set(devices.map((device) => device.type)).size}</p>
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
                      {(devices.reduce((sum, device) => sum + device.maxPower, 0) / 1000).toFixed(1)}kW
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search devices..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                </div>
                <Select value={filterRoom} onValueChange={setFilterRoom}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by room" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rooms</SelectItem>
                    {roomOptions.map((room) => (
                      <SelectItem key={room} value={room}>
                        {room}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {deviceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {deviceTypeLabel[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Card>

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
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          Loading devices...
                        </TableCell>
                      </TableRow>
                    ) : filteredDevices.length === 0 ? (
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
                            <Badge variant="outline">{deviceTypeLabel[device.type]}</Badge>
                          </TableCell>
                          <TableCell>{device.room}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{device.building}</TableCell>
                          <TableCell>
                            {device.power}/{device.maxPower}W
                          </TableCell>
                          <TableCell>
                            <Badge variant={device.status === 'on' ? 'default' : device.status === 'off' ? 'secondary' : 'destructive'}>
                              {device.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => openEditDialog(device)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(device)}>
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

      <Dialog
        open={isAddDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setIsEditDialogOpen(false);
            setSelectedDevice(null);
            resetForm();
          }
        }}
      >
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
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="device-type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    type: value as CreateDevicePayload['type'],
                  })
                }
              >
                <SelectTrigger id="device-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {deviceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {deviceTypeLabel[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="device-room">Room *</Label>
              <Select
                value={formData.roomId}
                onValueChange={(value) => {
                  const selectedRoom = roomSelectOptions.find((room) => room.id === value);
                  setFormData({
                    ...formData,
                    roomId: value,
                    room: selectedRoom?.name || '',
                    building: selectedRoom?.building || '',
                  });
                }}
              >
                <SelectTrigger id="device-room" disabled={isRoomsLoading || roomSelectOptions.length === 0}>
                  <SelectValue
                    placeholder={
                      isRoomsLoading
                        ? 'Loading rooms...'
                        : roomSelectOptions.length === 0
                          ? 'No room available'
                          : 'Select room'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {roomSelectOptions.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
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
                placeholder="Building is set from selected room"
                value={formData.building}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="device-power">Max Power (Watts) *</Label>
              <Input
                id="device-power"
                type="number"
                placeholder="e.g., 1500"
                value={formData.maxPower}
                onChange={(event) => setFormData({ ...formData, maxPower: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="device-status">Initial Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value as 'on' | 'off',
                  })
                }
              >
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
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setIsEditDialogOpen(false);
                setSelectedDevice(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={isEditDialogOpen ? handleEditDevice : handleAddDevice} disabled={isSubmitting}>
              {isEditDialogOpen ? 'Save Changes' : 'Add Device'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Device</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedDevice?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDevice} className="bg-destructive" disabled={isSubmitting}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DevicesManagement;
