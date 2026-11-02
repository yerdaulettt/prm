import { config } from "@/lib/config";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(config.tokenStorageKey);
}

export function setToken(token: string) {
  localStorage.setItem(config.tokenStorageKey, token);
}

export function clearToken() {
  localStorage.removeItem(config.tokenStorageKey);
}
