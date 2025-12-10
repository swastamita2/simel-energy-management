# Role System Documentation

**Sistem Role Manajemen Energi ITPLN - Berdasarkan Use Case Diagram**

---

## 🎭 Role Hierarchy

Sistem memiliki **5 role** sesuai dengan use case diagram:

### 1. **Pimpinan Institut** 👔

**Email**: `pimpinan@itpln.ac.id`  
**Password**: `pimpinan123`

**Akses Use Case**:

- ✅ View Dashboard
- ✅ Monitoring Laporan

**Routes**:

- `/` - Dashboard
- `/monitoring` - Monitoring Laporan

**Permissions**:

```typescript
permissions: [
  { module: 'dashboard', actions: ['view'] },
  { module: 'monitoring', actions: ['view'] },
];
```

---

### 2. **Manajer** 📊

**Email**: `manajer@itpln.ac.id`  
**Password**: `manajer123`

**Akses Use Case** (Sesuai Diagram):

- ✅ View Dashboard
- ✅ View Dashboard Energi (Analytics)
- ✅ View Grafik Konsumsi Harian
- ✅ Review Reports
- ✅ Manage Pola Konsumsi Energi
- ✅ View Log Aktivitas Sistem
- ✅ Menjalankan Aturan Otomatis (IF-THEN)

**Routes**:

- `/` - Dashboard
- `/analytics` - Dashboard Energi + Grafik Konsumsi
- `/reports` - Review Reports
- `/monitoring` - Log Aktivitas Sistem
- `/automation` - Aturan Otomatis (IF-THEN)

**Permissions**:

```typescript
permissions: [
  { module: 'dashboard', actions: ['view'] },
  { module: 'analytics', actions: ['view'] },
  { module: 'reports', actions: ['view'] },
  { module: 'consumption', actions: ['view', 'edit'] },
  { module: 'monitoring', actions: ['view'] },
  { module: 'automation', actions: ['view', 'create', 'edit'] },
];
```

---

### 3. **Staf Admin** 🔧

**Email**: `admin@itpln.ac.id`  
**Password**: `admin123`

**Akses Use Case**:

- ✅ Atur Hak Akses
- ✅ Rooms Management (Input Laporan)
- ✅ Devices Management (Input Laporan)
- ✅ Full CRUD untuk semua module

**Routes**:

- `/` - Dashboard
- `/monitoring` - Monitoring
- `/analytics` - Analytics
- `/reports` - Reports Management
- `/rooms-management` - **Rooms CRUD**
- `/devices-management` - **Devices CRUD**
- `/users` - User Management
- `/settings` - Settings
- `/automation` - Automation Rules

**Permissions**: **Full Access**

```typescript
permissions: [
  { module: 'dashboard', actions: ['view'] },
  { module: 'monitoring', actions: ['view'] },
  { module: 'analytics', actions: ['view'] },
  { module: 'reports', actions: ['view', 'create', 'edit', 'delete'] },
  { module: 'rooms', actions: ['view', 'create', 'edit', 'delete'] },
  { module: 'devices', actions: ['view', 'create', 'edit', 'delete', 'control'] },
  { module: 'users', actions: ['view', 'create', 'edit', 'delete'] },
  { module: 'settings', actions: ['view', 'edit'] },
  { module: 'automation', actions: ['view', 'create', 'edit', 'delete'] },
  { module: 'notifications', actions: ['view', 'create'] },
];
```

---

### 4. **Teknisi** 🔨

**Email**: `teknisi@itpln.ac.id`  
**Password**: `teknisi123`

**Akses Use Case**:

- ✅ View Dashboard
- ✅ Maintenance Hardware
- ✅ Device Control (ON/OFF/Reset)
- ✅ Menerima Notifikasi Anomali
- ✅ Menjalankan Jadwal Pemeriksaan Perangkat

**Routes**:

- `/` - Dashboard
- `/monitoring` - Monitoring & Device Control

**Permissions**:

```typescript
permissions: [
  { module: 'dashboard', actions: ['view'] },
  { module: 'monitoring', actions: ['view', 'control'] },
  { module: 'devices', actions: ['view', 'control'] },
  { module: 'notifications', actions: ['view'] },
  { module: 'maintenance', actions: ['view', 'edit'] },
];
```

---

### 5. **Dosen & Mahasiswa** 🎓

**Email**: `any@itpln.ac.id` (domain @itpln.ac.id)  
**Password**: `mahasiswa123` (default)

**Akses Use Case**:

- ✅ View Dashboard Publik
- ✅ View Konsumsi Energi Ruangan

**Routes**:

- `/` - Dashboard
- `/analytics` - Konsumsi Energi Ruangan

**Permissions**:

```typescript
permissions: [
  { module: 'dashboard', actions: ['view'] },
  { module: 'analytics', actions: ['view'] },
];
```

**Special**: Otomatis terdeteksi untuk email dengan domain `@itpln.ac.id` yang bukan admin/pimpinan/manajer/teknisi.

---

## 📋 Role Comparison Matrix

