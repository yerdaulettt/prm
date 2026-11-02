import { apiFetch } from "@/lib/api/client";
import type { User } from "@/types/api";

export const usersApi = {
  me: () => apiFetch<User>("/users/me", { auth: true }),
};
