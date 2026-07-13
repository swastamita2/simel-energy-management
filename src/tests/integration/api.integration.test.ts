/**
 * @file api.integration.test.ts
 * @description Integration Test untuk ApiClient SIMEL
 * @test-level Integration Testing
 * @technique Incremental Integration — Top-Down approach
 * @prerequisite Backend harus berjalan di http://localhost:3000
 *              jalankan: cd backend && npm run dev
 *
 * @note Test ini TIDAK menggunakan mock. Menguji integrasi nyata
 *       antara frontend API client dan backend Express server.
 *
 * Jalankan dengan: npm run test -- api.integration
 */

import axios from 'axios';
import { beforeAll, afterAll, describe, expect, it, vi } from 'vitest';

const BASE_URL = 'http://localhost:3000/api';

let apiClient: typeof import('@/services/api').api;
let accessToken = '';
let createdRoomId: number | null = null;

// ─── Setup: Login dan dapatkan token sebelum semua test ──────────────────────
beforeAll(async () => {
  vi.resetModules();
  vi.stubEnv('VITE_ENABLE_DEV_TOOLS', 'true');
  vi.stubEnv('VITE_API_BASE_URL', BASE_URL);
  vi.stubEnv('VITE_ENABLE_MOCK_DATA', 'false');

  const apiModule = await import('@/services/api');
  apiClient = apiModule.api;

  // IT-AUTH-SETUP: Login untuk mendapatkan Bearer Token
  const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
    email: 'admin@itpln.ac.id',
    password: 'admin123',
  });

  accessToken = loginResponse.data.data.accessToken;
  localStorage.setItem('accessToken', accessToken);
});

