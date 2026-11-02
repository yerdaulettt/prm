import { apiFetch } from "@/lib/api/client";
import type { LoginResponse, MessageResponse } from "@/types/api";

export const authApi = {
  register: (email: string, password: string) =>
    apiFetch<MessageResponse>("/auth/register", {
      method: "POST",
      body: { email, password },
    }),

  confirm: (token: string) =>
    apiFetch<MessageResponse>(`/auth/confirm?token=${encodeURIComponent(token)}`),

  resend: (email: string) =>
    apiFetch<MessageResponse>("/auth/resend", {
      method: "POST",
      body: { email },
    }),

  login: (email: string, password: string) =>
    apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: { email, password },
    }),
};
