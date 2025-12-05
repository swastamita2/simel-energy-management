import { api } from './api';
import { ApiResponse, Notification } from '@/types';

// Mock notifications for development
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'alert',
    priority: 'high',
    title: 'High Energy Consumption',
    message: 'Auditorium power usage exceeded 12 kW threshold',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    read: false,
    actionUrl: '/monitoring',
  },
  {
    id: '2',
    type: 'warning',
    priority: 'medium',
    title: 'Device Offline',
    message: 'Exhaust Fan in Lab Elektronika is not responding',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    read: false,
    actionUrl: '/monitoring',
  },
  {
    id: '3',
    type: 'success',
    priority: 'low',
    title: 'Efficiency Target Achieved',
    message: 'Campus efficiency rate reached 87% for today',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    read: true,
  },
  {
    id: '4',
    type: 'info',
    priority: 'low',
    title: 'Report Generated',
    message: 'Weekly energy consumption report is ready for download',
    timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
    read: true,
    actionUrl: '/reports',
  },
  {
    id: '5',
    type: 'warning',
    priority: 'medium',
    title: 'Scheduled Maintenance',
    message: 'System maintenance scheduled for this weekend',
    timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
    read: true,
  },
];

export const notificationService = {
  // Get all notifications
  getNotifications: async (): Promise<ApiResponse<Notification[]>> => {
    if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: mockNotifications,
          });
        }, 300);
      });
    }
    return api.get<ApiResponse<Notification[]>>('/notifications');
  },

  // Get unread notifications count
  getUnreadCount: async (): Promise<ApiResponse<number>> => {
    if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
      return new Promise((resolve) => {
        setTimeout(() => {
          const unreadCount = mockNotifications.filter(n => !n.read).length;
          resolve({
            success: true,
            data: unreadCount,
          });
        }, 200);
      });
    }
    return api.get<ApiResponse<number>>('/notifications/unread-count');
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<ApiResponse<Notification>> => {
    if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
      return new Promise((resolve) => {
        setTimeout(() => {
          const notification = mockNotifications.find(n => n.id === notificationId);
          if (notification) {
            notification.read = true;
            resolve({
              success: true,
              data: notification,
            });
          } else {
            resolve({
              success: false,
              data: {} as Notification,
              error: 'Notification not found',
            });
          }
        }, 200);
      });
    }
    return api.patch<ApiResponse<Notification>>(`/notifications/${notificationId}/read`);
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<ApiResponse> => {
    if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
      return new Promise((resolve) => {
        setTimeout(() => {
          mockNotifications.forEach(n => n.read = true);
          resolve({
            success: true,
            data: null,
          });
        }, 300);
      });
    }
    return api.post<ApiResponse>('/notifications/mark-all-read');
  },

  // Delete notification
  deleteNotification: async (notificationId: string): Promise<ApiResponse> => {
    if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
      return new Promise((resolve) => {
        setTimeout(() => {
          const index = mockNotifications.findIndex(n => n.id === notificationId);
          if (index !== -1) {
            mockNotifications.splice(index, 1);
            resolve({
              success: true,
              data: null,
            });
          } else {
            resolve({
              success: false,
              data: null,
              error: 'Notification not found',
            });
          }
        }, 200);
      });
    }
    return api.delete<ApiResponse>(`/notifications/${notificationId}`);
  },

  // Clear all notifications
  clearAll: async (): Promise<ApiResponse> => {
    if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
      return new Promise((resolve) => {
        setTimeout(() => {
          mockNotifications.length = 0;
          resolve({
            success: true,
            data: null,
          });
        }, 300);
      });
    }
    return api.delete<ApiResponse>('/notifications/clear-all');
  },

  // Subscribe to notification updates (WebSocket or Server-Sent Events)
  subscribeToNotifications: (callback: (notification: Notification) => void) => {
    // This would be implemented with WebSocket or SSE in production
    // For now, simulate periodic updates
    if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
      const interval = setInterval(() => {
        // Simulate random new notification
        if (Math.random() > 0.95) {
          const newNotification: Notification = {
            id: `new-${Date.now()}`,
            type: ['info', 'warning', 'alert', 'success'][Math.floor(Math.random() * 4)] as any,
            priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
            title: 'New Notification',
            message: 'This is a simulated real-time notification',
            timestamp: new Date().toISOString(),
            read: false,
          };
          callback(newNotification);
        }
      }, 30000); // Check every 30 seconds

      // Return unsubscribe function
      return () => clearInterval(interval);
    }

    // In production, connect to WebSocket
    // const ws = new WebSocket(`${WS_URL}/notifications`);
    // ws.onmessage = (event) => {
    //   const notification = JSON.parse(event.data);
    //   callback(notification);
    // };
    // return () => ws.close();

    return () => {}; // No-op unsubscribe for production without mock
  },
};
