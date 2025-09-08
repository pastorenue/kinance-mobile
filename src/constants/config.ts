export const API_CONFIG = {
  BASE_URL: __DEV__ ? 'http://localhost:8080' : 'https://your-production-api.com',
  API_VERSION: 'v1',
  TIMEOUT: 10000,
} as const;

export const APP_CONFIG = {
  APP_NAME: 'Kinance',
  VERSION: '1.0.0',
  STORAGE_KEYS: {
    ACCESS_TOKEN: '@kinance:access_token',
    REFRESH_TOKEN: '@kinance:refresh_token',
    USER_DATA: '@kinance:user_data',
  },
} as const;

export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/v1/auth/register',
    LOGIN: '/api/v1/auth/login',
    REFRESH: '/api/v1/auth/refresh',
  },
  USERS: {
    PROFILE: '/api/v1/users/profile',
    FAMILY: '/api/v1/users/family',
  },
  BUDGETS: {
    LIST: '/api/v1/budgets',
    DETAIL: (id: string) => `/api/v1/budgets/${id}`,
  },
  TRANSACTIONS: {
    LIST: '/api/v1/transactions',
    DETAIL: (id: string) => `/api/v1/transactions/${id}`,
  },
  RECEIPTS: {
    UPLOAD: '/api/v1/receipts/upload',
    LIST: '/api/v1/receipts',
    DETAIL: (id: string) => `/api/v1/receipts/${id}`,
  },
} as const;
