"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { roomsApi } from "@/lib/api/rooms";
import { ApiError } from "@/lib/api/errors";
import type { RoomDetails, RoomInput } from "@/types/api";
import { RoomForm } from "@/components/rooms/RoomForm";
import { Alert } from "@/components/ui/Alert";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function EditRoomPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { user, isLoading: authLoading } = useRequireAuth();
  const [room, setRoom] = useState<RoomDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!Number.isInteger(id) || id <= 0) { setError("Room not found."); setIsLoading(false); return; }
    if (authLoading || !user) return;
    const controller = new AbortController();
    roomsApi.get(id, controller.signal)
      .then(setRoom)
      .catch((reason) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setError(reason instanceof ApiError ? reason.message : "Could not load this room.");
      })
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, [id, authLoading, user]);

  if (authLoading || !user || isLoading) return <p className="text-sm text-foreground/55">Loading room…</p>;
  if (!room) return <div className="w-full max-w-lg space-y-4"><Alert type="error">{error || "Room not found."}</Alert><ButtonLink href="/my-rooms" variant="secondary">My rooms</ButtonLink></div>;
  if (!room.isOwner) return <div className="w-full max-w-lg space-y-4"><Alert type="error">You do not own this room and cannot edit it.</Alert><ButtonLink href={`/rooms/${id}`} variant="secondary">Back to room</ButtonLink></div>;

  const input: RoomInput = {
    city: room.city, region: room.region, approximateAddress: room.approximateAddress,
    price: room.price, roomsCount: room.roomsCount, floor: room.floor, bathroomsCount: room.bathroomsCount,
    roommatesCount: room.roommatesCount, gender: room.gender, description: room.description,
    rules: room.rules, otherRules: room.otherRules, taken: room.taken,
  };
  return <Card title="Edit room" wide className="max-w-3xl"><RoomForm mode="edit" roomId={id} initialValue={input} /></Card>;
}
