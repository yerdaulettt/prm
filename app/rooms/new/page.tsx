"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import { RoomForm } from "@/components/rooms/RoomForm";
import { Card } from "@/components/ui/Card";

export default function NewRoomPage() {
  const { user, isLoading } = useRequireAuth();
  if (isLoading || !user) return <p className="text-sm text-foreground/55">Loading…</p>;
  return <Card title="Post a room" wide className="max-w-3xl"><p className="-mt-2 text-sm text-foreground/55">Share the details people need to decide whether your place could be a good fit.</p><RoomForm mode="create" /></Card>;
}
