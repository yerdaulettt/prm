import { apiFetch } from "@/lib/api/client";
import type { ProfileInput, User } from "@/types/api";

export const usersApi = {
  me: (signal?: AbortSignal) => apiFetch<User>("/users/me", { auth: true, signal }),
  updateProfile: (profile: ProfileInput) => apiFetch<User>("/users/me", { method: "PUT", body: profile, auth: true }),
};
