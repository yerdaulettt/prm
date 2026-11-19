"use client";

import { useEffect, useState } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { roommatesApi } from "@/lib/api/roommates";
import { ApiError } from "@/lib/api/errors";
import type { RoommateSummary } from "@/types/api";
import { RoommateCard } from "@/components/roommates/RoommateCard";
import { Alert } from "@/components/ui/Alert";

export default function RoommatesPage() {
  const { user, isLoading: authLoading } = useRequireAuth();
  const [items, setItems] = useState<RoommateSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading || !user) return;
    const controller = new AbortController();
    roommatesApi.list(controller.signal).then((result) => setItems(result.items ?? []))
      .catch((reason) => { if (!(reason instanceof DOMException && reason.name === "AbortError")) setError(reason instanceof ApiError ? reason.message : "Could not load roommate profiles."); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [authLoading, user]);

  if (authLoading || !user) return <p className="text-sm text-foreground/55">Loading…</p>;
  return (
    <div className="w-full space-y-6">
      <div><h1 className="text-3xl font-semibold">Find a roommate</h1><p className="mt-1 text-sm text-foreground/55">Browse people who have chosen to make their profile visible.</p></div>
      {error && <Alert type="error">{error}</Alert>}
      {loading ? <p className="py-10 text-center text-sm text-foreground/55">Loading profiles…</p> : items.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{items.map((item) => <RoommateCard key={item.userId} roommate={item} />)}</div>
      ) : !error ? <div className="rounded-2xl border border-dashed border-foreground/20 p-10 text-center"><p className="font-medium">No roommate profiles yet.</p><p className="mt-1 text-sm text-foreground/55">You can make your profile visible from your profile settings.</p></div> : null}
    </div>
  );
}
