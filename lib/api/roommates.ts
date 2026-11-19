import { apiFetch } from "@/lib/api/client";
import type { ItemsResponse, PublicProfile, RoommateSummary } from "@/types/api";

export const roommatesApi = {
  list: (signal?: AbortSignal) => apiFetch<ItemsResponse<RoommateSummary>>("/roommates", { auth: true, signal }),
  get: (userId: number, signal?: AbortSignal) => apiFetch<PublicProfile>(`/roommates/${userId}`, { auth: true, signal }),
};
