// Application Constants

export const APP_NAME = 'Energy Management Dashboard';
export const APP_VERSION = '1.0.0';

// API Endpoints
export const API_ENDPOINTS = {
  ENERGY: {
    REALTIME: '/energy/realtime',
    WEEKLY: '/energy/weekly',
    HISTORICAL: '/energy/historical',
    STATS: '/energy/stats',
    EXPORT: '/energy/export',
  },
  MONITORING: {
    ROOMS: '/monitoring/rooms',
    DEVICES: '/monitoring/devices',
    OVERVIEW: '/monitoring/overview',
  },
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  REPORTS: {
    LIST: '/reports',
    GENERATE: '/reports/generate',
    DOWNLOAD: '/reports/download',
  },
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    UPDATE: '/users',
    DELETE: '/users',
  },
  SETTINGS: {
    GET: '/settings',
    UPDATE: '/settings',
  },
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  MONITORING: '/monitoring',
  ANALYTICS: '/analytics',
  REPORTS: '/reports',
  USERS: '/users',
  SETTINGS: '/settings',
  LOGIN: '/login',
  NOT_FOUND: '/404',
} as const;

// Refresh Intervals (milliseconds)
export const REFRESH_INTERVALS = {
  REALTIME: 5000,      // 5 seconds
  DASHBOARD: 30000,    // 30 seconds
  MONITORING: 10000,   // 10 seconds
  ANALYTICS: 60000,    // 1 minute
} as const;

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: 'hsl(var(--primary))',
  SUCCESS: 'hsl(var(--success))',
  WARNING: 'hsl(var(--warning))',
  DESTRUCTIVE: 'hsl(var(--destructive))',
  MUTED: 'hsl(var(--muted))',
  CONSUMPTION: '#8884d8',
  EFFICIENCY: '#82ca9d',
  TEMPERATURE: '#ffc658',
  POWER: '#ff7c7c',
} as const;

// Status Colors
export const STATUS_COLORS = {
  normal: 'success',
  warning: 'warning',
  alert: 'destructive',
  offline: 'secondary',
} as const;

// Device Types
export const DEVICE_TYPES = {
  LIGHT: 'light',
  AC: 'ac',
  PROJECTOR: 'projector',
  OTHER: 'other',
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  OPERATOR: 'operator',
  VIEWER: 'viewer',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// Thresholds
export const THRESHOLDS = {
  CONSUMPTION: {
    NORMAL: 50,
    WARNING: 70,
    ALERT: 90,
  },
  TEMPERATURE: {
    MIN: 18,
    MAX: 28,
    OPTIMAL: 24,
  },
  EFFICIENCY: {
    EXCELLENT: 90,
    GOOD: 75,
    FAIR: 60,
  },
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'dd MMM yyyy',
  DISPLAY_WITH_TIME: 'dd MMM yyyy HH:mm',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  API: 'yyyy-MM-dd',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access forbidden.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An internal server error occurred.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  TIMEOUT: 'Request timeout. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Successfully logged in!',
  LOGOUT: 'Successfully logged out!',
  SAVE: 'Changes saved successfully!',
  CREATE: 'Created successfully!',
  UPDATE: 'Updated successfully!',
  DELETE: 'Deleted successfully!',
  DEVICE_ON: 'Device turned on',
  DEVICE_OFF: 'Device turned off',
} as const;
