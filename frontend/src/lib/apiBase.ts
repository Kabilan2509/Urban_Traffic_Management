const DEFAULT_PRODUCTION_API_BASE =
  "https://urban-traffic-backend-xb8s.onrender.com";

const API_BASE =
  process.env.NEXT_PUBLIC_TRAFFIX_API_BASE ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : DEFAULT_PRODUCTION_API_BASE);

export function apiUrl(path: string): string {
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export { API_BASE };
