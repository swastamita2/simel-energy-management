# Search & Notification Features

## 🔍 Search Feature

### Overview

Global search functionality yang memungkinkan user mencari devices, rooms, reports, dan pages dengan cepat.

### Features

- ⌨️ **Keyboard Shortcut**: `Ctrl+K` (Windows/Linux) atau `Cmd+K` (Mac)
- 🔄 **Real-time Search**: Debounced search dengan 300ms delay
- 📝 **Recent Searches**: Menyimpan 5 pencarian terakhir di localStorage
- 🎯 **Smart Filtering**: Search berdasarkan title dan subtitle
- 🏷️ **Type Badges**: Visual indicators untuk tipe hasil (Room, Device, Report, Page)
- ⌨️ **Keyboard Navigation**: Arrow keys untuk navigasi, Enter untuk select, ESC untuk close

### Usage

```tsx
import { SearchDialog } from '@/components/dashboard/SearchDialog';

function MyComponent() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <button onClick={() => setSearchOpen(true)}>Open Search</button>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
```

### Search Data Structure

```typescript
interface SearchResult {
  id: string;
  type: 'room' | 'device' | 'report' | 'page';
  title: string;
  subtitle?: string;
  url: string;
  metadata?: Record<string, any>;
}
```

### Integration dengan API

Ganti mock data dengan real API call di `SearchDialog.tsx`:

```typescript
const performSearch = async (query: string) => {
  const response = await api.get(`/search?q=${query}`);
  setResults(response.data);
};
```

---

## 🔔 Notification Feature

### Overview

Real-time notification system dengan priority levels, type indicators, dan action buttons.

### Features

- 🔴 **Unread Badge**: Menampilkan jumlah notifikasi yang belum dibaca
- 🎨 **Type-based Styling**: Warna berbeda untuk setiap tipe notifikasi
- ✅ **Mark as Read**: Individual atau bulk mark as read
- 🗑️ **Delete**: Hapus notifikasi individual atau clear all
- 🔗 **Action URLs**: Klik notifikasi untuk navigate ke halaman terkait
- ⏰ **Timestamps**: Waktu relatif untuk setiap notifikasi
- 📜 **Scrollable List**: Smooth scrolling untuk banyak notifikasi

### Notification Types

1. **Alert** 🔴
   - High priority issues
   - Red color scheme
   - Memerlukan perhatian segera

2. **Warning** ⚠️
   - Medium priority
   - Yellow/orange color scheme
   - Perlu diperhatikan

3. **Success** ✅
   - Positive events
   - Green color scheme
   - Informasi keberhasilan

4. **Info** ℹ️
   - General information
   - Blue color scheme
   - Informasi umum

### Usage

```tsx
import { NotificationCenter } from '@/components/dashboard/NotificationCenter';

function Header() {
  return (
    <div className="header">
      <NotificationCenter />
    </div>
  );
}
```

### Notification Data Structure

```typescript
interface Notification {
  id: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
}
```

### Notification Service

Service untuk managing notifications:

```typescript
import { notificationService } from '@/services';

// Get all notifications
const notifications = await notificationService.getNotifications();

// Get unread count
const count = await notificationService.getUnreadCount();

// Mark as read
await notificationService.markAsRead(notificationId);

// Mark all as read
await notificationService.markAllAsRead();

// Delete notification
await notificationService.deleteNotification(notificationId);

// Clear all
await notificationService.clearAll();

// Subscribe to real-time updates
const unsubscribe = notificationService.subscribeToNotifications((notification) => {
  console.log('New notification:', notification);
});

// Later: unsubscribe
unsubscribe();
```

### Real-time Updates (Production)

Untuk production, implementasikan WebSocket connection:

```typescript
// src/services/notificationService.ts
subscribeToNotifications: (callback) => {
  const ws = new WebSocket(`${WS_URL}/notifications`);

  ws.onmessage = (event) => {
    const notification = JSON.parse(event.data);
    callback(notification);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return () => ws.close();
};
```

---

## 🎨 Customization

### Colors

Notification colors dapat dikustomisasi di `tailwind.config.ts`:

