import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';

// Types
export interface Device {
  id: string;
  name: string;
  type: string;
  room: string;
  building: string;
  status: 'on' | 'off' | 'offline';
  power: number;
  maxPower: number;
  temperature?: number;
}

export interface Room {
  id: string;
  name: string;
  building: string;
  enabled: boolean;
  devicesOn: number;
  totalDevices: number;
  consumption: number;
  status: 'normal' | 'warning' | 'alert';
}

export interface EnergyStats {
  totalConsumption: number;
  peakLoad: number;
  activeDevices: number;
  totalDevices: number;
  efficiency: number;
  costSavings: number;
  carbonReduction: number;
  alerts: Alert[];
}

export interface Alert {
  id: number;
  message: string;
  type: 'warning' | 'error' | 'resolved';
  time: string;
  location: string;
  deviceId?: string;
}

export interface ConsumptionData {
  time: string;
  consumption: number;
  efficiency: number;
}

interface EnergyContextType {
  // Real-time data
  devices: Device[];
  rooms: Room[];
  stats: EnergyStats;
  realtimeData: ConsumptionData[];
  weeklyData: ConsumptionData[];
  
  // Actions
  updateDeviceStatus: (deviceId: string, status: 'on' | 'off') => void;
  updateDevicePower: (deviceId: string, power: number) => void;
  toggleRoom: (roomId: string) => void;
  resolveAlert: (alertId: number) => void;
  refreshData: () => Promise<void>;
  
  // State
  isRefreshing: boolean;
  lastUpdate: Date;
}

const EnergyContext = createContext<EnergyContextType | undefined>(undefined);

