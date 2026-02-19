// API Configuration
const API_CONFIG = {
  baseURL: 'https://triggerio-backend.onrender.com/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

export const URLS = {
  AUTH: 'https://triggerio-auth.vercel.app',
  DASHBOARD: 'https://triggerio-dashboard.vercel.app',
  MAIN: 'https://triggerio.io',
  API: API_CONFIG.baseURL,
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'خطأ في الاتصال بالإنترنت',
  TIMEOUT: 'انتهت مهلة الاتصال، يرجى المحاولة مرة أخرى',
  UNAUTHORIZED: 'يجب تسجيل الدخول أولاً',
  FORBIDDEN: 'ليس لديك صلاحية للوصول',
  NOT_FOUND: 'المورد المطلوب غير موجود',
  SERVER_ERROR: 'خطأ في الخادم، يرجى المحاولة لاحقاً',
  UNKNOWN: 'حدث خطأ غير متوقع',
};

export default API_CONFIG;
