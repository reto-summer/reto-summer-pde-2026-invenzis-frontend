/**
 * Cliente HTTP base para la API del backend.
 * Base URL: API_BASE_URL (.env). api.get<T>(path, config?) con params → query string.
 */

const getBaseUrl = (): string => {
  const url = __API_BASE_URL__;
  console.log("API_BASE_URL cargada:", url); // <- Temporal para debug
  if (!url) {
    throw new Error("API_BASE_URL environment variable is required");
  }
  return url.replace(/\/$/, "");
};

const BASE_URL = getBaseUrl();

export interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

async function request<T>(
  endpoint: string,
  config: RequestConfig = {},
): Promise<T> {
  const { params, ...init } = config;
  const url = new URL(endpoint, BASE_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }
  const response = await fetch(url.toString(), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `HTTP ${response.status}`);
  }
  const text = await response.text();
  if (!text.trim()) return undefined as T;
  return JSON.parse(text) as T;
}

export const api = {
  get: <T>(path: string, config?: RequestConfig) =>
    request<T>(path, { ...config, method: "GET" }),
  post: <T>(path: string, body?: unknown, config?: RequestConfig) =>
    request<T>(path, {
      ...config,
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string, config?: RequestConfig) =>
    request<T>(path, { ...config, method: "DELETE" }),
};

export { BASE_URL };
