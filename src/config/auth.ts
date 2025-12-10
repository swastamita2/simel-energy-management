import { User, UserRole, RolePermissions, PermissionString } from '@/types';

// Mock users for authentication (tanpa database)
export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin ITPLN',
    email: 'admin@itpln.ac.id',
    role: 'admin',
    department: 'IT Department',
    avatar: undefined,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Pimpinan Institut',
    email: 'pimpinan@itpln.ac.id',
    role: 'pimpinan',
    department: 'Leadership',
    avatar: undefined,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'Manajer Energi',
    email: 'manajer@itpln.ac.id',
    role: 'manajer',
    department: 'Management',
    avatar: undefined,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '4',
    name: 'Teknisi Listrik',
    email: 'teknisi@itpln.ac.id',
    role: 'teknisi',
    department: 'Maintenance',
    avatar: undefined,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

// Mock passwords (in production, use hashed passwords)
export const MOCK_PASSWORDS: Record<string, string> = {
  'admin@itpln.ac.id': 'admin123',
  'pimpinan@itpln.ac.id': 'pimpinan123',
  'manajer@itpln.ac.id': 'manajer123',
  'teknisi@itpln.ac.id': 'teknisi123',
  // Any @itpln.ac.id email (mahasiswa/dosen) - default password
  'default@itpln.ac.id': 'mahasiswa123',
};

// Role-based permissions configuration
export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  // Admin - Full access untuk maintenance system
  admin: {
    role: 'admin',
    permissions: [
      { module: 'dashboard', actions: ['view'] },
      { module: 'monitoring', actions: ['view'] },
      { module: 'analytics', actions: ['view'] },
      { module: 'reports', actions: ['view', 'create', 'edit', 'delete'] },
      { module: 'rooms', actions: ['view', 'create', 'edit', 'delete'] }, // Rooms Management
      { module: 'devices', actions: ['view', 'create', 'edit', 'delete', 'control'] }, // Devices Management
      { module: 'users', actions: ['view', 'create', 'edit', 'delete'] },
      { module: 'settings', actions: ['view', 'edit'] },
      { module: 'automation', actions: ['view', 'create', 'edit', 'delete'] },
      { module: 'notifications', actions: ['view', 'create'] },
    ],
    routes: ['/', '/monitoring', '/analytics', '/reports', '/rooms-management', '/devices-management', '/users', '/settings', '/automation'],
  },
  // Pimpinan Institut - View dashboard only
  pimpinan: {
    role: 'pimpinan',
    permissions: [
      { module: 'dashboard', actions: ['view'] }, // View Dashboard
      { module: 'monitoring-laporan', actions: ['view'] }, // View Approved Reports
    ],
    routes: ['/', '/monitoring-laporan'],
  },
  // Manajer - View dashboard energi, grafik konsumsi, review reports, manage pola konsumsi, view log aktivitas
  manajer: {
    role: 'manajer',
    permissions: [
      { module: 'dashboard', actions: ['view'] }, // View Dashboard
      { module: 'analytics', actions: ['view'] }, // View Dashboard Energi + Grafik Konsumsi Harian
      { module: 'reports', actions: ['view'] }, // Review Reports
      { module: 'consumption', actions: ['view', 'edit'] }, // Manage Pola Konsumsi Energi
      { module: 'monitoring', actions: ['view'] }, // View Log Aktivitas Sistem
      { module: 'automation', actions: ['view', 'create', 'edit'] }, // Menjalankan Aturan Otomatis (IF-THEN)
    ],
    routes: ['/', '/monitoring', '/analytics', '/reports', '/automation'],
  },
  // Teknisi - Maintenance hardware, menerima notifikasi anomali, menjalankan jadwal pemeriksaan perangkat
  teknisi: {
    role: 'teknisi',
    permissions: [
      { module: 'dashboard', actions: ['view'] },
      { module: 'monitoring', actions: ['view', 'control'] }, // Maintenance Hardware
      { module: 'devices', actions: ['view', 'control'] }, // ON/OFF/Reset perangkat
      { module: 'notifications', actions: ['view'] }, // Menerima Notifikasi Anomali
      { module: 'maintenance', actions: ['view', 'edit'] }, // Menjalankan Jadwal Pemeriksaan Perangkat
    ],
    routes: ['/', '/monitoring'],
  },
  // Dosen & Mahasiswa - View dashboard publik, view konsumsi energi ruangan
  mahasiswa: {
    role: 'mahasiswa',
    permissions: [
      { module: 'dashboard', actions: ['view'] }, // View Dashboard Publik
      { module: 'analytics', actions: ['view'] }, // View Konsumsi Energi Ruangan
    ],
    routes: ['/', '/analytics'],
  },
};

// Helper function to check if user has permission
export const hasPermission = (
  userRole: UserRole,
  module: string,
  action: 'view' | 'create' | 'edit' | 'delete' | 'control'
): boolean => {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  const modulePermission = rolePermissions.permissions.find((p) => p.module === module);
  return modulePermission?.actions.includes(action) ?? false;
};

// Simplified permission check for permissions like "dashboard.view"
export const hasSimplePermission = (userRole: UserRole, permission: PermissionString): boolean => {
  const [module, action] = permission.split('.') as [string, 'view' | 'create' | 'edit' | 'delete' | 'control'];
  return hasPermission(userRole, module, action);
};

// Helper function to check if user can access route
export const canAccessRoute = (userRole: UserRole, route: string): boolean => {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  return rolePermissions.routes.includes(route);
};

// Get user display name based on role
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    admin: 'Administrator',
    pimpinan: 'Pimpinan Institut',
    manajer: 'Manajer',
    teknisi: 'Teknisi',
    mahasiswa: 'Mahasiswa/Dosen',
  };
  return roleNames[role];
};

// Get role badge color
export const getRoleBadgeColor = (role: UserRole): string => {
  const colors: Record<UserRole, string> = {
    admin: 'bg-red-500/10 text-red-700 dark:text-red-300',
    pimpinan: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
    manajer: 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
    teknisi: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
    mahasiswa: 'bg-green-500/10 text-green-700 dark:text-green-300',
  };
  return colors[role];
};
