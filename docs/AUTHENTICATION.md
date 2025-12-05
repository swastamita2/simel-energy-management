# Authentication & Authorization System

## Overview

Sistem autentikasi dan otorisasi berbasis role untuk Energy Management System tanpa menggunakan database. Menggunakan mock data dengan 4 role berbeda: Admin, Teknisi, Manajer, dan Mahasiswa/Dosen.

## User Roles

### 1. Admin

**Email**: admin@itpln.ac.id  
**Password**: admin123  
**Akses Penuh**:

- ✅ Dashboard - View semua metrik energi
- ✅ Monitoring - View dan control perangkat
- ✅ Analytics - View dashboard analitik
- ✅ Reports - Create, edit, delete, view laporan
- ✅ Users - Manage users (CRUD)
- ✅ Settings - Configure sistem
- ✅ Automation (IF-THEN) - Create, edit, delete automation rules
- ✅ Maintenance - View dan edit jadwal maintenance

**Kemampuan Khusus**:

- Membuat dan mengelola automation rules (IF-THEN)
- Full access ke semua fitur sistem
- Manage users dan permissions

### 2. Teknisi

**Email**: teknisi@itpln.ac.id  
**Password**: teknisi123  
**Akses**:

- ✅ Dashboard - View metrik energi
- ✅ Monitoring - View dan **control perangkat** (ON/OFF/Reset)
- ✅ Devices - Control perangkat listrik
- ✅ Notifications - Terima notifikasi anomali
- ✅ Reports - View only (read-only)

**Kemampuan Khusus**:

- Kontrol langsung perangkat (ON/OFF/Reset)
- Monitoring real-time
- Menerima dan merespons notifikasi anomali

### 3. Manajer

**Email**: manajer@itpln.ac.id  
**Password**: manajer123  
**Akses**:

- ✅ Dashboard - View metrik energi
- ✅ Analytics - View dashboard analitik mendalam
- ✅ Reports - View dan monitor laporan konsumsi
- ✅ Consumption - View dan manage pola konsumsi
- ✅ Monitoring - View only (tidak bisa control)

**Kemampuan Khusus**:

- Analisis mendalam konsumsi energi
- Manajemen pola konsumsi
- View-only access ke monitoring

### 4. Mahasiswa/Dosen 🆕

**Email**: \*@itpln.ac.id (any email dengan domain @itpln.ac.id kecuali admin/teknisi/manajer)  
**Password**: mahasiswa123  
**Akses**:

- ✅ Dashboard - View metrik energi dasar
- ✅ Analytics - View dashboard analitik

**Kemampuan Khusus**:

- Login otomatis untuk semua email dengan domain @itpln.ac.id
- View-only access untuk educational purposes
- Tidak dapat mengontrol perangkat atau mengubah data

**Contoh Email**:

- achmad@itpln.ac.id → Login berhasil sebagai Mahasiswa
- budi.santoso@itpln.ac.id → Login berhasil sebagai Mahasiswa
- dosen123@itpln.ac.id → Login berhasil sebagai Mahasiswa
- mahasiswa.teknik@itpln.ac.id → Login berhasil sebagai Mahasiswa

**Note**: Semua email selain 3 role khusus (Admin, Teknisi, Manajer) yang menggunakan domain @itpln.ac.id akan otomatis dianggap sebagai Mahasiswa/Dosen dengan akses terbatas.

## Architecture

### File Structure

```
src/
├── config/
│   └── auth.ts                    # Mock users, passwords, role permissions
├── contexts/
│   └── AuthContext.tsx            # Auth state management
├── components/
│   └── auth/
│       └── ProtectedRoute.tsx     # Route protection HOC
├── pages/
│   └── Login.tsx                  # Login page
└── services/
    └── authService.ts             # Auth API service
```

### Key Components

#### 1. Mock Authentication (`src/config/auth.ts`)

