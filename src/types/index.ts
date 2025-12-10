// Common Types
export type Status = 'normal' | 'warning' | 'alert' | 'offline';
export type DeviceType = 'light' | 'ac' | 'projector' | 'other';
export type DeviceStatus = 'on' | 'off' | 'offline';

// Energy Data Types
export interface EnergyData {
  time: string;
  consumption: number;
  efficiency?: number;
}

export interface RealtimeData extends EnergyData {
  efficiency: number;
}

export interface WeeklyData {
  time: string;
  consumption: number;
}

// KPI Types
export interface KPIData {
  title: string;
  value: string | number;
  unit?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

// Room Types
export interface Room {
  id: number;
  name: string;
  building: string;
  consumption: number;
  temperature: number;
  devicesOn: number;
  totalDevices: number;
  status: Status;
}

// Device Types
export interface Device {
  id: number;
  name: string;
  type: DeviceType;
  room: string;
  status: DeviceStatus;
  power: number;
  lastUpdate?: string;
}

// Chart Types
export interface ChartData {
  [key: string]: string | number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// User Types
export type UserRole = 'admin' | 'pimpinan' | 'manajer' | 'teknisi' | 'mahasiswa';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

// Permission Types
export interface Permission {
  module: string;
  actions: ('view' | 'create' | 'edit' | 'delete' | 'control')[];
}

// Permission string type for simplified checks (e.g., "dashboard.view")
export type PermissionString = 
  | 'dashboard.view'
  | 'monitoring.view'
  | 'monitoring.control'
  | 'analytics.view'
  | 'reports.view'
  | 'reports.create'
  | 'reports.edit'
  | 'reports.delete'
  | 'users.view'
  | 'users.create'
  | 'users.edit'
  | 'users.delete'
  | 'settings.view'
  | 'settings.edit'
  | 'devices.view'
  | 'devices.control'
  | 'automation.view'
  | 'automation.create'
  | 'automation.edit'
  | 'automation.delete'
  | 'maintenance.view'
  | 'maintenance.edit'
  | 'notifications.view'
  | 'consumption.view'
  | 'consumption.edit'
  | 'analytics.view';

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
  routes: string[];
}

// Auth Types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse extends ApiResponse<AuthTokens> {
  user: User;
}

// Dashboard Types
export interface DashboardStats {
  realtimeConsumption: number;
  efficiencyRate: number;
  costSavings: number;
  carbonReduction: number;
  activeDevices: number;
  totalDevices: number;
  alerts: number;
}

// Monitoring Types
export interface MonitoringOverview {
  totalConsumption: number;
  peakLoad: number;
  efficiencyScore: number;
  rooms: Room[];
  devices: Device[];
}

// Report Types
export interface Report {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  createdAt: string;
  createdBy: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
}

// Settings Types
export interface Settings {
  general: {
    siteName: string;
    timezone: string;
    language: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  thresholds: {
    consumption: number;
    temperature: number;
    efficiency: number;
  };
  automation: {
    enabled: boolean;
    rules: AutomationRule[];
  };
}

export interface AutomationRule {
  id: string;
  name: string;
  enabled: boolean;
  condition: string;
  action: string;
}

// Notification Types
export type NotificationType = 'info' | 'warning' | 'alert' | 'success';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

// Search Types
export interface SearchResult {
  id: string;
  type: 'room' | 'device' | 'report' | 'page';
  title: string;
  subtitle?: string;
  icon?: string;
  url: string;
  metadata?: Record<string, any>;
}
