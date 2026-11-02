import { config } from "@/lib/config";
import { getToken } from "@/lib/token";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type Options = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
};

export async function apiFetch<T>(
  path: string,
  { method = "GET", body, auth = false }: Options = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${config.apiPrefix}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "Cannot reach the server. Please try again.");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message ?? data?.error ?? "Something went wrong.";
    throw new ApiError(response.status, message);
  }

  return data as T;
}
