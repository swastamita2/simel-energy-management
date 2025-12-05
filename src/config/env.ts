export const config = {
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  },
  app: {
    title: import.meta.env.VITE_APP_TITLE || 'Energy Management Dashboard',
    description: import.meta.env.VITE_APP_DESCRIPTION || 'Real-time monitoring and analytics',
  },
  features: {
    enableMockData: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
    enableDevTools: import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true',
  },
  monitoring: {
    refreshInterval: parseInt(import.meta.env.VITE_REFRESH_INTERVAL) || 5000,
    chartAnimation: import.meta.env.VITE_CHART_ANIMATION === 'true',
  },
  env: import.meta.env.VITE_ENV || 'development',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;
