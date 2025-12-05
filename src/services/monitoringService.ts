import { api } from './api';
import { ApiResponse, Room, Device, MonitoringOverview } from '@/types';

// Mock data
const mockRooms: Room[] = [
  { id: 1, name: "Lab Komputer 1", building: "Gedung A - Lt. 2", consumption: 4.2, temperature: 24, devicesOn: 18, totalDevices: 20, status: "normal" },
  { id: 2, name: "Ruang Kuliah 201", building: "Gedung A - Lt. 2", consumption: 3.8, temperature: 26, devicesOn: 12, totalDevices: 15, status: "normal" },
  { id: 3, name: "Lab Elektronika", building: "Gedung B - Lt. 1", consumption: 8.5, temperature: 28, devicesOn: 24, totalDevices: 25, status: "warning" },
  { id: 4, name: "Auditorium", building: "Gedung C", consumption: 12.4, temperature: 23, devicesOn: 32, totalDevices: 35, status: "alert" },
  { id: 5, name: "Perpustakaan", building: "Gedung D - Lt. 1", consumption: 5.6, temperature: 25, devicesOn: 28, totalDevices: 30, status: "normal" },
  { id: 6, name: "Kantor Dosen", building: "Gedung A - Lt. 3", consumption: 2.1, temperature: 26, devicesOn: 8, totalDevices: 12, status: "normal" },
];

const mockDevices: Device[] = [
  { id: 1, name: "LED Panel 1", type: "light", room: "Lab Komputer 1", status: "on", power: 120 },
  { id: 2, name: "AC Unit 1", type: "ac", room: "Lab Komputer 1", status: "on", power: 850 },
  { id: 3, name: "Projector", type: "projector", room: "Ruang Kuliah 201", status: "on", power: 280 },
  { id: 4, name: "LED Panel 2", type: "light", room: "Ruang Kuliah 201", status: "off", power: 0 },
  { id: 5, name: "AC Unit 2", type: "ac", room: "Lab Elektronika", status: "on", power: 920 },
  { id: 6, name: "Exhaust Fan", type: "other", room: "Lab Elektronika", status: "offline", power: 0 },
];

export const monitoringService = {
  // Get all rooms
  getRooms: async (): Promise<ApiResponse<Room[]>> => {
    if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: mockRooms,
          });
        }, 500);
      });
    }
    return api.get<ApiResponse<Room[]>>('/monitoring/rooms');
  },

  // Get room by ID
  getRoomById: async (id: number): Promise<ApiResponse<Room>> => {
    if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
      return new Promise((resolve) => {
        const room = mockRooms.find(r => r.id === id);
        setTimeout(() => {
          resolve({
            success: true,
            data: room!,
          });
        }, 300);
      });
    }
    return api.get<ApiResponse<Room>>(`/monitoring/rooms/${id}`);
  },

  // Get all devices
  getDevices: async (): Promise<ApiResponse<Device[]>> => {
    if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: mockDevices,
          });
        }, 500);
      });
    }
    return api.get<ApiResponse<Device[]>>('/monitoring/devices');
  },

  // Get devices by room
  getDevicesByRoom: async (roomId: number): Promise<ApiResponse<Device[]>> => {
    if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
      const room = mockRooms.find(r => r.id === roomId);
      const devices = room ? mockDevices.filter(d => d.room === room.name) : [];
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: devices,
          });
        }, 300);
      });
    }
    return api.get<ApiResponse<Device[]>>(`/monitoring/rooms/${roomId}/devices`);
  },

  // Toggle device
  toggleDevice: async (deviceId: number, status: 'on' | 'off'): Promise<ApiResponse<Device>> => {
    if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
      return new Promise((resolve) => {
        setTimeout(() => {
          const device = mockDevices.find(d => d.id === deviceId);
          resolve({
            success: true,
            data: { ...device!, status },
          });
        }, 300);
      });
    }
    return api.patch<ApiResponse<Device>>(`/monitoring/devices/${deviceId}`, { status });
  },

  // Toggle room (all devices in room)
  toggleRoom: async (roomId: number, enabled: boolean): Promise<ApiResponse<Room>> => {
    if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
      return new Promise((resolve) => {
        setTimeout(() => {
          const room = mockRooms.find(r => r.id === roomId);
          resolve({
            success: true,
            data: room!,
          });
        }, 300);
      });
    }
    return api.patch<ApiResponse<Room>>(`/monitoring/rooms/${roomId}`, { enabled });
  },

  // Get monitoring overview
  getOverview: async (): Promise<ApiResponse<MonitoringOverview>> => {
    if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              totalConsumption: 36.6,
              peakLoad: 42.8,
              efficiencyScore: 87,
              rooms: mockRooms,
              devices: mockDevices,
            },
          });
        }, 500);
      });
    }
    return api.get<ApiResponse<MonitoringOverview>>('/monitoring/overview');
  },
};