```typescript
// Mock users (no database)
export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin ITPLN',
    email: 'admin@itpln.ac.id',
    role: 'admin',
    // ...
  },
  // ... teknisi, manajer
];

// Plain text passwords (for development)
export const MOCK_PASSWORDS: Record<string, string> = {
  'admin@itpln.ac.id': 'admin123',
  'teknisi@itpln.ac.id': 'teknisi123',
  'manajer@itpln.ac.id': 'manajer123',
};

// Permission matrix
export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  admin: {
    permissions: [
      { module: 'dashboard', actions: ['view'] },
      { module: 'automation', actions: ['view', 'create', 'edit', 'delete'] },
      // ...
    ],
    routes: ['/', '/monitoring', '/analytics', '/reports', '/users', '/settings'],
  },
  // ... teknisi, manajer
};
```

#### 2. Auth Context (`src/contexts/AuthContext.tsx`)

```typescript
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async (credentials) => {},
  logout: async () => {},
  updateUser: (user) => {},
});

export const useAuth = () => useContext(AuthContext);
```

#### 3. Protected Route (`src/components/auth/ProtectedRoute.tsx`)

```typescript
<ProtectedRoute allowedRoles={["admin", "teknisi"]}>
  <Monitoring />
</ProtectedRoute>

<ProtectedRoute requiredPermissions={["automation.create"]}>
  <AutomationPage />
</ProtectedRoute>
```

#### 4. Auth Service (`src/services/authService.ts`)

```typescript
export const authService = {
  login: async (credentials) => {
    // Check credentials against MOCK_USERS and MOCK_PASSWORDS
    // Store token and user in localStorage
  },
  logout: async () => {
    // Clear localStorage
  },
  getCurrentUser: async () => {
    // Get user from localStorage
  },
};
```

## Usage

### 1. Login Flow

```typescript
// In Login component
import { useAuth } from '@/contexts/AuthContext';

const { login, isLoading } = useAuth();

const handleSubmit = async (data) => {
  try {
    await login({ email: data.email, password: data.password });
    navigate('/dashboard');
  } catch (error) {
    // Handle error
  }
};
```

### 2. Protecting Routes

```typescript
// In App.tsx
<Route
  path="/monitoring"
  element={
    <ProtectedRoute allowedRoles={["admin", "teknisi"]}>
      <Monitoring />
    </ProtectedRoute>
  }
/>

<Route
  path="/users"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <Users />
    </ProtectedRoute>
  }
/>
```

### 3. Checking Permissions

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { hasSimplePermission } from '@/config/auth';

const MyComponent = () => {
  const { user } = useAuth();

  const canCreateAutomation = hasSimplePermission(user.role, 'automation.create');

  return (
    <>
      {canCreateAutomation && (
        <Button onClick={handleCreate}>Create Rule</Button>
      )}
    </>
  );
};
```

### 4. Role-based UI

```typescript
// In Sidebar
const visibleNavigation = navigation.filter((item) =>
  hasSimplePermission(user.role, item.permission)
);

// Dynamically show/hide menu items based on role
```

### 5. Logout

```typescript
import { useAuth } from '@/contexts/AuthContext';

