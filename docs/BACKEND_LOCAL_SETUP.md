# Backend Local Setup (Admin Room CRUD)

This document explains how to run local backend mode for Admin Room CRUD.

## 1. Start Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Backend runs at `http://localhost:3000`.

## 2. Configure Frontend

Use these values in `.env.local`:

```env
VITE_API_BASE_URL=/api
VITE_API_PROXY_TARGET=http://localhost:3000
VITE_ENABLE_MOCK_DATA=false
```

Then start frontend:

```bash
npm run dev
```

## 3. Available API Endpoints

### Public

- `GET /api/health`
- `POST /api/auth/login`

### Protected (Bearer Token required)

- `GET /api/monitoring/rooms`
- `GET /api/monitoring/rooms/:id`
- `POST /api/monitoring/rooms`
- `PUT /api/monitoring/rooms/:id`
- `DELETE /api/monitoring/rooms/:id`

## 4. Default Login

- Email: `admin@itpln.ac.id`
- Password: `admin123`

## 5. Quick Verification (PowerShell)

```powershell
$body = @{ email='admin@itpln.ac.id'; password='admin123' } | ConvertTo-Json
$login = Invoke-RestMethod -Method POST -Uri http://localhost:3000/api/auth/login -ContentType 'application/json' -Body $body
$token = $login.data.accessToken

Invoke-RestMethod -Method GET -Uri http://localhost:3000/api/monitoring/rooms -Headers @{ Authorization = "Bearer $token" }
```

## 6. Notes

- Data is in-memory and resets when backend restarts.
- This setup is for development and API integration testing.
