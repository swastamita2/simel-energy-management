const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { randomUUID } = require('crypto');

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:8080,http://localhost:8081,http://localhost:8082')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const users = [
  {
    id: '1',
    email: 'admin@itpln.ac.id',
    password: 'admin123',
    role: 'admin',
    name: 'Admin ITPLN',
    department: 'IT Department',
  },
];

let rooms = [
  { id: 1, name: 'Lab Komputer 1', building: 'Gedung A - Lt. 2', enabled: true, consumption: 4.2, temperature: 24, devicesOn: 18, totalDevices: 20, status: 'normal' },
  { id: 2, name: 'Ruang Kuliah 201', building: 'Gedung A - Lt. 2', enabled: true, consumption: 3.8, temperature: 26, devicesOn: 12, totalDevices: 15, status: 'normal' },
  { id: 3, name: 'Lab Elektronika', building: 'Gedung B - Lt. 1', enabled: true, consumption: 8.5, temperature: 28, devicesOn: 24, totalDevices: 25, status: 'warning' },
  { id: 4, name: 'Auditorium', building: 'Gedung C', enabled: true, consumption: 12.4, temperature: 23, devicesOn: 32, totalDevices: 35, status: 'alert' },
];
let devices = [
  { id: 1, name: 'LED Panel 1', type: 'light', room: 'Lab Komputer 1', building: 'Gedung A - Lt. 2', status: 'on', power: 120, maxPower: 300 },
  { id: 2, name: 'AC Unit 1', type: 'ac', room: 'Lab Komputer 1', building: 'Gedung A - Lt. 2', status: 'on', power: 850, maxPower: 1500, temperature: 24 },
  { id: 3, name: 'Projector', type: 'projector', room: 'Ruang Kuliah 201', building: 'Gedung A - Lt. 2', status: 'on', power: 280, maxPower: 500 },
  { id: 4, name: 'LED Panel 2', type: 'light', room: 'Ruang Kuliah 201', building: 'Gedung A - Lt. 2', status: 'off', power: 0, maxPower: 300 },
  { id: 5, name: 'AC Unit 2', type: 'ac', room: 'Lab Elektronika', building: 'Gedung B - Lt. 1', status: 'on', power: 920, maxPower: 1500, temperature: 23 },
  { id: 6, name: 'Computer 1', type: 'computer', room: 'Auditorium', building: 'Gedung C', status: 'on', power: 420, maxPower: 700 },
];
const failOnceTracker = new Map();
const DEVICE_TYPES = new Set(['light', 'ac', 'projector', 'computer', 'other']);

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const findRoomByNameAndBuilding = (roomName, building) => {
  return rooms.find((room) => room.name === roomName && room.building === building);
};

const recalculateRoomMetrics = (roomId) => {
  const roomIndex = rooms.findIndex((room) => room.id === roomId);
  if (roomIndex === -1) return;

  const room = rooms[roomIndex];
  const roomDevices = devices.filter(
    (device) => device.room === room.name && device.building === room.building,
  );
  const devicesOn = roomDevices.filter((device) => device.status === 'on').length;
  const totalDevices = roomDevices.length;
  const consumptionWatts = roomDevices.reduce(
    (sum, device) => sum + (device.status === 'on' ? device.power : 0),
    0,
  );
  const acDevices = roomDevices.filter(
    (device) => device.type === 'ac' && typeof device.temperature === 'number',
  );
  const avgTemp =
    acDevices.length > 0
      ? Math.round(acDevices.reduce((sum, device) => sum + device.temperature, 0) / acDevices.length)
      : room.temperature;

  rooms[roomIndex] = {
    ...room,
    totalDevices,
    devicesOn,
    temperature: avgTemp,
    consumption: Number((consumptionWatts / 1000).toFixed(1)),
    status:
      consumptionWatts / 1000 > 10
        ? 'alert'
        : consumptionWatts / 1000 > 7
          ? 'warning'
          : 'normal',
    enabled: room.enabled && (totalDevices === 0 || devicesOn > 0),
  };
};

const recalculateAllRooms = () => {
  rooms.forEach((room) => recalculateRoomMetrics(room.id));
};

