import { useCallback, useEffect, useState } from 'react';
import {
  AdminRoom,
  CreateRoomPayload,
  UpdateRoomPayload,
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

export const useAdminRooms = () => {
  const [rooms, setRooms] = useState<AdminRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadRooms = useCallback(async (): Promise<CrudResult<AdminRoom[]>> => {
    try {
      setIsLoading(true);
      const response = await monitoringService.getRooms();

      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Failed to load rooms',
        };
      }

      const roomData = response.data || [];
      setRooms(roomData);

      return {
        success: true,
        data: roomData,
      };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error, 'Failed to load rooms'),
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRooms();
  }, [loadRooms]);

  const createRoom = useCallback(async (payload: CreateRoomPayload): Promise<CrudResult<AdminRoom>> => {
    try {
      setIsSubmitting(true);
      const response = await monitoringService.createRoom(payload);

      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error || 'Failed to add room',
        };
      }

      setRooms((prev) => [...prev, response.data]);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error, 'Failed to add room'),
      };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const updateRoom = useCallback(async (id: number, payload: UpdateRoomPayload): Promise<CrudResult<AdminRoom>> => {
    try {
      setIsSubmitting(true);
      const response = await monitoringService.updateRoom(id, payload);

      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error || 'Failed to update room',
        };
      }

      setRooms((prev) => prev.map((room) => (room.id === id ? response.data : room)));

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error, 'Failed to update room'),
      };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const deleteRoom = useCallback(async (id: number): Promise<CrudResult> => {
    try {
      setIsSubmitting(true);
      const response = await monitoringService.deleteRoom(id);

      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Failed to delete room',
        };
      }

      setRooms((prev) => prev.filter((room) => room.id !== id));

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error, 'Failed to delete room'),
      };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    rooms,
    isLoading,
    isSubmitting,
    loadRooms,
    createRoom,
    updateRoom,
    deleteRoom,
  };
};