| Use Case / Feature            | Pimpinan | Manajer | Staf Admin | Teknisi | Mahasiswa/Dosen |
| ----------------------------- | -------- | ------- | ---------- | ------- | --------------- |
| **View Dashboard**            | ✅       | ✅      | ✅         | ✅      | ✅              |
| **Monitoring Laporan**        | ✅       | ✅      | ✅         | ✅      | ❌              |
| **View Dashboard Energi**     | ❌       | ✅      | ✅         | ❌      | ✅              |
| **Grafik Konsumsi Harian**    | ❌       | ✅      | ✅         | ❌      | ✅              |
| **Review Reports**            | ❌       | ✅      | ✅         | ❌      | ❌              |
| **Manage Pola Konsumsi**      | ❌       | ✅      | ✅         | ❌      | ❌              |
| **Log Aktivitas Sistem**      | ❌       | ✅      | ✅         | ✅      | ❌              |
| **Aturan Otomatis (IF-THEN)** | ❌       | ✅      | ✅         | ❌      | ❌              |
| **Atur Hak Akses**            | ❌       | ❌      | ✅         | ❌      | ❌              |
| **Rooms Management**          | ❌       | ❌      | ✅         | ❌      | ❌              |
| **Devices Management**        | ❌       | ❌      | ✅         | ❌      | ❌              |
| **Maintenance Hardware**      | ❌       | ❌      | ❌         | ✅      | ❌              |
| **Device Control**            | ❌       | ❌      | ✅         | ✅      | ❌              |
| **Notifikasi Anomali**        | ❌       | ❌      | ✅         | ✅      | ❌              |
| **Jadwal Pemeriksaan**        | ❌       | ❌      | ❌         | ✅      | ❌              |

---

## 🔑 Login Credentials

**Test Accounts**:

```
Pimpinan Institut:
  Email: pimpinan@itpln.ac.id
  Password: pimpinan123

Manajer:
  Email: manajer@itpln.ac.id
  Password: manajer123

Staf Admin:
  Email: admin@itpln.ac.id
  Password: admin123

Teknisi:
  Email: teknisi@itpln.ac.id
  Password: teknisi123

Mahasiswa/Dosen:
  Email: [any]@itpln.ac.id
  Password: mahasiswa123
```

---

## 🎨 Role Badge Colors

| Role              | Color     | Hex                                |
| ----------------- | --------- | ---------------------------------- |
| Pimpinan Institut | 🟡 Yellow | `bg-yellow-500/10 text-yellow-700` |
| Manajer           | 🟣 Purple | `bg-purple-500/10 text-purple-700` |
| Staf Admin        | 🔴 Red    | `bg-red-500/10 text-red-700`       |
| Teknisi           | 🔵 Blue   | `bg-blue-500/10 text-blue-700`     |
| Mahasiswa/Dosen   | 🟢 Green  | `bg-green-500/10 text-green-700`   |

---

## 📁 Related Files

**Type Definitions**:

- `src/types/index.ts` - UserRole type definition

**Configuration**:

- `src/config/auth.ts` - Role permissions & mock users

**Services**:

- `src/services/authService.ts` - Authentication logic

**Components**:

- `src/components/auth/ProtectedRoute.tsx` - Route protection
- `src/components/dashboard/Sidebar.tsx` - Dynamic menu based on role

---

## 🔄 Permission System

### Module-Action Permission

Setiap role memiliki akses berdasarkan **module** dan **action**:

```typescript
type Action = 'view' | 'create' | 'edit' | 'delete' | 'control';

interface Permission {
  module: string;
  actions: Action[];
}
```

### Helper Functions

```typescript
// Check single permission
hasPermission(userRole, 'dashboard', 'view'); // true/false

// Check simple permission string
hasSimplePermission(userRole, 'reports.create'); // true/false

// Check route access
canAccessRoute(userRole, '/monitoring'); // true/false
```

---

## 🚀 Use Case Mapping

### Dashboard (All Roles)

- Accessible by: **Semua role** ✅
- Route: `/`

### Monitoring Laporan (Pimpinan, Manajer, Admin, Teknisi)

- Accessible by: **Pimpinan, Manajer, Staf Admin, Teknisi**
- Route: `/monitoring`

### View Dashboard Energi (Manajer, Admin, Mahasiswa)

- Accessible by: **Manajer, Staf Admin, Mahasiswa/Dosen**
- Route: `/analytics`

### Rooms & Devices Management (Admin Only)

- Accessible by: **Staf Admin** only
- Routes: `/rooms-management`, `/devices-management`

### Aturan Otomatis IF-THEN (Manajer, Admin)

- Accessible by: **Manajer, Staf Admin**
- Route: `/automation`

---

## ✅ Testing Checklist

- [x] Role Pimpinan ditambahkan ke type system
- [x] MOCK_USERS updated dengan user pimpinan
- [x] MOCK_PASSWORDS updated dengan password pimpinan
- [x] ROLE_PERMISSIONS disesuaikan dengan use case diagram
- [x] Manajer permissions sesuai dengan use case (analytics, reports, monitoring, automation)
- [x] authService.ts mengenali email pimpinan
- [x] getRoleDisplayName updated
- [x] getRoleBadgeColor updated dengan warna pimpinan
- [x] No TypeScript errors

---

**Document Version**: 1.1.0  
**Last Updated**: December 10, 2025  
**Based On**: Use Case Diagram SIMEL v2.0