// Initial mock data
const initialDevices: Device[] = [
  // Lab Komputer 1 - Gedung A Lt.2 (20 devices)
  { id: '1', name: 'AC Unit 1', type: 'AC', room: 'Lab Komputer 1', building: 'Gedung A - Lt. 2', status: 'on', power: 1200, maxPower: 1500, temperature: 24 },
  { id: '2', name: 'AC Unit 2', type: 'AC', room: 'Lab Komputer 1', building: 'Gedung A - Lt. 2', status: 'on', power: 1150, maxPower: 1500, temperature: 24 },
  { id: '3', name: 'Projector', type: 'Projector', room: 'Lab Komputer 1', building: 'Gedung A - Lt. 2', status: 'on', power: 280, maxPower: 500 },
  { id: '4', name: 'Light Panel 1', type: 'Light', room: 'Lab Komputer 1', building: 'Gedung A - Lt. 2', status: 'on', power: 120, maxPower: 300 },
  { id: '5', name: 'Computer 1-10', type: 'Computer', room: 'Lab Komputer 1', building: 'Gedung A - Lt. 2', status: 'on', power: 800, maxPower: 1000 },
  { id: '6', name: 'Computer 11-20', type: 'Computer', room: 'Lab Komputer 1', building: 'Gedung A - Lt. 2', status: 'on', power: 850, maxPower: 1000 },
  
  // Ruang Kuliah 201 - Gedung A Lt.2 (15 devices)
  { id: '7', name: 'AC Unit 1', type: 'AC', room: 'Ruang Kuliah 201', building: 'Gedung A - Lt. 2', status: 'on', power: 1100, maxPower: 1500, temperature: 26 },
  { id: '8', name: 'AC Unit 2', type: 'AC', room: 'Ruang Kuliah 201', building: 'Gedung A - Lt. 2', status: 'on', power: 1050, maxPower: 1500, temperature: 26 },
  { id: '9', name: 'Projector', type: 'Projector', room: 'Ruang Kuliah 201', building: 'Gedung A - Lt. 2', status: 'on', power: 300, maxPower: 500 },
  { id: '10', name: 'Light Panel', type: 'Light', room: 'Ruang Kuliah 201', building: 'Gedung A - Lt. 2', status: 'on', power: 150, maxPower: 300 },
  { id: '11', name: 'Sound System', type: 'Other', room: 'Ruang Kuliah 201', building: 'Gedung A - Lt. 2', status: 'on', power: 200, maxPower: 400 },
  
  // Lab Elektronika - Gedung B Lt.1 (25 devices)
  { id: '12', name: 'AC Unit 1', type: 'AC', room: 'Lab Elektronika', building: 'Gedung B - Lt. 1', status: 'on', power: 1400, maxPower: 1500, temperature: 28 },
  { id: '13', name: 'AC Unit 2', type: 'AC', room: 'Lab Elektronika', building: 'Gedung B - Lt. 1', status: 'on', power: 1450, maxPower: 1500, temperature: 28 },
  { id: '14', name: 'AC Unit 3', type: 'AC', room: 'Lab Elektronika', building: 'Gedung B - Lt. 1', status: 'on', power: 1420, maxPower: 1500, temperature: 28 },
  { id: '15', name: 'Oscilloscope 1-5', type: 'Other', room: 'Lab Elektronika', building: 'Gedung B - Lt. 1', status: 'on', power: 500, maxPower: 800 },
  { id: '16', name: 'Workstation 1-10', type: 'Computer', room: 'Lab Elektronika', building: 'Gedung B - Lt. 1', status: 'on', power: 900, maxPower: 1200 },
  { id: '17', name: 'Light Panel 1-3', type: 'Light', room: 'Lab Elektronika', building: 'Gedung B - Lt. 1', status: 'on', power: 250, maxPower: 400 },
  
  // Auditorium - Gedung C (35 devices)
  { id: '18', name: 'AC Unit 1-4', type: 'AC', room: 'Auditorium', building: 'Gedung C', status: 'on', power: 4800, maxPower: 6000, temperature: 23 },
  { id: '19', name: 'Stage Lighting', type: 'Light', room: 'Auditorium', building: 'Gedung C', status: 'on', power: 1200, maxPower: 2000 },
  { id: '20', name: 'Sound System', type: 'Other', room: 'Auditorium', building: 'Gedung C', status: 'on', power: 800, maxPower: 1500 },
  { id: '21', name: 'Projector Array', type: 'Projector', room: 'Auditorium', building: 'Gedung C', status: 'on', power: 1500, maxPower: 2000 },
  { id: '22', name: 'Control Room', type: 'Computer', room: 'Auditorium', building: 'Gedung C', status: 'on', power: 600, maxPower: 1000 },
  
  // Perpustakaan - Gedung D Lt.1 (30 devices)
  { id: '23', name: 'AC Unit 1-2', type: 'AC', room: 'Perpustakaan', building: 'Gedung D - Lt. 1', status: 'on', power: 2400, maxPower: 3000, temperature: 25 },
  { id: '24', name: 'Reading Lights 1-20', type: 'Light', room: 'Perpustakaan', building: 'Gedung D - Lt. 1', status: 'on', power: 600, maxPower: 1000 },
  { id: '25', name: 'Computer Catalog', type: 'Computer', room: 'Perpustakaan', building: 'Gedung D - Lt. 1', status: 'on', power: 400, maxPower: 600 },
  
  // Kantor Dosen - Gedung A Lt.3 (12 devices)
  { id: '26', name: 'AC Unit 1', type: 'AC', room: 'Kantor Dosen', building: 'Gedung A - Lt. 3', status: 'on', power: 950, maxPower: 1500, temperature: 26 },
  { id: '27', name: 'Light Panel', type: 'Light', room: 'Kantor Dosen', building: 'Gedung A - Lt. 3', status: 'on', power: 180, maxPower: 300 },
  { id: '28', name: 'Computers 1-10', type: 'Computer', room: 'Kantor Dosen', building: 'Gedung A - Lt. 3', status: 'on', power: 750, maxPower: 1000 },
];

const initialRooms: Room[] = [
  { id: '1', name: 'Lab Komputer 1', building: 'Gedung A - Lt. 2', enabled: true, devicesOn: 18, totalDevices: 20, consumption: 4.2, status: 'normal' },
  { id: '2', name: 'Ruang Kuliah 201', building: 'Gedung A - Lt. 2', enabled: true, devicesOn: 12, totalDevices: 15, consumption: 3.8, status: 'normal' },
  { id: '3', name: 'Lab Elektronika', building: 'Gedung B - Lt. 1', enabled: true, devicesOn: 24, totalDevices: 25, consumption: 8.5, status: 'warning' },
  { id: '4', name: 'Auditorium', building: 'Gedung C', enabled: true, devicesOn: 32, totalDevices: 35, consumption: 12.4, status: 'alert' },
  { id: '5', name: 'Perpustakaan', building: 'Gedung D - Lt. 1', enabled: true, devicesOn: 28, totalDevices: 30, consumption: 5.6, status: 'normal' },
  { id: '6', name: 'Kantor Dosen', building: 'Gedung A - Lt. 3', enabled: true, devicesOn: 8, totalDevices: 12, consumption: 2.1, status: 'normal' },
];

