import { api } from './api';
import { ApiResponse, Room, Device, DeviceType, DeviceStatus, MonitoringOverview } from '@/types';

export type AdminRoom = Room;

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

export interface AdminDevice extends Device {
  building: string;
  maxPower: number;
  temperature?: number;
}

export interface CreateDevicePayload {
  name: string;
  type: DeviceType;
  room: string;
  building: string;
  maxPower: number;
  status: 'on' | 'off';
  temperature?: number;
}

export interface UpdateDevicePayload {
  name?: string;
  type?: DeviceType;
  room?: string;
  building?: string;
  maxPower?: number;
  status?: DeviceStatus;
  temperature?: number;
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

const mockDevices: AdminDevice[] = [
  { id: 1, name: "LED Panel 1", type: "light", room: "Lab Komputer 1", building: "Gedung A - Lt. 2", status: "on", power: 120, maxPower: 300 },
  { id: 2, name: "AC Unit 1", type: "ac", room: "Lab Komputer 1", building: "Gedung A - Lt. 2", status: "on", power: 850, maxPower: 1500, temperature: 24 },
  { id: 3, name: "Projector", type: "projector", room: "Ruang Kuliah 201", building: "Gedung A - Lt. 2", status: "on", power: 280, maxPower: 500 },
  { id: 4, name: "LED Panel 2", type: "light", room: "Ruang Kuliah 201", building: "Gedung A - Lt. 2", status: "off", power: 0, maxPower: 300 },
  { id: 5, name: "AC Unit 2", type: "ac", room: "Lab Elektronika", building: "Gedung B - Lt. 1", status: "on", power: 920, maxPower: 1500, temperature: 23 },
  { id: 6, name: "Exhaust Fan", type: "other", room: "Lab Elektronika", building: "Gedung B - Lt. 1", status: "offline", power: 0, maxPower: 1000 },
];

const recalculateRoomMetrics = (roomName: string) => {
  const roomIndex = mockRooms.findIndex((room) => room.name === roomName);
  if (roomIndex === -1) return;

  const roomDevices = mockDevices.filter((device) => device.room === roomName);
  const devicesOn = roomDevices.filter((device) => device.status === 'on').length;
  const totalDevices = roomDevices.length;
  const consumptionWatts = roomDevices.reduce(
    (sum, device) => sum + (device.status === 'on' ? device.power : 0),
    0,
  );
  const consumption = Number((consumptionWatts / 1000).toFixed(1));

  mockRooms[roomIndex] = {
    ...mockRooms[roomIndex],
    devicesOn,
    totalDevices,
    consumption,
    enabled: mockRooms[roomIndex].enabled && devicesOn > 0,
    status: consumption > 10 ? 'alert' : consumption > 7 ? 'warning' : 'normal',
  };
};

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
          if (!room) {
            resolve({
              success: false,
              data: {} as AdminRoom,
              error: 'Room not found',
            });
            return;
          }

