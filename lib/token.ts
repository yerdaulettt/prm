import { config } from "@/lib/config";

const AUTH_CHANGED_EVENT = "roomi:auth-changed";
let memoryToken: string | null = null;

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(config.tokenStorageKey);
    memoryToken = stored;
    return stored;
  } catch {
    return memoryToken;
  }
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  memoryToken = token;
  try { window.localStorage.setItem(config.tokenStorageKey, token); } catch {}
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function clearToken() {
  if (typeof window === "undefined") return;
  memoryToken = null;
  try { window.localStorage.removeItem(config.tokenStorageKey); } catch {}
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function authChangedEventName() {
  return AUTH_CHANGED_EVENT;
}
