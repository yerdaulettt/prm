import { apiFetch } from "@/lib/api/client";
import type { ItemsResponse, MyRoomSummary, RoomDetails, RoomInput, RoomSummary } from "@/types/api";

export const roomsApi = {
  list: (signal?: AbortSignal) => apiFetch<ItemsResponse<RoomSummary>>("/rooms", { signal }),
  get: (id: number, signal?: AbortSignal) => apiFetch<RoomDetails>(`/rooms/${id}`, { auth: true, signal }),
  create: (input: RoomInput) => apiFetch<RoomDetails>("/rooms", { method: "POST", body: input, auth: true }),
  update: (id: number, input: RoomInput) => apiFetch<RoomDetails>(`/rooms/${id}`, { method: "PUT", body: input, auth: true }),
  remove: (id: number) => apiFetch<void>(`/rooms/${id}`, { method: "DELETE", auth: true }),
  mine: (signal?: AbortSignal) => apiFetch<ItemsResponse<MyRoomSummary>>("/users/me/rooms", { auth: true, signal }),
};
