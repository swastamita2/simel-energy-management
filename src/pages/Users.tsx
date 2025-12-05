import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, UserPlus, MoreVertical, Edit, Trash2, Shield, Download, RefreshCw } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface User {
  id: number;
  name: string;
  email: string;
  role: "Pimpinan" | "Manajer" | "Teknisi" | "Dosen" | "Mahasiswa";
  status: "active" | "inactive";
  lastLogin: string;
}

const initialUsers: User[] = [
  { id: 1, name: "Dr. Ahmad Sudrajat", email: "ahmad.sudrajat@itpln.ac.id", role: "Pimpinan", status: "active", lastLogin: "2024-11-01 09:30" },
  { id: 2, name: "Ir. Budi Santoso", email: "budi.santoso@itpln.ac.id", role: "Manajer", status: "active", lastLogin: "2024-11-01 08:15" },
  { id: 3, name: "Sri Wahyuni, S.T.", email: "sri.wahyuni@itpln.ac.id", role: "Teknisi", status: "active", lastLogin: "2024-10-31 16:45" },
  { id: 4, name: "Prof. Dr. Hendro Wibowo", email: "hendro.wibowo@itpln.ac.id", role: "Dosen", status: "active", lastLogin: "2024-11-01 07:20" },
  { id: 5, name: "Andi Pratama", email: "andi.pratama@student.itpln.ac.id", role: "Mahasiswa", status: "active", lastLogin: "2024-10-31 18:30" },
  { id: 6, name: "Dewi Lestari, S.T.", email: "dewi.lestari@itpln.ac.id", role: "Teknisi", status: "inactive", lastLogin: "2024-10-20 14:20" },
  { id: 7, name: "Rudi Hermawan", email: "rudi.hermawan@student.itpln.ac.id", role: "Mahasiswa", status: "active", lastLogin: "2024-11-01 10:15" },
  { id: 8, name: "Dr. Siti Nurjanah", email: "siti.nurjanah@itpln.ac.id", role: "Dosen", status: "active", lastLogin: "2024-11-01 08:45" },
];

const roleColors = {
  Pimpinan: "bg-alert/10 text-alert border-alert/20",
  Manajer: "bg-primary/10 text-primary border-primary/20",
  Teknisi: "bg-secondary/10 text-secondary border-secondary/20",
  Dosen: "bg-success/10 text-success border-success/20",
  Mahasiswa: "bg-muted text-muted-foreground border-border",
};

