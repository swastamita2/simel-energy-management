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

app.put('/api/monitoring/rooms/:id', (req, res) => {
  const id = Number(req.params.id);
  const roomIndex = rooms.findIndex((item) => item.id === id);

  if (roomIndex === -1) {
    return sendError(res, 404, 'Room not found');
  }

  const updates = req.body || {};
  const existing = rooms[roomIndex];

  const updatedRoom = {
    ...existing,
    name: updates.name !== undefined ? String(updates.name).trim() : existing.name,
    building: updates.building !== undefined ? String(updates.building).trim() : existing.building,
    enabled: updates.enabled !== undefined ? Boolean(updates.enabled) : existing.enabled,
  };

  rooms[roomIndex] = updatedRoom;
  return sendSuccess(res, updatedRoom, 'Room updated');
});

app.delete('/api/monitoring/rooms/:id', (req, res) => {
  const id = Number(req.params.id);
  const roomIndex = rooms.findIndex((item) => item.id === id);

  if (roomIndex === -1) {
    return sendError(res, 404, 'Room not found');
  }

  rooms.splice(roomIndex, 1);
  return sendSuccess(res, null, 'Room deleted');
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
