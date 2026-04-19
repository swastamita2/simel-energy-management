import { useCallback, useEffect, useMemo, useState } from 'react';
import { AdminDevice, AdminRoom, monitoringService } from '@/services/monitoringService';

interface ActionResult {
  success: boolean;
  error?: string;
}

interface MonitoringStats {
  totalConsumption: number;
  peakLoad: number;
  activeDevices: number;
  totalDevices: number;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
};

export const useMonitoringDashboard = () => {
  const [rooms, setRooms] = useState<AdminRoom[]>([]);
  const [devices, setDevices] = useState<AdminDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = useCallback(async (showLoader = true): Promise<ActionResult> => {
    try {
      if (showLoader) {
        setIsLoading(true);
      }

      const [roomsResponse, devicesResponse] = await Promise.all([
        monitoringService.getRooms(),
        monitoringService.getDevices(),
      ]);

      if (!roomsResponse.success) {
        return {
          success: false,
          error: roomsResponse.error || 'Failed to load rooms',
        };
      }

      if (!devicesResponse.success) {
        return {
          success: false,
          error: devicesResponse.error || 'Failed to load devices',
        };
      }

      setRooms(roomsResponse.data || []);
      setDevices(devicesResponse.data || []);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error, 'Failed to load monitoring data'),
      };
    } finally {
      if (showLoader) {
        setIsLoading(false);
      }
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadData(true);
  }, [loadData]);

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    return loadData(false);
  }, [loadData]);

  const toggleRoom = useCallback(
    async (roomId: number, enabled: boolean): Promise<ActionResult> => {
      try {
        const response = await monitoringService.toggleRoom(roomId, enabled);
        if (!response.success) {
          return {
            success: false,
            error: response.error || 'Failed to update room status',
          };
        }

        const refreshResult = await loadData(false);
        return refreshResult.success
          ? { success: true }
          : {
              success: false,
              error: refreshResult.error,
            };
      } catch (error) {
        return {
          success: false,
          error: getErrorMessage(error, 'Failed to update room status'),
        };
      }
    },
    [loadData],
  );

  const toggleDevice = useCallback(
    async (deviceId: number, enabled: boolean): Promise<ActionResult> => {
      try {
        const response = await monitoringService.toggleDevice(deviceId, enabled ? 'on' : 'off');
        if (!response.success) {
          return {
            success: false,
            error: response.error || 'Failed to update device status',
          };
        }

        const refreshResult = await loadData(false);
        return refreshResult.success
          ? { success: true }
          : {
              success: false,
              error: refreshResult.error,
            };
      } catch (error) {
        return {
          success: false,
          error: getErrorMessage(error, 'Failed to update device status'),
        };
      }
    },
    [loadData],
  );

  const updateDevicePower = useCallback(
    async (deviceId: number, power: number): Promise<ActionResult> => {
      try {
        const target = devices.find((device) => device.id === deviceId);
        if (!target || target.status === 'offline') {
          return { success: false, error: 'Device not available for power control' };
        }

        const boundedPower = Math.max(0, Math.min(power, target.maxPower));
        const response = await monitoringService.updateDevice(deviceId, {
          power: boundedPower,
          status: boundedPower > 0 ? 'on' : 'off',
        });

        if (!response.success) {
          return {
            success: false,
            error: response.error || 'Failed to update device power',
          };
        }

        const refreshResult = await loadData(false);
        return refreshResult.success
          ? { success: true }
          : {
              success: false,
              error: refreshResult.error,
            };
      } catch (error) {
        return {
          success: false,
          error: getErrorMessage(error, 'Failed to update device power'),
        };
      }
    },
    [devices, loadData],
  );

  const stats = useMemo<MonitoringStats>(() => {
    const totalConsumption = Number(
      rooms.reduce((sum, room) => sum + room.consumption, 0).toFixed(1),
    );
    const peakLoad = Number(Math.max(...rooms.map((room) => room.consumption), 0).toFixed(1));
    const activeDevices = devices.filter((device) => device.status === 'on').length;

    return {
      totalConsumption,
      peakLoad,
      activeDevices,
      totalDevices: devices.length,
    };
  }, [devices, rooms]);

  return {
    rooms,
    devices,
    stats,
    isLoading,
    isRefreshing,
    refreshData,
    toggleRoom,
    toggleDevice,
    updateDevicePower,
  };
};
