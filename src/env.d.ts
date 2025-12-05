/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_DESCRIPTION: string;
  readonly VITE_ENABLE_MOCK_DATA: string;
  readonly VITE_ENABLE_DEV_TOOLS: string;
  readonly VITE_REFRESH_INTERVAL: string;
  readonly VITE_CHART_ANIMATION: string;
  readonly VITE_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
