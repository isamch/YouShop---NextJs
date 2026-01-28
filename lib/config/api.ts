// API Configuration for YouShop Frontend
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/profile",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },

  // Catalog endpoints
  CATALOG: {
    PRODUCTS: "/catalog/products",
    PRODUCT_BY_ID: (id: string) => `/catalog/products/${id}`,
    CATEGORIES: "/catalog/categories",
    CATEGORY_BY_ID: (id: string) => `/catalog/categories/${id}`,
  },

  // Inventory endpoints
  INVENTORY: {
    SKU: "/inventory/sku",
    STOCK: "/inventory/stock",
    STOCK_BY_SKU: (skuId: string) => `/inventory/stock/${skuId}`,
  },

  // Orders endpoints
  ORDERS: {
    CREATE: "/orders",
    LIST: "/orders",
    BY_ID: (id: string) => `/orders/${id}`,
    BY_NUMBER: (orderNumber: string) => `/orders/number/${orderNumber}`,
    HISTORY: (id: string) => `/orders/${id}/history`,
    UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    SHIP: (id: string) => `/orders/${id}/ship`,
  },

  // Payment endpoints
  PAYMENTS: {
    CREATE_INTENT: "/payments/create-intent",
    CONFIRM: "/payments/confirm",
    STATUS: (paymentIntentId: string) => `/payments/status/${paymentIntentId}`,
    REFUND: "/payments/refund",
    WEBHOOK: "/payments/webhook",
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Request Headers
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
} as const;
