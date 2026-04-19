import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { config } from '@/config/env';
import { ApiError, ErrorResponse } from '@/types/errors';

interface ApiRequestMeta {
  requestId: string;
  startedAt: number;
  retryCount: number;
}

type RetryAxiosConfig = InternalAxiosRequestConfig & {
  apiMeta?: ApiRequestMeta;
};

const MAX_RETRY_ATTEMPTS = 2;
const RETRY_BASE_DELAY_MS = 300;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createRequestId = () => {
  return `api-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const isRetriableError = (error: AxiosError<ErrorResponse>) => {
  if (error.code === 'ECONNABORTED') {
    return true;
  }

  if (!error.response) {
    return true;
  }

  return error.response.status >= 500;
};

const getBackoffDelay = (retryCount: number) => RETRY_BASE_DELAY_MS * Math.pow(2, retryCount);

const shouldLogApi = config.features.enableDevTools || config.isDevelopment;

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.api.baseURL,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (requestConfig) => {
        const nextConfig = requestConfig as RetryAxiosConfig;

        if (!nextConfig.apiMeta) {
          nextConfig.apiMeta = {
            requestId: createRequestId(),
            startedAt: Date.now(),
            retryCount: 0,
          };
        } else {
          nextConfig.apiMeta.startedAt = Date.now();
        }

        // Add auth token if exists
        const token = localStorage.getItem('accessToken');
        if (token) {
          nextConfig.headers.Authorization = `Bearer ${token}`;
        }

        if (shouldLogApi) {
          const method = (nextConfig.method || 'GET').toUpperCase();
          // Logging request metadata helps debugging request/response flow.
          console.info(`[API] ${method} ${nextConfig.url}#${nextConfig.apiMeta.requestId}`, {
            retryCount: nextConfig.apiMeta.retryCount,
          });
        }

        return nextConfig;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        const responseConfig = response.config as RetryAxiosConfig;
        if (shouldLogApi && responseConfig.apiMeta) {
          const duration = Date.now() - responseConfig.apiMeta.startedAt;
          const method = (responseConfig.method || 'GET').toUpperCase();
          console.info(`[API] ${method} ${responseConfig.url}#${responseConfig.apiMeta.requestId} -> ${response.status} (${duration}ms)`);
        }

        return response;
      },
      async (error: AxiosError<ErrorResponse>) => {
        const errorConfig = error.config as RetryAxiosConfig | undefined;

        if (errorConfig?.apiMeta && isRetriableError(error)) {
          const currentRetry = errorConfig.apiMeta.retryCount;
          if (currentRetry < MAX_RETRY_ATTEMPTS) {
            const nextRetry = currentRetry + 1;
            errorConfig.apiMeta.retryCount = nextRetry;

            const delay = getBackoffDelay(currentRetry);
            if (shouldLogApi) {
              const method = (errorConfig.method || 'GET').toUpperCase();
              console.warn(`[API] retry ${nextRetry}/${MAX_RETRY_ATTEMPTS} for ${method} ${errorConfig.url} in ${delay}ms`);
            }

            await sleep(delay);
            return this.client.request(errorConfig);
          }
        }

        if (error.response) {
          const { status, data } = error.response;

          if (shouldLogApi) {
            const method = (errorConfig?.method || 'GET').toUpperCase();
            const url = errorConfig?.url || 'unknown-url';
            const reqId = errorConfig?.apiMeta?.requestId || 'unknown-request';
            console.error(`[API] ${method} ${url}#${reqId} -> ${status}`, data);
          }

          // Handle 401 - Unauthorized
          if (status === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
          }

          // Handle 403 - Forbidden
          if (status === 403) {
            throw new ApiError(status, 'Access forbidden', data);
          }

          // Handle other errors
          throw new ApiError(
            status,
            data?.message || 'An error occurred',
            data
          );
        }

        // Network error
        if (error.request) {
          if (shouldLogApi) {
            const method = (errorConfig?.method || 'GET').toUpperCase();
            const url = errorConfig?.url || 'unknown-url';
            const reqId = errorConfig?.apiMeta?.requestId || 'unknown-request';
            console.error(`[API] ${method} ${url}#${reqId} -> network error`, error.message);
          }

          throw new ApiError(0, 'Network error. Please check your connection.');
        }

        throw new ApiError(0, error.message);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig) {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig) {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const api = new ApiClient();
