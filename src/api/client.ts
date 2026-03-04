/**
 * Cliente HTTP base para la API del backend.
 *
 * Construye la URL concatenando `BASE_URL` (definido por la variable de entorno
 * `API_BASE_URL`) con el path del endpoint. Los `params` del config se serializan
 * como query string, omitiendo valores `undefined` o vacíos.
 *
 * La respuesta se parsea como JSON sólo si el Content-Type del servidor lo indica;
 * de lo contrario se devuelve como texto plano. Las respuestas vacías devuelven `undefined`.
 */

const getBaseUrl = (): string => {
  const url = __API_BASE_URL__;
  if (!url) {
    throw new Error("API_BASE_URL environment variable is required");
  }
  return url.replace(/\/$/, "");
};

const BASE_URL = getBaseUrl();

/**
 * Extiende `RequestInit` con un mapa de query params opcionales.
 * Los valores `undefined` o cadena vacía son ignorados al construir la URL.
 */
export interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

/**
 * Realiza una petición HTTP al backend y devuelve la respuesta tipada.
 * Lanza un `Error` si el servidor responde con un status no-2xx.
 *
 * @param endpoint - Path relativo al `BASE_URL` (ej: `/licitaciones`).
 * @param config - Opciones de fetch extendidas con `params` para query string.
 * @returns La respuesta deserializada como `T`, o `undefined` si el body está vacío.
 */
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
  const contentType = response.headers.get("Content-Type") ?? "";
  if (contentType.includes("application/json")) {
    return JSON.parse(text) as T;
  }
  return text as T;
}

/**
 * Métodos HTTP disponibles. Todos delegan en `request<T>` con el método correspondiente.
 * El body de `post` y `put` se serializa automáticamente como JSON.
 */
export const api = {
  /** GET — recupera un recurso. */
  get: <T>(path: string, config?: RequestConfig) =>
    request<T>(path, { ...config, method: "GET" }),
  /** POST — crea un recurso. */
  post: <T>(path: string, body?: unknown, config?: RequestConfig) =>
    request<T>(path, {
      ...config,
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  /** PUT — reemplaza un recurso existente. */
  put: <T>(path: string, body?: unknown, config?: RequestConfig) =>
    request<T>(path, {
      ...config,
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  /** DELETE — elimina un recurso. */
  delete: <T>(path: string, config?: RequestConfig) =>
    request<T>(path, { ...config, method: "DELETE" }),
};

export { BASE_URL };
