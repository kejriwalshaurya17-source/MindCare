// Central API base URL.
// Set VITE_API_URL in production when the frontend and API use different hosts.
// In production, an empty base uses the same origin as the deployed Express server.
// For local Vite development, set VITE_API_URL=http://localhost:5000 if needed.
export const API_BASE = (
  import.meta.env.VITE_API_URL || ""
).replace(/\/$/, "");

export function apiUrl(path) {
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}