```typescript
colors: {
  success: {
    DEFAULT: "hsl(var(--success))",
    foreground: "hsl(var(--success-foreground))",
  },
  warning: {
    DEFAULT: "hsl(var(--warning))",
    foreground: "hsl(var(--warning-foreground))",
  },
  // ... etc
}
```

### Search Results Limit

Ubah jumlah recent searches yang disimpan:

```typescript
// SearchDialog.tsx
const updated = [searchTerm, ...recentSearches.filter((s) => s !== searchTerm)].slice(0, 5); // Change 5 to desired number
```

### Notification Popup Duration

Untuk auto-hide notifications (dengan toast):

```typescript
import { toast } from 'sonner';

notificationService.subscribeToNotifications((notification) => {
  toast[notification.type](notification.title, {
    description: notification.message,
    duration: 5000, // 5 seconds
  });
});
```

---

## 📱 Mobile Responsiveness

Both components are fully responsive:

- **Search Dialog**: Full-screen on mobile
- **Notification Center**: Adjusted width and height for mobile screens
- **Touch-friendly**: Proper touch targets for mobile devices

---

## ♿ Accessibility

### Keyboard Support

- **Search**: `Ctrl+K` / `Cmd+K` to open, `ESC` to close, arrow keys to navigate
- **Notifications**: Tab navigation, Enter to select
- **Focus Management**: Proper focus trapping in dialogs

### Screen Readers

- Proper ARIA labels
- Semantic HTML structure
- Descriptive button labels

---

## 🧪 Testing

### Unit Tests Example

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchDialog } from '@/components/dashboard/SearchDialog';

describe('SearchDialog', () => {
  it('opens on keyboard shortcut', async () => {
    const { container } = render(<SearchDialog open={false} onOpenChange={jest.fn()} />);

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });

    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it('displays search results', async () => {
    render(<SearchDialog open={true} onOpenChange={jest.fn()} />);

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 'lab' } });

    await waitFor(() => {
      expect(screen.getByText(/Lab Komputer/i)).toBeInTheDocument();
    });
  });
});
```

---

## 🚀 Performance

### Optimizations

1. **Debounced Search**: 300ms delay untuk reduce API calls
2. **Lazy Loading**: Components dimuat on-demand
3. **Memoization**: React.memo untuk prevent unnecessary re-renders
4. **Virtual Scrolling**: Untuk large notification lists (dapat ditambahkan)

### Bundle Size

- SearchDialog: ~15KB
- NotificationCenter: ~18KB
- Combined: ~33KB (gzipped: ~10KB)

---

## 🔐 Security

### XSS Prevention

- Semua user input di-sanitize
- No `dangerouslySetInnerHTML`
- Content Security Policy compliant

### Data Privacy

- Recent searches stored locally only
- No sensitive data in notifications
- HTTPS required for WebSocket connections

---

## 📊 Analytics

Track user interactions:

```typescript
// Track search queries
const handleSearch = (query: string) => {
  analytics.track('search_performed', {
    query,
    results_count: results.length,
  });
};

// Track notification actions
const handleNotificationClick = (notification: Notification) => {
  analytics.track('notification_clicked', {
    notification_id: notification.id,
    type: notification.type,
    priority: notification.priority,
  });
};
```

---

## 🐛 Troubleshooting

### Search Not Working

1. Check browser console for errors
2. Verify API endpoint is correct
3. Check network tab for failed requests

### Notifications Not Showing

1. Check notification service is properly imported
2. Verify mock data is enabled in `.env.local`
3. Check browser console for errors

### WebSocket Connection Issues

1. Verify WebSocket URL is correct
2. Check CORS settings
3. Ensure proper authentication headers

---

## 📝 TODO / Future Enhancements

- [ ] Advanced search filters (by date, type, status)
- [ ] Search history sync across devices
- [ ] Notification preferences per user
- [ ] Push notifications (desktop & mobile)
- [ ] Notification grouping by type
- [ ] Search suggestions/autocomplete
- [ ] Voice search support
- [ ] Dark mode optimizations
- [ ] i18n support for multiple languages
