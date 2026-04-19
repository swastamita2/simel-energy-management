import axios from 'axios';
import { beforeAll, afterAll, describe, expect, it, vi } from 'vitest';

const BASE_URL = 'http://localhost:3000/api';

let apiClient: typeof import('./api').api;
let accessToken = '';

beforeAll(async () => {
  vi.resetModules();
  vi.stubEnv('VITE_ENABLE_DEV_TOOLS', 'true');
  vi.stubEnv('VITE_API_BASE_URL', BASE_URL);
  vi.stubEnv('VITE_ENABLE_MOCK_DATA', 'false');

  const apiModule = await import('./api');
  apiClient = apiModule.api;

  const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
    email: 'admin@itpln.ac.id',
    password: 'admin123',
  });

  accessToken = loginResponse.data.data.accessToken;
  localStorage.setItem('accessToken', accessToken);
});

afterAll(() => {
  localStorage.removeItem('accessToken');
  vi.unstubAllEnvs();
});

describe('ApiClient integration checks', () => {
  it('retries once on transient 500 and then succeeds', async () => {
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

  it('handles timeout after retries and throws ApiError', async () => {
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
