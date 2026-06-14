const API_BASE =
  process.env.NEXT_PUBLIC_TRAFFIX_API_BASE ||
  "http://localhost:8000";

export function apiUrl(path: string): string {
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export { API_BASE };