const buildOverview = () => {
  const totalConsumption = Number(
    rooms.reduce((sum, room) => sum + room.consumption, 0).toFixed(1),
  );
  const peakLoad = Number(
    Math.max(...rooms.map((room) => room.consumption), 0).toFixed(1),
  );
  const activeDevices = devices.filter((device) => device.status === 'on').length;
  const efficiencyScore =
    devices.length === 0 ? 0 : Math.round((activeDevices / devices.length) * 100);

  return {
    totalConsumption,
    peakLoad,
    efficiencyScore,
    rooms,
    devices,
  };
};

recalculateAllRooms();

const sendSuccess = (res, data, message) => {
  return res.json({
    success: true,
    data,
    message,
  });
};

const sendError = (res, statusCode, message, details) => {
  return res.status(statusCode).json({
    success: false,
    error: message,
    message,
    statusCode,
    details,
  });
};

app.use((req, _res, next) => {
  req.requestId = randomUUID();
  next();
});

morgan.token('rid', (req) => req.requestId);
app.use(morgan(':date[iso] :method :url :status :response-time ms reqId=:rid'));

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 401, 'Missing or invalid Authorization header');
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, 401, 'Invalid or expired token', error.message);
  }
};

app.get('/api/health', (_req, res) => {
  sendSuccess(res, { status: 'ok', service: 'web-simul-backend' });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return sendError(res, 400, 'Email and password are required');
  }

  const user = users.find((item) => item.email === email);
  if (!user || user.password !== password) {
    return sendError(res, 401, 'Invalid email or password');
  }

  const accessToken = jwt.sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    {
      sub: user.id,
      type: 'refresh',
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return sendSuccess(res, {
    accessToken,
    refreshToken,
    expiresIn: 3600,
  }, 'Login success');
});

app.use('/api/monitoring', authMiddleware);

app.get('/api/monitoring/rooms', (_req, res) => {
  sendSuccess(res, rooms);
});

app.get('/api/monitoring/rooms/:id', (req, res) => {
  const id = Number(req.params.id);
  const room = rooms.find((item) => item.id === id);

  if (!room) {
    return sendError(res, 404, 'Room not found');
  }

  return sendSuccess(res, room);
});

app.post('/api/monitoring/rooms', (req, res) => {
  const { name, building, enabled = true } = req.body || {};

  if (!name || !building) {
    return sendError(res, 400, 'name and building are required');
  }

  const nextId = rooms.length > 0 ? Math.max(...rooms.map((item) => item.id)) + 1 : 1;
  const newRoom = {
    id: nextId,
    name: String(name).trim(),
    building: String(building).trim(),
    enabled: Boolean(enabled),
    consumption: 0,
    temperature: 24,
    devicesOn: 0,
    totalDevices: 0,
    status: 'normal',
  };

  rooms.push(newRoom);
  return sendSuccess(res.status(201), newRoom, 'Room created');
});

const updateRoomHandler = (req, res) => {
  const id = Number(req.params.id);
  const roomIndex = rooms.findIndex((item) => item.id === id);

  if (roomIndex === -1) {
    return sendError(res, 404, 'Room not found');
  }

  const updates = req.body || {};
  const existing = rooms[roomIndex];
  const nextName = updates.name !== undefined ? String(updates.name).trim() : existing.name;
  const nextBuilding = updates.building !== undefined ? String(updates.building).trim() : existing.building;
  const nextEnabled = updates.enabled !== undefined ? Boolean(updates.enabled) : existing.enabled;

  if (!nextName || !nextBuilding) {
    return sendError(res, 400, 'name and building cannot be empty');
  }

  const duplicateRoom = rooms.find(
    (room) => room.id !== id && room.name === nextName && room.building === nextBuilding,
  );
  if (duplicateRoom) {
    return sendError(res, 409, 'Room with same name and building already exists');
  }

  if (nextName !== existing.name || nextBuilding !== existing.building) {
    devices = devices.map((device) => {
      if (device.room === existing.name && device.building === existing.building) {
        return {
          ...device,
          room: nextName,
          building: nextBuilding,
        };
      }
      return device;
    });
  }

  if (updates.enabled !== undefined) {
    devices = devices.map((device) => {
      if (device.room !== nextName || device.building !== nextBuilding || device.status === 'offline') {
        return device;
      }

      if (!nextEnabled) {
        return {
          ...device,
          status: 'off',
          power: 0,
        };
      }

      return {
        ...device,
        status: 'on',
        power: Math.round(device.maxPower * 0.8),
      };
    });
  }

  const updatedRoom = {
    ...existing,
    name: nextName,
    building: nextBuilding,
    enabled: nextEnabled,
  };

  rooms[roomIndex] = updatedRoom;
  recalculateRoomMetrics(id);

  const refreshedRoom = rooms.find((room) => room.id === id);
  return sendSuccess(res, refreshedRoom || updatedRoom, 'Room updated');
};

