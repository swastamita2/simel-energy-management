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
    name: 'Teknisi Listrik',
    email: 'teknisi@itpln.ac.id',
    role: 'teknisi',
    department: 'Maintenance',
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
];

// Mock passwords (in production, use hashed passwords)
export const MOCK_PASSWORDS: Record<string, string> = {
  'admin@itpln.ac.id': 'admin123',
  'teknisi@itpln.ac.id': 'teknisi123',
  'manajer@itpln.ac.id': 'manajer123',
  // Any @itpln.ac.id email (mahasiswa/dosen) - default password
  'default@itpln.ac.id': 'mahasiswa123',
};

// Role-based permissions configuration
export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  admin: {
    role: 'admin',
    permissions: [
      { module: 'dashboard', actions: ['view'] },
      { module: 'monitoring', actions: ['view'] },
      { module: 'analytics', actions: ['view'] },
      { module: 'reports', actions: ['view', 'create', 'edit', 'delete'] },
      { module: 'users', actions: ['view', 'create', 'edit', 'delete'] },
      { module: 'settings', actions: ['view', 'edit'] },
      { module: 'devices', actions: ['view', 'control'] },
      { module: 'automation', actions: ['view', 'create', 'edit', 'delete'] }, // IF-THEN rules
      { module: 'maintenance', actions: ['view', 'edit'] },
    ],
    routes: ['/', '/monitoring', '/analytics', '/reports', '/users', '/settings', '/automation'],
  },
  teknisi: {
    role: 'teknisi',
    permissions: [
      { module: 'dashboard', actions: ['view'] },
      { module: 'monitoring', actions: ['view', 'control'] }, // Kontrol perangkat
      { module: 'devices', actions: ['view', 'control'] }, // ON/OFF/Reset
      { module: 'notifications', actions: ['view'] }, // Terima notifikasi anomali
      { module: 'settings', actions: ['view', 'edit'] }, // Akses settings
    ],
    routes: ['/', '/monitoring', '/settings'],
  },
  manajer: {
    role: 'manajer',
    permissions: [
      { module: 'dashboard', actions: ['view'] },
      { module: 'analytics', actions: ['view'] }, // View dashboard energi
      { module: 'reports', actions: ['view', 'approve'] }, // Menerima & menyetujui laporan
      { module: 'consumption', actions: ['view', 'edit'] }, // Manage pola konsumsi
      { module: 'settings', actions: ['view', 'edit'] }, // Akses settings
    ],
    routes: ['/', '/analytics', '/reports', '/settings'],
  },
  mahasiswa: {
    role: 'mahasiswa',
    permissions: [
      { module: 'dashboard', actions: ['view'] }, // View dashboard
      { module: 'analytics', actions: ['view'] }, // View analytics
      { module: 'settings', actions: ['view', 'edit'] }, // Akses settings untuk preferensi personal
    ],
    routes: ['/', '/analytics', '/settings'],
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
    teknisi: 'Teknisi',
    manajer: 'Manajer',
    mahasiswa: 'Mahasiswa/Dosen',
  };
  return roleNames[role];
};

// Get role badge color
export const getRoleBadgeColor = (role: UserRole): string => {
  const colors: Record<UserRole, string> = {
    admin: 'bg-red-500/10 text-red-700 dark:text-red-300',
    teknisi: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
    manajer: 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
    mahasiswa: 'bg-green-500/10 text-green-700 dark:text-green-300',
  };
  return colors[role];
};
