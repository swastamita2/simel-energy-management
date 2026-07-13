import { useCallback, useEffect, useState } from 'react';
import {
  AdminDevice,
  CreateDevicePayload,
  UpdateDevicePayload,
  monitoringService,
} from '@/services/monitoringService';

interface CrudResult<T = null> {
  success: boolean;
  data?: T;
  error?: string;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
};

export const useAdminDevices = () => {
  const [devices, setDevices] = useState<AdminDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadDevices = useCallback(async (): Promise<CrudResult<AdminDevice[]>> => {
    try {
      setIsLoading(true);
      const response = await monitoringService.getDevices();

      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Failed to load devices',
        };
      }

      const data = response.data || [];
      setDevices(data);

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error, 'Failed to load devices'),
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDevices();
  }, [loadDevices]);

  const createDevice = useCallback(async (payload: CreateDevicePayload): Promise<CrudResult<AdminDevice>> => {
    try {
      setIsSubmitting(true);
      const response = await monitoringService.createDevice(payload);

      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error || 'Failed to add device',
        };
      }

      setDevices((prev) => [...prev, response.data]);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error, 'Failed to add device'),
      };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const updateDevice = useCallback(async (id: number, payload: UpdateDevicePayload): Promise<CrudResult<AdminDevice>> => {
    try {
      setIsSubmitting(true);
      const response = await monitoringService.updateDevice(id, payload);

      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error || 'Failed to update device',
        };
      }

      setDevices((prev) => prev.map((device) => (device.id === id ? response.data : device)));

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error, 'Failed to update device'),
      };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const deleteDevice = useCallback(async (id: number): Promise<CrudResult> => {
    try {
      setIsSubmitting(true);
      const response = await monitoringService.deleteDevice(id);

      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Failed to delete device',
        };
      }

      setDevices((prev) => prev.filter((device) => device.id !== id));

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error, 'Failed to delete device'),
      };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    devices,
    isLoading,
    isSubmitting,
    loadDevices,
    createDevice,
    updateDevice,
    deleteDevice,
  };
};