app.put('/api/monitoring/rooms/:id', updateRoomHandler);
app.patch('/api/monitoring/rooms/:id', updateRoomHandler);

app.delete('/api/monitoring/rooms/:id', (req, res) => {
  const id = Number(req.params.id);
  const roomIndex = rooms.findIndex((item) => item.id === id);

  if (roomIndex === -1) {
    return sendError(res, 404, 'Room not found');
  }

  const deletedRoom = rooms[roomIndex];
  devices = devices.filter(
    (device) => !(device.room === deletedRoom.name && device.building === deletedRoom.building),
  );
  rooms.splice(roomIndex, 1);
  return sendSuccess(res, null, 'Room deleted');
});

app.get('/api/monitoring/devices', (_req, res) => {
  return sendSuccess(res, devices);
});

app.get('/api/monitoring/rooms/:id/devices', (req, res) => {
  const roomId = Number(req.params.id);
  const room = rooms.find((item) => item.id === roomId);

  if (!room) {
    return sendError(res, 404, 'Room not found');
  }

  const roomDevices = devices.filter(
    (device) => device.room === room.name && device.building === room.building,
  );
  return sendSuccess(res, roomDevices);
});

app.post('/api/monitoring/devices', (req, res) => {
  const payload = req.body || {};
  const name = String(payload.name || '').trim();
  const type = String(payload.type || '').trim();
  const room = String(payload.room || '').trim();
  const building = String(payload.building || '').trim();
  const maxPower = Number(payload.maxPower);
  const status = payload.status === 'on' ? 'on' : 'off';

  if (!name || !type || !room || !building || !Number.isFinite(maxPower) || maxPower <= 0) {
    return sendError(res, 400, 'name, type, room, building and maxPower are required');
  }

  if (!DEVICE_TYPES.has(type)) {
    return sendError(res, 400, 'Invalid device type');
  }

  const targetRoom = findRoomByNameAndBuilding(room, building);
  if (!targetRoom) {
    return sendError(res, 404, 'Target room not found');
  }

  const nextId = devices.length > 0 ? Math.max(...devices.map((device) => device.id)) + 1 : 1;
  const safeMaxPower = Math.max(1, Math.round(maxPower));
  const nextPower =
    payload.power !== undefined
      ? clamp(Math.round(Number(payload.power) || 0), 0, safeMaxPower)
      : status === 'on'
        ? Math.round(safeMaxPower * 0.8)
        : 0;

  const newDevice = {
    id: nextId,
    name,
    type,
    room,
    building,
    status,
    maxPower: safeMaxPower,
    power: nextPower,
    temperature:
      payload.temperature !== undefined && payload.temperature !== null
        ? Number(payload.temperature)
        : undefined,
  };

  devices.push(newDevice);
  recalculateRoomMetrics(targetRoom.id);

  return sendSuccess(res.status(201), newDevice, 'Device created');
});