export const EnergyProvider = ({ children }: { children: ReactNode }) => {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [realtimeData, setRealtimeData] = useState<ConsumptionData[]>([
    { time: "00:00", consumption: 245, efficiency: 92 },
    { time: "04:00", consumption: 189, efficiency: 95 },
    { time: "08:00", consumption: 312, efficiency: 88 },
    { time: "12:00", consumption: 398, efficiency: 85 },
    { time: "16:00", consumption: 425, efficiency: 82 },
    { time: "20:00", consumption: 367, efficiency: 87 },
  ]);
  const [weeklyData] = useState<ConsumptionData[]>([
    { time: "Mon", consumption: 2840, efficiency: 88 },
    { time: "Tue", consumption: 2920, efficiency: 87 },
    { time: "Wed", consumption: 2650, efficiency: 90 },
    { time: "Thu", consumption: 2890, efficiency: 86 },
    { time: "Fri", consumption: 3120, efficiency: 84 },
    { time: "Sat", consumption: 1850, efficiency: 92 },
    { time: "Sun", consumption: 1640, efficiency: 94 },
  ]);
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: 1, message: "High consumption detected", type: "warning", time: "2 hours ago", location: "Gedung A - Lab 301" },
    { id: 2, message: "AC temperature threshold exceeded", type: "error", time: "4 hours ago", location: "Gedung B - Ruang Dosen", deviceId: '5' },
    { id: 3, message: "Device maintenance required", type: "resolved", time: "Yesterday", location: "Gedung C - AC Unit 5" },
  ]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Calculate stats from devices and rooms
  const calculateStats = (): EnergyStats => {
    const activeDevices = devices.filter(d => d.status === 'on').length;
    const totalDevices = devices.length;
    
    // Total consumption dalam kWh (dari rooms)
    const totalConsumption = rooms.reduce((sum, room) => sum + (room.enabled ? room.consumption : 0), 0);
    const peakLoad = Math.max(...rooms.map(r => r.consumption), 0);
    
    // Efficiency
    const efficiency = totalDevices > 0 ? Math.round((activeDevices / totalDevices) * 100) : 0;
    
    // Cost savings (Rp 1,500 per kWh, dalam jutaan)
    const costSavings = (totalConsumption * 1.5 / 1000).toFixed(1) as any;
    
    // Carbon reduction (0.85 kg CO2 per kWh)
    const carbonReduction = Math.round(totalConsumption * 0.85);

    return {
      totalConsumption,
      peakLoad,
      activeDevices,
      totalDevices,
      efficiency,
      costSavings,
      carbonReduction,
      alerts,
    };
  };

  const [stats, setStats] = useState<EnergyStats>(calculateStats());

  // Update stats whenever devices or rooms change
  useEffect(() => {
    setStats(calculateStats());
  }, [devices, rooms, alerts]);

  // Real-time updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random fluctuations
      setDevices(prev => prev.map(device => {
        if (device.status === 'on') {
          const fluctuation = Math.random() * 100 - 50;
          const newPower = Math.max(0, Math.min(device.maxPower, device.power + fluctuation));
          return { ...device, power: Math.round(newPower) };
        }
        return device;
      }));

      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const updateDeviceStatus = useCallback((deviceId: string, status: 'on' | 'off') => {
    setDevices(prev => {
      const updated = prev.map(device => {
        if (device.id === deviceId) {
          return { ...device, status, power: status === 'off' ? 0 : Math.round(device.maxPower * 0.8) };
        }
        return device;
      });
      
      // Update room stats berdasarkan devices baru
      const device = updated.find(d => d.id === deviceId);
      if (device) {
        setRooms(prevRooms => prevRooms.map(room => {
          if (room.name === device.room && room.building === device.building) {
            const roomDevices = updated.filter(d => d.room === room.name && d.building === room.building);
            const devicesOn = roomDevices.filter(d => d.status === 'on').length;
            const consumptionWatts = roomDevices.reduce((sum, d) => sum + (d.status === 'on' ? d.power : 0), 0);
            const consumption = parseFloat((consumptionWatts / 1000).toFixed(1)); // Convert to kWh
            
            return {
              ...room,
              devicesOn,
              consumption,
              status: consumption > 10 ? 'alert' : consumption > 7 ? 'warning' : 'normal'
            };
          }
          return room;
        }));
      }
      
      return updated;
    });

    setLastUpdate(new Date());
  }, []);

  const updateDevicePower = useCallback((deviceId: string, power: number) => {
    setDevices(prev => {
      const updated = prev.map(device => {
        if (device.id === deviceId) {
          return { ...device, power: Math.round(power) };
        }
        return device;
      });
      
      // Update room consumption
      const device = updated.find(d => d.id === deviceId);
      if (device) {
        setRooms(prevRooms => prevRooms.map(room => {
          if (room.name === device.room && room.building === device.building) {
            const roomDevices = updated.filter(d => d.room === room.name && d.building === room.building);
            const consumptionWatts = roomDevices.reduce((sum, d) => sum + (d.status === 'on' ? d.power : 0), 0);
            const consumption = parseFloat((consumptionWatts / 1000).toFixed(1)); // Convert to kWh
            
            return {
              ...room,
              consumption,
              status: consumption > 10 ? 'alert' : consumption > 7 ? 'warning' : 'normal'
            };
          }
          return room;
        }));
      }
      
      return updated;
    });

    setLastUpdate(new Date());
  }, []);

  const toggleRoom = useCallback((roomId: string) => {
    setRooms(prev => {
      const room = prev.find(r => r.id === roomId);
      if (!room) return prev;

      const newEnabled = !room.enabled;
      
      // Update all devices in the room
      setDevices(prevDevices => {
        const updated = prevDevices.map(device => {
          if (device.room === room.name && device.building === room.building) {
            return {
              ...device,
              status: newEnabled ? 'on' as const : 'off' as const,
              power: newEnabled ? Math.round(device.maxPower * 0.8) : 0
            };
          }
          return device;
        });
        
        return updated;
      });

      // Update room dengan recalculate consumption
      return prev.map(r => {
        if (r.id === roomId) {
          return {
            ...r,
            enabled: newEnabled,
            devicesOn: newEnabled ? r.totalDevices : 0,
            status: 'normal' as const
          };
        }
        return r;
      });
    });

    setLastUpdate(new Date());
  }, []);

  const resolveAlert = useCallback((alertId: number) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, type: 'resolved' as const } : alert
    ));
  }, []);

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Refresh with slight variations
    setDevices(prev => prev.map(device => ({
      ...device,
      power: device.status === 'on' ? Math.round(device.maxPower * (0.7 + Math.random() * 0.3)) : 0
    })));

    // Update realtime chart
    const newTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const newConsumption = Math.floor(Math.random() * (450 - 300) + 300);
    const newEfficiency = Math.floor(Math.random() * (95 - 80) + 80);
    
    setRealtimeData(prev => [
      ...prev.slice(1),
      { time: newTime, consumption: newConsumption, efficiency: newEfficiency }
    ]);

    setLastUpdate(new Date());
    setIsRefreshing(false);
  }, []);

  const value: EnergyContextType = useMemo(() => ({
    devices,
    rooms,
    stats,
    realtimeData,
    weeklyData,
    updateDeviceStatus,
    updateDevicePower,
    toggleRoom,
    resolveAlert,
    refreshData,
    isRefreshing,
    lastUpdate,
  }), [devices, rooms, stats, realtimeData, weeklyData, updateDeviceStatus, updateDevicePower, toggleRoom, resolveAlert, refreshData, isRefreshing, lastUpdate]);

  return (
    <EnergyContext.Provider value={value}>
      {children}
    </EnergyContext.Provider>
  );
};

export const useEnergy = () => {
  const context = useContext(EnergyContext);
  if (context === undefined) {
    throw new Error('useEnergy must be used within an EnergyProvider');
  }
  return context;
};
