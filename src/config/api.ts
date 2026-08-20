/**
 * Centralised API configuration.
 *
 * In development, defaults to http://localhost:5001 if VITE_API_URL is not set.
 * In production builds, VITE_API_URL can be set to the backend URL (e.g. Render backend URL).
 */
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:5001'
).replace(/\/+$/, '');

/**
 * Builds a full API URL given a path (e.g., '/api/chat/stream').
 */
export function apiUrl(path: string): string {
  const normalised = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalised}`;
}
