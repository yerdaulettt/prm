"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { roomsApi } from "@/lib/api/rooms";
import { ApiError } from "@/lib/api/errors";
import type { RoomSummary } from "@/types/api";
import { RoomCard } from "@/components/rooms/RoomCard";
import { Alert } from "@/components/ui/Alert";
import { ButtonLink } from "@/components/ui/Button";

export default function HomePage() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<RoomSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    roomsApi.list(controller.signal)
      .then((result) => setRooms(result.items ?? []))
      .catch((reason) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setError(reason instanceof ApiError ? reason.message : "Could not load rooms. Please try again.");
      })
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, []);

  return (
    <div className="w-full space-y-8">
      <section className="flex flex-col justify-between gap-5 rounded-3xl bg-[#e8eee5] px-6 py-9 sm:flex-row sm:items-end sm:px-10 sm:py-12">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#52664c]">A better way to share a home</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Find a room. Find your people.</h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-foreground/65 sm:text-base">Browse room listings and connect with people looking for a considerate roommate.</p>
        </div>
        {user && <ButtonLink href="/rooms/new" className="shrink-0">Post a room</ButtonLink>}
      </section>
      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><h2 className="text-2xl font-semibold">Rooms available</h2><p className="mt-1 text-sm text-foreground/55">Listings currently looking for roommates.</p></div>
          {user && <ButtonLink href="/my-rooms" variant="secondary">Manage my rooms</ButtonLink>}
        </div>
        {error && <Alert type="error">{error}</Alert>}
        {isLoading ? <p className="py-10 text-center text-sm text-foreground/55">Loading rooms…</p> : rooms.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{rooms.map((room) => <RoomCard key={room.id} room={room} />)}</div>
        ) : !error ? <div className="rounded-2xl border border-dashed border-foreground/20 p-10 text-center"><p className="font-medium">No rooms are listed right now.</p><p className="mt-1 text-sm text-foreground/55">Check back soon for new listings.</p></div> : null}
      </section>
    </div>
  );
}
