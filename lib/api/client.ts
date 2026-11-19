import { config } from "@/lib/config";
import { getToken, clearToken } from "@/lib/token";
import { ApiError, normalizeApiError } from "@/lib/api/errors";
import { fakeApiFetch } from "@/lib/api/fake";

export { ApiError } from "@/lib/api/errors";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type ApiOptions = {
  method?: HttpMethod;
  body?: unknown;
  auth?: boolean;
  signal?: AbortSignal;
};

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, auth = false, signal } = options;
  const token = auth ? getToken() : null;

  if (config.useFakeApi) {
    try {
      return await fakeApiFetch<T>(path, { method, body, token, signal });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401 && auth) clearToken();
      throw error;
    }
  }

  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${config.apiUrl.replace(/\/$/, "")}${config.apiPrefix}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
      cache: "no-store",
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError(0, "Cannot reach the server. Please try again.");
  }

  if (response.status === 401 && auth) clearToken();
  if (response.status === 204) return undefined as T;

  const raw = await response.text();
  let payload: unknown = null;
  if (raw) {
    try {
      payload = JSON.parse(raw);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) throw normalizeApiError(response.status, payload);
  return payload as T;
}