const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
  navigate('/login');
};
```

## Permission System

### Permission Format

```typescript
type PermissionString = 'module.action';
// Examples:
// - 'dashboard.view'
// - 'automation.create'
// - 'users.delete'
```

### Available Permissions

#### Dashboard

- `dashboard.view` - View dashboard

#### Monitoring

- `monitoring.view` - View monitoring page
- `monitoring.control` - Control devices

#### Analytics

- `analytics.view` - View analytics

#### Reports

- `reports.view` - View reports
- `reports.create` - Create reports
- `reports.edit` - Edit reports
- `reports.delete` - Delete reports

#### Users

- `users.view` - View users
- `users.create` - Create users
- `users.edit` - Edit users
- `users.delete` - Delete users

#### Settings

- `settings.view` - View settings
- `settings.edit` - Edit settings

#### Devices

- `devices.view` - View devices
- `devices.control` - Control devices (ON/OFF/Reset)

#### Automation (IF-THEN)

- `automation.view` - View automation rules
- `automation.create` - Create automation rules (Admin only)
- `automation.edit` - Edit automation rules (Admin only)
- `automation.delete` - Delete automation rules (Admin only)

#### Maintenance

- `maintenance.view` - View maintenance schedule
- `maintenance.edit` - Edit maintenance schedule

#### Notifications

- `notifications.view` - View notifications

#### Consumption

- `consumption.view` - View consumption data
- `consumption.edit` - Edit consumption patterns

## Helper Functions

### `hasSimplePermission(role, permission)`

Check if user role has specific permission.

```typescript
hasSimplePermission('admin', 'automation.create'); // true
hasSimplePermission('teknisi', 'automation.create'); // false
```

### `canAccessRoute(role, route)`

Check if user role can access specific route.

```typescript
canAccessRoute('manajer', '/analytics'); // true
canAccessRoute('teknisi', '/users'); // false
```

### `getRoleDisplayName(role)`

Get display name for role.

```typescript
getRoleDisplayName('admin'); // 'Administrator'
getRoleDisplayName('teknisi'); // 'Teknisi'
```

### `getRoleBadgeColor(role)`

Get Tailwind CSS classes for role badge color.

```typescript
getRoleBadgeColor('admin'); // 'bg-red-500/10 text-red-700 dark:text-red-300'
```

## Security Notes

⚠️ **Development Mode Only**

- Mock authentication is for development/demo purposes only
- Passwords are stored in plain text
- Tokens are simple mock strings
- No actual encryption or security measures

🔒 **Production Recommendations**

1. Implement proper backend authentication with JWT
2. Hash passwords with bcrypt or similar
3. Use HTTPS for all requests
4. Implement refresh token rotation
5. Add rate limiting for login attempts
6. Add 2FA/MFA for admin accounts
7. Store sensitive data in environment variables
8. Implement CSRF protection
9. Add session timeout and automatic logout

## Testing Authentication

### Test Accounts

```
Admin:
  Email: admin@itpln.ac.id
  Password: admin123

Teknisi:
  Email: teknisi@itpln.ac.id
  Password: teknisi123

Manajer:
  Email: manajer@itpln.ac.id
  Password: manajer123
```

### Test Scenarios

1. **Login as Admin**
   - Should see all menu items (Dashboard, Monitoring, Analytics, Reports, Automation, Users, Settings)
   - Can access all routes
   - Can create automation rules

2. **Login as Teknisi**
   - Should see Dashboard, Monitoring menu items only
   - Can control devices (ON/OFF/Reset)
   - Cannot access Users or Automation pages

3. **Login as Manajer**
   - Should see Dashboard, Analytics, Reports menu items
   - Can view analytics and reports
   - Cannot control devices or create automation

4. **Unauthorized Access**
   - Try accessing `/users` as Teknisi → should see access denied
   - Try accessing `/automation` as Manajer → should see access denied

5. **Logout**
   - Logout → should redirect to login page
   - Try accessing protected route → should redirect to login

## Troubleshooting

### Issue: Stuck on loading screen

**Solution**: Check browser console for errors. Clear localStorage and try again.

### Issue: Can't login with valid credentials

**Solution**: Check that `authService.ts` is using MOCK_USERS and MOCK_PASSWORDS correctly.

### Issue: Can access route that should be restricted

**Solution**: Check that route is wrapped with `<ProtectedRoute>` with correct `allowedRoles`.

### Issue: Menu items not showing/hiding based on role

**Solution**: Verify `hasSimplePermission` is called correctly in Sidebar component.

## Future Enhancements

- [ ] Add "Remember Me" functionality
- [ ] Implement password reset flow
- [ ] Add user profile editing
- [ ] Implement activity logging
- [ ] Add session management
- [ ] Implement role hierarchy
- [ ] Add custom permissions per user
- [ ] Integrate with real backend API
- [ ] Add OAuth/SSO support
- [ ] Implement MFA