const Users = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: ""
  });

  // Calculate stats
  const totalUsers = users.length;
  const activeToday = users.filter(u => u.status === "active").length;
  const managers = users.filter(u => u.role === "Manajer").length;
  const students = users.filter(u => u.role === "Mahasiswa").length;

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase();
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle add user
  const handleAddUser = () => {
    if (!formData.name || !formData.email || !formData.role || !formData.password) {
      toast.error("Please fill all required fields");
      return;
    }

    const newUser: User = {
      id: Math.max(...users.map(u => u.id)) + 1,
      name: formData.name,
      email: formData.email,
      role: formData.role as User["role"],
      status: "active",
      lastLogin: new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }).slice(0, 16).replace('T', ' ')
    };

    setUsers([...users, newUser]);
    toast.success(`User ${formData.name} added successfully`);
    setIsAddUserOpen(false);
    setFormData({ name: "", email: "", role: "", password: "" });
  };

  // Handle edit user
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: ""
    });
    setIsEditUserOpen(true);
  };

  // Handle update user
  const handleUpdateUser = () => {
    if (!selectedUser || !formData.name || !formData.email || !formData.role) {
      toast.error("Please fill all required fields");
      return;
    }

    setUsers(users.map(u =>
      u.id === selectedUser.id
        ? { ...u, name: formData.name, email: formData.email, role: formData.role as User["role"] }
        : u
    ));

    toast.success(`User ${formData.name} updated successfully`);
    setIsEditUserOpen(false);
    setSelectedUser(null);
    setFormData({ name: "", email: "", role: "", password: "" });
  };

  // Handle delete user
  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedUser) return;
    
    setUsers(users.filter(u => u.id !== selectedUser.id));
    toast.success(`User ${selectedUser.name} deleted successfully`);
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  // Handle toggle status
  const handleToggleStatus = (userId: number) => {
    setUsers(users.map(u =>
      u.id === userId
        ? { ...u, status: u.status === "active" ? "inactive" : "active" }
        : u
    ));
    const user = users.find(u => u.id === userId);
    toast.success(`${user?.name} status updated`);
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.info("Refreshing user data...");
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Data refreshed successfully");
    }, 1000);
  };

  // Handle export
  const handleExport = () => {
    const csvContent = [
      ["Name", "Email", "Role", "Status", "Last Login"],
      ...users.map(u => [u.name, u.email, u.role, u.status, u.lastLogin])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success("Users exported successfully");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">User Management</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage user accounts and access permissions
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
              <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Add User</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                      Create a new user account and assign role
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input 
                        id="name" 
                        placeholder="e.g., Dr. Ahmad Sudrajat"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="user@itpln.ac.id"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="role">Role *</Label>
                      <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pimpinan">Pimpinan</SelectItem>
                          <SelectItem value="Manajer">Manajer</SelectItem>
                          <SelectItem value="Teknisi">Teknisi</SelectItem>
                          <SelectItem value="Dosen">Dosen</SelectItem>
                          <SelectItem value="Mahasiswa">Mahasiswa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Temporary Password *</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="Min. 8 characters"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      setIsAddUserOpen(false);
                      setFormData({ name: "", email: "", role: "", password: "" });
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddUser}>Create User</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <h3 className="text-2xl font-bold text-foreground mt-1">{totalUsers}</h3>
                </div>
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Today</p>
                  <h3 className="text-2xl font-bold text-foreground mt-1">{activeToday}</h3>
                </div>
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Managers</p>
                  <h3 className="text-2xl font-bold text-foreground mt-1">{managers}</h3>
                </div>
                <Badge variant="outline">Staff</Badge>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Students</p>
                  <h3 className="text-2xl font-bold text-foreground mt-1">{students}</h3>
                </div>
                <Badge variant="outline">Public</Badge>
              </div>
            </Card>
          </div>

          {/* Users Table */}
          <Card className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="pimpinan">Pimpinan</SelectItem>
                    <SelectItem value="manajer">Manajer</SelectItem>
                    <SelectItem value="teknisi">Teknisi</SelectItem>
                    <SelectItem value="dosen">Dosen</SelectItem>
                    <SelectItem value="mahasiswa">Mahasiswa</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No users found</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setRoleFilter("all");
                    setStatusFilter("all");
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-3 px-1">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredUsers.length} of {totalUsers} users
                  </p>
                </div>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[150px]">Name</TableHead>
                        <TableHead className="min-w-[200px]">Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="min-w-[120px]">Last Login</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">{user.email}</TableCell>
                          <TableCell>
                            <Badge className={cn("text-xs", roleColors[user.role])}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStatus(user.id)}
                              className="h-auto p-0"
                            >
                              <Badge variant={user.status === "active" ? "default" : "secondary"} className="text-xs cursor-pointer">
                                {user.status}
                              </Badge>
                            </Button>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">{user.lastLogin}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => handleDeleteUser(user)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </Card>

          {/* Edit User Dialog */}
          <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>
                  Update user information and role
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Full Name *</Label>
                  <Input 
                    id="edit-name" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-email">Email Address *</Label>
                  <Input 
                    id="edit-email" 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-role">Role *</Label>
                  <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                    <SelectTrigger id="edit-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pimpinan">Pimpinan</SelectItem>
                      <SelectItem value="Manajer">Manajer</SelectItem>
                      <SelectItem value="Teknisi">Teknisi</SelectItem>
                      <SelectItem value="Dosen">Dosen</SelectItem>
                      <SelectItem value="Mahasiswa">Mahasiswa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsEditUserOpen(false);
                  setSelectedUser(null);
                  setFormData({ name: "", email: "", role: "", password: "" });
                }}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateUser}>Update User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the user <span className="font-semibold">{selectedUser?.name}</span> and remove all their data. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setSelectedUser(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
                  Delete User
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </main>
      </div>
    </div>
  );
};

export default Users;
