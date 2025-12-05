import { useState, useEffect } from 'react';
import { Bell, Check, X, AlertCircle, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Notification, NotificationType } from '@/types';
import { formatDate } from '@/lib/utils';

// Mock notifications - replace with real data from API
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
];

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'alert':
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-warning" />;
    case 'success':
      return <CheckCircle className="h-4 w-4 text-success" />;
    case 'info':
    default:
      return <Info className="h-4 w-4 text-primary" />;
  }
};

const getNotificationBgColor = (type: NotificationType, read: boolean) => {
  if (read) return 'bg-muted/50';
  
  switch (type) {
    case 'alert':
      return 'bg-destructive/10 hover:bg-destructive/20';
    case 'warning':
      return 'bg-warning/10 hover:bg-warning/20';
    case 'success':
      return 'bg-success/10 hover:bg-success/20';
    case 'info':
    default:
      return 'bg-primary/10 hover:bg-primary/20';
  }
};

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="font-semibold text-lg">Notifications</h3>
            <p className="text-sm text-muted-foreground">
              You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          {notifications.length > 0 && (
            <div className="flex gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-xs text-destructive hover:text-destructive"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-sm text-muted-foreground">No notifications</p>
              <p className="text-xs text-muted-foreground mt-1">
                You're all caught up!
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={cn(
                    'p-4 transition-colors cursor-pointer relative group',
                    getNotificationBgColor(notification.type, notification.read)
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          className={cn(
                            'text-sm font-medium',
                            !notification.read && 'font-semibold'
                          )}
                        >
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDate(notification.timestamp, 'dd MMM yyyy HH:mm')}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full text-xs"
                onClick={() => {
                  window.location.href = '/notifications';
                  setOpen(false);
                }}
              >
                View all notifications
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};