          resolve({
            success: true,
            data: room,
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

    return api.put<ApiResponse<AdminRoom>>(`/monitoring/rooms/${id}`, payload);
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
  getDevices: async (): Promise<ApiResponse<AdminDevice[]>> => {
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
    return api.get<ApiResponse<AdminDevice[]>>('/monitoring/devices');
  },

  // Get devices by room
  getDevicesByRoom: async (roomId: number): Promise<ApiResponse<AdminDevice[]>> => {
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
    return api.get<ApiResponse<AdminDevice[]>>(`/monitoring/rooms/${roomId}/devices`);
  },

  // Create device
  createDevice: async (payload: CreateDevicePayload): Promise<ApiResponse<AdminDevice>> => {
    if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newId = mockDevices.length > 0 ? Math.max(...mockDevices.map((d) => d.id)) + 1 : 1;
          const safeMaxPower = Math.max(1, payload.maxPower);
          const newDevice: AdminDevice = {
            id: newId,
            name: payload.name,
            type: payload.type,
            room: payload.room,
            building: payload.building,
            maxPower: safeMaxPower,
            status: payload.status,
            power: payload.status === 'on' ? Math.round(safeMaxPower * 0.8) : 0,
            temperature: payload.temperature,
          };

          mockDevices.push(newDevice);
          recalculateRoomMetrics(newDevice.room);

          resolve({
            success: true,
            data: newDevice,
          });
        }, 300);
      });
    }

    return api.post<ApiResponse<AdminDevice>>('/monitoring/devices', payload);
  },

  // Update device
  updateDevice: async (id: number, payload: UpdateDevicePayload): Promise<ApiResponse<AdminDevice>> => {
    if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
      return new Promise((resolve) => {
        setTimeout(() => {
          const deviceIndex = mockDevices.findIndex((device) => device.id === id);
          if (deviceIndex === -1) {
            resolve({
              success: false,
              data: {} as AdminDevice,
              error: 'Device not found',
            });
            return;
          }

          const currentDevice = mockDevices[deviceIndex];
          const nextMaxPower = payload.maxPower ?? currentDevice.maxPower;
          const nextStatus = payload.status ?? currentDevice.status;

          const updatedDevice: AdminDevice = {
            ...currentDevice,
            ...payload,
            maxPower: Math.max(1, nextMaxPower),
            status: nextStatus,
            power:
              nextStatus === 'on'
                ? Math.min(currentDevice.power || Math.round(nextMaxPower * 0.8), nextMaxPower)
                : 0,
          };

          mockDevices[deviceIndex] = updatedDevice;
          recalculateRoomMetrics(currentDevice.room);
          if (updatedDevice.room !== currentDevice.room) {
            recalculateRoomMetrics(updatedDevice.room);
          }

          resolve({
            success: true,
            data: updatedDevice,
          });
        }, 300);
      });
    }

    return api.patch<ApiResponse<AdminDevice>>(`/monitoring/devices/${id}`, payload);
  },

  // Delete device
  deleteDevice: async (id: number): Promise<ApiResponse<null>> => {
    if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
      return new Promise((resolve) => {
        setTimeout(() => {
          const deviceIndex = mockDevices.findIndex((device) => device.id === id);
          if (deviceIndex === -1) {
            resolve({
              success: false,
              data: null,
              error: 'Device not found',
            });
            return;
          }

          const roomName = mockDevices[deviceIndex].room;
          mockDevices.splice(deviceIndex, 1);
          recalculateRoomMetrics(roomName);

          resolve({
            success: true,
            data: null,
          });
        }, 300);
      });
    }

    return api.delete<ApiResponse<null>>(`/monitoring/devices/${id}`);
  },

  // Toggle device
  toggleDevice: async (deviceId: number, status: 'on' | 'off'): Promise<ApiResponse<AdminDevice>> => {
    if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
      return new Promise((resolve) => {
        setTimeout(() => {
          const deviceIndex = mockDevices.findIndex((d) => d.id === deviceId);
          if (deviceIndex === -1) {
            resolve({
              success: false,
              data: {} as AdminDevice,
              error: 'Device not found',
            });
            return;
          }

          const updatedDevice: AdminDevice = {
            ...mockDevices[deviceIndex],
            status,
            power: status === 'on' ? Math.round(mockDevices[deviceIndex].maxPower * 0.8) : 0,
          };
          mockDevices[deviceIndex] = updatedDevice;
          recalculateRoomMetrics(updatedDevice.room);

          resolve({
            success: true,
            data: updatedDevice,
          });
        }, 300);
      });
    }
    return api.patch<ApiResponse<AdminDevice>>(`/monitoring/devices/${deviceId}`, { status });
  },

  // Toggle room (all devices in room)
  toggleRoom: async (roomId: number, enabled: boolean): Promise<ApiResponse<AdminRoom>> => {
    if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
      return new Promise((resolve) => {
        setTimeout(() => {
          const roomIndex = mockRooms.findIndex((r) => r.id === roomId);
          if (roomIndex === -1) {
            resolve({
              success: false,
              data: {} as AdminRoom,
              error: 'Room not found',
            });
            return;
          }

          const room = mockRooms[roomIndex];
          const roomDevices = mockDevices.filter((device) => device.room === room.name);
          roomDevices.forEach((device, index) => {
            const targetStatus = enabled ? 'on' : 'off';
            const targetPower = enabled ? Math.round(device.maxPower * 0.8) : 0;
            const originalIndex = mockDevices.findIndex((d) => d.id === device.id);
            if (originalIndex !== -1) {
              mockDevices[originalIndex] = {
                ...roomDevices[index],
                status: targetStatus,
                power: targetPower,
              };
            }
          });

          recalculateRoomMetrics(room.name);
          mockRooms[roomIndex] = {
            ...mockRooms[roomIndex],
            enabled,
          };

          resolve({
            success: true,
            data: mockRooms[roomIndex],
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
