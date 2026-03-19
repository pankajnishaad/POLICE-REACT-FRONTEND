/**
 * utils/api.js
 * ─────────────────────────────────────────────────────────────
 * Axios instance + typed API call functions.
 *
 * Development: React proxy (package.json "proxy") forwards
 *   all /api/* calls to http://localhost:4000 automatically.
 *
 * Production: set REACT_APP_API_URL=https://api.yourdomain.com
 * ─────────────────────────────────────────────────────────────
 */

import axios from 'axios';

// ── Axios instance ────────────────────────────────────────────
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor ───────────────────────────────────────
api.interceptors.request.use((config) => {
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[API →] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  }
  return config;
});

// ── Response interceptor ──────────────────────────────────────
// Normalise all errors → callers always get { message: string }
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.error   ||
      error?.response?.data?.message ||
      error?.message                 ||
      'An unexpected error occurred. Please try again.';
    return Promise.reject(new Error(message));
  }
);

// ── Typed API calls ───────────────────────────────────────────

/**
 * Submit an anonymous police violence report.
 * @param {Object} payload
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const submitReport = async (payload) => {
  const { data } = await api.post('/report', payload);
  return data;
};

/**
 * Fetch aggregated statistics from the backend.
 * @returns {Promise<{ success: boolean, data: object }>}
 */
export const fetchStats = async () => {
  const { data } = await api.get('/stats');
  return data;
};

/**
 * Check backend + database health.
 * @returns {Promise<{ status: string, database: object }>}
 */
export const checkHealth = async () => {
  const { data } = await api.get('/health');
  return data;
};

export default api;
