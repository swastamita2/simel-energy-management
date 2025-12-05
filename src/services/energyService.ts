import { api } from './api';
import {
  ApiResponse,
  RealtimeData,
  WeeklyData,
  DashboardStats,
} from '@/types';

// Mock data (akan digunakan jika VITE_ENABLE_MOCK_DATA=true)
const mockRealtimeData: RealtimeData[] = [
  { time: "00:00", consumption: 245, efficiency: 92 },
  { time: "04:00", consumption: 189, efficiency: 95 },
  { time: "08:00", consumption: 312, efficiency: 88 },
  { time: "12:00", consumption: 398, efficiency: 85 },
  { time: "16:00", consumption: 425, efficiency: 82 },
  { time: "20:00", consumption: 367, efficiency: 87 },
];

const mockWeeklyData: WeeklyData[] = [
  { time: "Mon", consumption: 2840 },
  { time: "Tue", consumption: 2920 },
  { time: "Wed", consumption: 2650 },
  { time: "Thu", consumption: 2890 },
  { time: "Fri", consumption: 3120 },
  { time: "Sat", consumption: 1850 },
  { time: "Sun", consumption: 1640 },
];

const mockDashboardStats: DashboardStats = {
  realtimeConsumption: 367,
  efficiencyRate: 87,
  costSavings: 2400000,
  carbonReduction: 124,
  activeDevices: 248,
  totalDevices: 280,
  alerts: 3,
};

export const energyService = {
  // Get real-time energy consumption data
  getRealtimeData: async (): Promise<ApiResponse<RealtimeData[]>> => {
    if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: mockRealtimeData,
          });
        }, 500);
      });
    }
    return api.get<ApiResponse<RealtimeData[]>>('/energy/realtime');
  },

  // Get weekly consumption data
  getWeeklyData: async (): Promise<ApiResponse<WeeklyData[]>> => {
    if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: mockWeeklyData,
          });
        }, 500);
      });
    }
    return api.get<ApiResponse<WeeklyData[]>>('/energy/weekly');
  },

  // Get dashboard statistics
  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: mockDashboardStats,
          });
        }, 500);
      });
    }
    return api.get<ApiResponse<DashboardStats>>('/energy/stats');
  },

  // Get historical data with date range
  getHistoricalData: async (startDate: string, endDate: string) => {
    return api.get(`/energy/historical`, {
      params: { startDate, endDate },
    });
  },

  // Export energy data
  exportData: async (format: 'csv' | 'xlsx', startDate: string, endDate: string) => {
    return api.get(`/energy/export`, {
      params: { format, startDate, endDate },
      responseType: 'blob',
    });
  },
};
