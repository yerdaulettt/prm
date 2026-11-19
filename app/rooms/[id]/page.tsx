"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { roomsApi } from "@/lib/api/rooms";
import { ApiError } from "@/lib/api/errors";
import type { RoomDetails } from "@/types/api";
import { RoomDetail } from "@/components/rooms/RoomDetail";
import { Alert } from "@/components/ui/Alert";
import { ButtonLink } from "@/components/ui/Button";

export default function RoomDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { user, isLoading: authLoading } = useRequireAuth();
  const router = useRouter();
  const [room, setRoom] = useState<RoomDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const requestedRoomId = useRef<number | null>(null);

  useEffect(() => {
    if (!Number.isInteger(id) || id <= 0) { setRoom(null); setError("Room not found."); setIsLoading(false); return; }
    if (authLoading || !user || requestedRoomId.current === id) return;
    requestedRoomId.current = id;
    setRoom(null); setError(""); setIsLoading(true);
    roomsApi.get(id)
      .then((result) => { if (requestedRoomId.current === id) setRoom(result); })
      .catch((reason) => {
        if (requestedRoomId.current !== id) return;
        setError(reason instanceof ApiError ? reason.message : "Could not load this room.");
      })
      .finally(() => { if (requestedRoomId.current === id) setIsLoading(false); });
  }, [id, authLoading, user]);

  async function handleDelete() {
    if (!room || !window.confirm("Delete this room permanently? This cannot be undone.")) return;
    setDeleting(true); setError("");
    try {
      await roomsApi.remove(room.id);
      router.replace("/my-rooms");
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "Could not delete this room.");
      setDeleting(false);
    }
  }

  if (authLoading || !user || isLoading) return <p className="text-sm text-foreground/55">Loading room…</p>;
  if (!room) return <div className="w-full max-w-lg space-y-4"><Alert type="error">{error || "Room not found."}</Alert><ButtonLink href="/">Back to rooms</ButtonLink></div>;
  return <div className="w-full space-y-4">{error && <Alert type="error">{error}</Alert>}<RoomDetail room={room} onDelete={handleDelete} deleting={deleting} /></div>;
}