// ─── Teardown: Bersihkan sesi setelah semua test ─────────────────────────────
afterAll(() => {
  localStorage.removeItem('accessToken');
  vi.unstubAllEnvs();
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Integration — ApiClient Reliability', () => {
  /**
   * IT-API-01
   * Memverifikasi bahwa ApiClient secara otomatis melakukan retry
   * saat mendapat error 500 sementara, dan berhasil pada percobaan berikutnya.
   */
  it('IT-API-01: retry sekali saat mendapat error 500 sementara dan sukses pada percobaan ke-2', async () => {
    await axios.post(
      `${BASE_URL}/monitoring/test/reset`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const response = await apiClient.get<{ success: boolean; data: { attempts: number; key: string } }>(
      '/monitoring/test/fail-once?key=retry-suite'
    );

    expect(response.success).toBe(true);
    expect(response.data.attempts).toBe(2);
    expect(
      warnSpy.mock.calls.some((entry) => String(entry[0]).includes('retry 1/2'))
    ).toBe(true);
  });

  /**
   * IT-API-02
   * Memverifikasi bahwa ApiClient melempar ApiError dengan statusCode: 0
   * setelah semua percobaan retry habis akibat timeout.
   */
  it('IT-API-02: melempar ApiError setelah semua retry habis akibat timeout', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await expect(
      apiClient.get('/monitoring/test/slow?delayMs=1400', { timeout: 200 })
    ).rejects.toMatchObject({
      name: 'ApiError',
      statusCode: 0,
      message: 'Network error. Please check your connection.',
    });

    expect(
      warnSpy.mock.calls.some((entry) => String(entry[0]).includes('retry 1/2'))
    ).toBe(true);
    expect(
      warnSpy.mock.calls.some((entry) => String(entry[0]).includes('retry 2/2'))
    ).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Integration — Authentication & Authorization Flow', () => {
  /**
   * IT-AUTH-01
   * Memverifikasi bahwa Login API mengembalikan accessToken yang valid
   * dengan struktur response yang sesuai.
   */
  it('IT-AUTH-01: POST /auth/login dengan kredensial valid menghasilkan accessToken', async () => {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@itpln.ac.id',
      password: 'admin123',
    });

    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(response.data.data.accessToken).toBeDefined();
    expect(response.data.data.user.role).toBe('admin');
  });

  /**
   * IT-AUTH-02
   * Memverifikasi bahwa request ke protected endpoint TANPA token
   * menghasilkan response 401 Unauthorized.
   */
  it('IT-AUTH-02: request ke protected endpoint tanpa token menghasilkan 401 Unauthorized', async () => {
    const response = await axios.get(`${BASE_URL}/monitoring/rooms`, {
      headers: { Authorization: '' },
      validateStatus: () => true, // Jangan throw pada status error
    });

    expect(response.status).toBe(401);
  });

  /**
   * IT-AUTH-03
   * Memverifikasi bahwa request ke protected endpoint dengan token invalid/expired
   * menghasilkan response 401 Unauthorized.
   */
  it('IT-AUTH-03: request dengan token invalid/expired menghasilkan 401 Unauthorized', async () => {
    const response = await axios.get(`${BASE_URL}/monitoring/rooms`, {
      headers: { Authorization: 'Bearer invalid-token-xyz-123' },
      validateStatus: () => true,
    });

    expect(response.status).toBe(401);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Integration — Rooms CRUD Full Lifecycle', () => {
  /**
   * IT-ROOM-01
   * Memverifikasi bahwa GET /monitoring/rooms dengan token valid
   * mengembalikan daftar ruangan dalam format array JSON.
   */
  it('IT-ROOM-01: GET /monitoring/rooms menghasilkan 200 OK dengan array data rooms', async () => {
    const response = await axios.get(`${BASE_URL}/monitoring/rooms`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(Array.isArray(response.data.data)).toBe(true);
  });

  /**
   * IT-ROOM-02
   * Memverifikasi bahwa POST /monitoring/rooms dengan payload valid
   * menghasilkan 201 Created dan menyimpan data ke database.
   */
  it('IT-ROOM-02: POST /monitoring/rooms menghasilkan 201 Created untuk payload valid', async () => {
    const payload = {
      name: `Integration Test Room ${Date.now()}`,
      building: 'Gedung Integration Test',
      enabled: true,
    };

    const response = await axios.post(`${BASE_URL}/monitoring/rooms`, payload, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    expect(response.status).toBe(201);
    expect(response.data.success).toBe(true);
    expect(response.data.data.name).toBe(payload.name);

    // Simpan ID untuk test berikutnya
    createdRoomId = response.data.data.id;
  });

  /**
   * IT-ROOM-03
   * Memverifikasi bahwa POST /monitoring/rooms dengan payload yang skemanya salah
   * (missing required fields) menghasilkan 400 Bad Request.
   */
  it('IT-ROOM-03: POST /monitoring/rooms dengan payload tidak lengkap menghasilkan 400 Bad Request', async () => {
    const response = await axios.post(
      `${BASE_URL}/monitoring/rooms`,
      { building: 'Gedung Tanpa Nama' }, // 'name' tidak ada
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  /**
   * IT-ROOM-04
   * Memverifikasi bahwa PUT /monitoring/rooms/:id dengan ID valid
   * berhasil memperbarui data room dan mengembalikan 200 OK.
   */
  it('IT-ROOM-04: PUT /monitoring/rooms/:id menghasilkan 200 OK untuk ID yang valid', async () => {
    if (!createdRoomId) {
      console.warn('Skipping IT-ROOM-04: createdRoomId is null (IT-ROOM-02 may have failed)');
      return;
    }

    const updatePayload = { name: 'Integration Test Room — Updated', enabled: false };
    const response = await axios.put(
      `${BASE_URL}/monitoring/rooms/${createdRoomId}`,
      updatePayload,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    expect(response.status).toBe(200);
    expect(response.data.data.name).toBe(updatePayload.name);
  });

  /**
   * IT-ROOM-05
   * Memverifikasi bahwa PUT /monitoring/rooms/:id dengan ID yang tidak ada
   * menghasilkan 404 Not Found.
   */
  it('IT-ROOM-05: PUT /monitoring/rooms/:id menghasilkan 404 untuk ID yang tidak ada', async () => {
    const response = await axios.put(
      `${BASE_URL}/monitoring/rooms/99999`,
      { name: 'Ghost Room' },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(404);
  });

  /**
   * IT-ROOM-06
   * Memverifikasi bahwa DELETE /monitoring/rooms/:id berhasil menghapus room
   * yang dibuat pada IT-ROOM-02 dan mengembalikan 200 OK.
   */
  it('IT-ROOM-06: DELETE /monitoring/rooms/:id menghasilkan 200 OK untuk ID yang valid', async () => {
    if (!createdRoomId) {
      console.warn('Skipping IT-ROOM-06: createdRoomId is null (IT-ROOM-02 may have failed)');
      return;
    }

    const response = await axios.delete(`${BASE_URL}/monitoring/rooms/${createdRoomId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    createdRoomId = null; // Reset
  });

  /**
   * IT-ROOM-07
   * Memverifikasi bahwa duplikasi kombinasi name + building
   * menghasilkan 409 Conflict.
   */
  it('IT-ROOM-07: POST /monitoring/rooms dengan kombinasi name+building duplikat menghasilkan 409 Conflict', async () => {
    const payload = {
      name: 'Lab Komputer 1',
      building: 'Gedung A - Lt. 2',
    };

    const firstResponse = await axios.post(`${BASE_URL}/monitoring/rooms`, payload, {
      headers: { Authorization: `Bearer ${accessToken}` },
      validateStatus: () => true,
    });

    // Coba buat ulang dengan kombinasi yang sama
    const duplicateResponse = await axios.post(`${BASE_URL}/monitoring/rooms`, payload, {
      headers: { Authorization: `Bearer ${accessToken}` },
      validateStatus: () => true,
    });

    // Jika response pertama sukses (201), response kedua harus 409
    if (firstResponse.status === 201) {
      expect(duplicateResponse.status).toBe(409);
      // Cleanup room yang baru dibuat
      if (firstResponse.data.data?.id) {
        await axios.delete(`${BASE_URL}/monitoring/rooms/${firstResponse.data.data.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          validateStatus: () => true,
        });
      }
    } else {
      // Room sudah ada, duplikasi harus 409
      expect(duplicateResponse.status).toBe(409);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Integration — Payload Validation', () => {
  /**
   * IT-API-03
   * Memverifikasi bahwa endpoint menolak payload dengan tipe data yang salah
   * (misal: number pada field yang seharusnya string).
   */
  it('IT-API-03: payload dengan tipe data salah pada field name menghasilkan 400 Bad Request', async () => {
    const response = await axios.post(
      `${BASE_URL}/monitoring/rooms`,
      { name: 12345, building: 'Valid Building' }, // name seharusnya string
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });
});
