// API Endpoints
const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    UPLOAD_AVATAR: '/users/avatar',
  },
  CONTACTS: {
    BASE: '/contacts',
    BY_ID: (id) => `/contacts/${id}`,
    IMPORT: '/contacts/import',
    EXPORT: '/contacts/export',
    BULK_DELETE: '/contacts/bulk-delete',
    SEARCH: '/contacts/search',
    TAGS: '/contacts/tags',
    STATS: '/contacts/stats',
  },
  CAMPAIGNS: {
    BASE: '/campaigns',
    BY_ID: (id) => `/campaigns/${id}`,
    SEND: (id) => `/campaigns/${id}/send`,
    PAUSE: (id) => `/campaigns/${id}/pause`,
    RESUME: (id) => `/campaigns/${id}/resume`,
    STATS: (id) => `/campaigns/${id}/stats`,
    RECIPIENTS: (id) => `/campaigns/${id}/recipients`,
  },
  TEMPLATES: {
    BASE: '/templates',
    BY_ID: (id) => `/templates/${id}`,
    DUPLICATE: (id) => `/templates/${id}/duplicate`,
    TEST: (id) => `/templates/${id}/test`,
  },
  AUTOMATION: {
    BASE: '/automation',
    BY_ID: (id) => `/automation/${id}`,
    TOGGLE: (id) => `/automation/${id}/toggle`,
    STATS: (id) => `/automation/${id}/stats`,
    LOGS: (id) => `/automation/${id}/logs`,
  },
  AUTO_RESPONSES: {
    BASE: '/auto-responses',
    BY_ID: (id) => `/auto-responses/${id}`,
    TOGGLE: (id) => `/auto-responses/${id}/toggle`,
    TEST: (id) => `/auto-responses/${id}/test`,
  },
  SOCIAL: {
    INSTAGRAM: {
      CONNECT: '/social/instagram/connect',
      DISCONNECT: '/social/instagram/disconnect',
      POSTS: '/social/instagram/posts',
      COMMENTS: '/social/instagram/comments',
      REPLY: '/social/instagram/reply',
    },
    FACEBOOK: {
      CONNECT: '/social/facebook/connect',
      DISCONNECT: '/social/facebook/disconnect',
      POSTS: '/social/facebook/posts',
      COMMENTS: '/social/facebook/comments',
      REPLY: '/social/facebook/reply',
    },
    INBOX: '/social/inbox',
    CONVERSATIONS: '/social/conversations',
  },
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    CONTACTS: '/analytics/contacts',
    CAMPAIGNS: '/analytics/campaigns',
    SOCIAL: '/analytics/social',
    ENGAGEMENT: '/analytics/engagement',
    REVENUE: '/analytics/revenue',
  },
  SETTINGS: {
    GENERAL: '/settings/general',
    INTEGRATIONS: '/settings/integrations',
    NOTIFICATIONS: '/settings/notifications',
    BILLING: '/settings/billing',
    TEAM: '/settings/team',
  },
  INTEGRATIONS: {
    GHL: {
      CONNECT: '/integrations/ghl/connect',
      DISCONNECT: '/integrations/ghl/disconnect',
      SYNC: '/integrations/ghl/sync',
      WEBHOOKS: '/integrations/ghl/webhooks',
    },
    BREVO: {
      TEST: '/integrations/brevo/test',
      STATUS: '/integrations/brevo/status',
    },
  },
  TEST: {
    SEND_EMAIL: '/test/send-email',
    HEALTH: '/health',
  },
};

export default ENDPOINTS;
