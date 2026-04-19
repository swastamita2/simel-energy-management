import { api } from './api';
import { ApiResponse, Room, Device, MonitoringOverview } from '@/types';

export interface AdminRoom extends Room {
  enabled?: boolean;
}

export interface CreateRoomPayload {
  name: string;
  building: string;
  enabled?: boolean;
}

export interface UpdateRoomPayload {
  name?: string;
  building?: string;
  enabled?: boolean;
}

// Mock data
const mockRooms: AdminRoom[] = [
  { id: 1, name: "Lab Komputer 1", building: "Gedung A - Lt. 2", consumption: 4.2, temperature: 24, devicesOn: 18, totalDevices: 20, status: "normal", enabled: true },
  { id: 2, name: "Ruang Kuliah 201", building: "Gedung A - Lt. 2", consumption: 3.8, temperature: 26, devicesOn: 12, totalDevices: 15, status: "normal", enabled: true },
  { id: 3, name: "Lab Elektronika", building: "Gedung B - Lt. 1", consumption: 8.5, temperature: 28, devicesOn: 24, totalDevices: 25, status: "warning", enabled: true },
  { id: 4, name: "Auditorium", building: "Gedung C", consumption: 12.4, temperature: 23, devicesOn: 32, totalDevices: 35, status: "alert", enabled: true },
  { id: 5, name: "Perpustakaan", building: "Gedung D - Lt. 1", consumption: 5.6, temperature: 25, devicesOn: 28, totalDevices: 30, status: "normal", enabled: true },
  { id: 6, name: "Kantor Dosen", building: "Gedung A - Lt. 3", consumption: 2.1, temperature: 26, devicesOn: 8, totalDevices: 12, status: "normal", enabled: true },
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
  getRooms: async (): Promise<ApiResponse<AdminRoom[]>> => {
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
    return api.get<ApiResponse<AdminRoom[]>>('/monitoring/rooms');
  },

  // Get room by ID
  getRoomById: async (id: number): Promise<ApiResponse<AdminRoom>> => {
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
    return api.get<ApiResponse<AdminRoom>>(`/monitoring/rooms/${id}`);
  },

  // Create room
  createRoom: async (payload: CreateRoomPayload): Promise<ApiResponse<AdminRoom>> => {
    if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newId = mockRooms.length > 0 ? Math.max(...mockRooms.map((r) => r.id)) + 1 : 1;
          const newRoom: AdminRoom = {
            id: newId,
            name: payload.name,
            building: payload.building,
            enabled: payload.enabled ?? true,
            consumption: 0,
            temperature: 24,
            devicesOn: 0,
            totalDevices: 0,
            status: 'normal',
          };
          mockRooms.push(newRoom);

          resolve({
            success: true,
            data: newRoom,
          });
        }, 300);
      });
    }

    return api.post<ApiResponse<AdminRoom>>('/monitoring/rooms', payload);
  },

  // Update room
  updateRoom: async (id: number, payload: UpdateRoomPayload): Promise<ApiResponse<AdminRoom>> => {
    if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
      return new Promise((resolve) => {
        setTimeout(() => {
          const roomIndex = mockRooms.findIndex((r) => r.id === id);
          if (roomIndex === -1) {
            resolve({
              success: false,
              data: {} as AdminRoom,
              error: 'Room not found',
            });
            return;
          }

          const existingRoom = mockRooms[roomIndex];
          const updatedRoom: AdminRoom = {
            ...existingRoom,
            ...payload,
          };
          mockRooms[roomIndex] = updatedRoom;

          resolve({
            success: true,
            data: updatedRoom,
          });
        }, 300);
      });
    }

    return api.patch<ApiResponse<AdminRoom>>(`/monitoring/rooms/${id}`, payload);
  },

  // Delete room
  deleteRoom: async (id: number): Promise<ApiResponse<null>> => {
    if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
      return new Promise((resolve) => {
        setTimeout(() => {
          const roomIndex = mockRooms.findIndex((r) => r.id === id);
          if (roomIndex === -1) {
            resolve({
              success: false,
              data: null,
              error: 'Room not found',
            });
            return;
          }

          const room = mockRooms[roomIndex];
          mockRooms.splice(roomIndex, 1);

          // Keep mock data consistent by removing devices that belong to deleted room.
          for (let i = mockDevices.length - 1; i >= 0; i--) {
            if (mockDevices[i].room === room.name) {
              mockDevices.splice(i, 1);
            }
          }

          resolve({
            success: true,
            data: null,
          });
        }, 300);
      });
    }

    return api.delete<ApiResponse<null>>(`/monitoring/rooms/${id}`);
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
  toggleRoom: async (roomId: number, enabled: boolean): Promise<ApiResponse<AdminRoom>> => {
    if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
      return new Promise((resolve) => {
        setTimeout(() => {
          const room = mockRooms.find(r => r.id === roomId);
          resolve({
            success: true,
            data: room ? { ...room, enabled } : ({} as AdminRoom),
          });
        }, 300);
      });
    }
    return api.patch<ApiResponse<AdminRoom>>(`/monitoring/rooms/${roomId}`, { enabled });
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