const updateDeviceHandler = (req, res) => {
  const deviceId = Number(req.params.id);
  const deviceIndex = devices.findIndex((device) => device.id === deviceId);
  if (deviceIndex === -1) {
    return sendError(res, 404, 'Device not found');
  }

  const currentDevice = devices[deviceIndex];
  const payload = req.body || {};

  const nextName = payload.name !== undefined ? String(payload.name).trim() : currentDevice.name;
  const nextType = payload.type !== undefined ? String(payload.type).trim() : currentDevice.type;
  const nextRoom = payload.room !== undefined ? String(payload.room).trim() : currentDevice.room;
  const nextBuilding =
    payload.building !== undefined ? String(payload.building).trim() : currentDevice.building;
  const nextStatus =
    payload.status !== undefined
      ? payload.status === 'offline'
        ? 'offline'
        : payload.status === 'on'
          ? 'on'
          : 'off'
      : currentDevice.status;
  const nextMaxPower =
    payload.maxPower !== undefined
      ? Math.max(1, Math.round(Number(payload.maxPower) || currentDevice.maxPower))
      : currentDevice.maxPower;

  if (!nextName || !nextRoom || !nextBuilding) {
    return sendError(res, 400, 'name, room and building cannot be empty');
  }

  if (!DEVICE_TYPES.has(nextType)) {
    return sendError(res, 400, 'Invalid device type');
  }

  const roomEntity = findRoomByNameAndBuilding(nextRoom, nextBuilding);
  if (!roomEntity) {
    return sendError(res, 404, 'Target room not found');
  }

  let nextPower;
  if (payload.power !== undefined) {
    nextPower = clamp(Math.round(Number(payload.power) || 0), 0, nextMaxPower);
  } else if (nextStatus === 'on') {
    nextPower = Math.min(currentDevice.power || Math.round(nextMaxPower * 0.8), nextMaxPower);
  } else {
    nextPower = 0;
  }

  if (nextStatus !== 'on') {
    nextPower = 0;
  }

  const updatedDevice = {
    ...currentDevice,
    name: nextName,
    type: nextType,
    room: nextRoom,
    building: nextBuilding,
    status: nextStatus,
    maxPower: nextMaxPower,
    power: nextPower,
    temperature:
      payload.temperature !== undefined
        ? payload.temperature === null
          ? undefined
          : Number(payload.temperature)
        : currentDevice.temperature,
  };

  devices[deviceIndex] = updatedDevice;

  const previousRoom = findRoomByNameAndBuilding(currentDevice.room, currentDevice.building);
  if (previousRoom) {
    recalculateRoomMetrics(previousRoom.id);
  }
  recalculateRoomMetrics(roomEntity.id);

  return sendSuccess(res, updatedDevice, 'Device updated');
};

app.patch('/api/monitoring/devices/:id', updateDeviceHandler);
app.put('/api/monitoring/devices/:id', updateDeviceHandler);

app.delete('/api/monitoring/devices/:id', (req, res) => {
  const deviceId = Number(req.params.id);
  const deviceIndex = devices.findIndex((device) => device.id === deviceId);
  if (deviceIndex === -1) {
    return sendError(res, 404, 'Device not found');
  }

  const room = findRoomByNameAndBuilding(devices[deviceIndex].room, devices[deviceIndex].building);
  devices.splice(deviceIndex, 1);
  if (room) {
    recalculateRoomMetrics(room.id);
  }

  return sendSuccess(res, null, 'Device deleted');
});

app.get('/api/monitoring/overview', (_req, res) => {
  recalculateAllRooms();
  return sendSuccess(res, buildOverview());
});

app.post('/api/monitoring/test/reset', (_req, res) => {
  failOnceTracker.clear();
  return sendSuccess(res, { reset: true }, 'Test state reset');
});

app.get('/api/monitoring/test/fail-once', (req, res) => {
  const key = String(req.query.key || 'default');
  const attempts = (failOnceTracker.get(key) || 0) + 1;
  failOnceTracker.set(key, attempts);

  if (attempts === 1) {
    return sendError(res, 500, 'Simulated transient failure', { key, attempts });
  }

  return sendSuccess(res, { key, attempts }, 'Recovered after transient failure');
});

app.get('/api/monitoring/test/slow', async (req, res) => {
  const requestedDelay = Number(req.query.delayMs || 1500);
  const delayMs = Number.isFinite(requestedDelay)
    ? Math.max(0, Math.min(requestedDelay, 15000))
    : 1500;

  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return sendSuccess(res, { delayMs }, 'Slow response done');
});

app.use('/api/*', (_req, res) => {
  return sendError(res, 404, 'API route not found');
});

// Global error handler
app.use((error, req, res, _next) => {
  console.error(`[API ERROR] reqId=${req.requestId}`, error);
  return sendError(res, 500, 'Internal server error', error.message);
});

const server = app.listen(PORT, () => {
  console.log(`Backend API ready on http://localhost:${PORT}`);
  console.log(`Allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);
});

// Keep requests from hanging too long.
server.requestTimeout = 15000;
server.headersTimeout = 16000;
