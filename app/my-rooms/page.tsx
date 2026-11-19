"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { roomsApi } from "@/lib/api/rooms";
import { ApiError } from "@/lib/api/errors";
import type { MyRoomSummary } from "@/types/api";
import { Alert } from "@/components/ui/Alert";
import { ButtonLink } from "@/components/ui/Button";

export default function MyRoomsPage() {
  const { user, isLoading: authLoading } = useRequireAuth();
  const [items, setItems] = useState<MyRoomSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading || !user) return;
    const controller = new AbortController();
    roomsApi.mine(controller.signal).then((result) => setItems(result.items ?? []))
      .catch((reason) => { if (!(reason instanceof DOMException && reason.name === "AbortError")) setError(reason instanceof ApiError ? reason.message : "Could not load your rooms."); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [authLoading, user]);

  if (authLoading || !user) return <p className="text-sm text-foreground/55">Loading…</p>;
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-3xl font-semibold">My rooms</h1><p className="mt-1 text-sm text-foreground/55">Manage your listings and availability.</p></div><ButtonLink href="/rooms/new">Post a room</ButtonLink></div>
      {error && <Alert type="error">{error}</Alert>}
      {loading ? <p className="py-10 text-center text-sm text-foreground/55">Loading your rooms…</p> : items.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((room) => (
            <article key={room.id} className="rounded-2xl border border-foreground/10 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold">{room.city}, {room.region}</h2><p className="mt-1 text-sm text-foreground/55">{room.price.toLocaleString()} per month · {room.roomsCount} rooms · floor {room.floor}</p></div><span className={`rounded-full px-3 py-1 text-xs font-medium ${room.taken ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}>{room.taken ? "Taken" : "Active"}</span></div>
              <div className="mt-4 flex items-center justify-between gap-3 text-xs text-foreground/50"><span>{room.viewsCount} views · Posted {new Date(room.publishedAt).toLocaleDateString()}</span><Link href={`/rooms/${room.id}`} className="font-medium text-foreground underline underline-offset-4">Manage listing</Link></div>
            </article>
          ))}
        </div>
      ) : !error ? <div className="rounded-2xl border border-dashed border-foreground/20 p-10 text-center"><p className="font-medium">You have not posted a room yet.</p><p className="mt-1 text-sm text-foreground/55">When you publish a listing, it will appear here.</p><ButtonLink href="/rooms/new" className="mt-4">Post your first room</ButtonLink></div> : null}
    </div>
  );
}
