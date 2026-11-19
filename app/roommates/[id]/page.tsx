"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { roommatesApi } from "@/lib/api/roommates";
import { ApiError } from "@/lib/api/errors";
import type { PublicProfile as PublicProfileType } from "@/types/api";
import { PublicProfile } from "@/components/roommates/PublicProfile";
import { Alert } from "@/components/ui/Alert";
import { ButtonLink } from "@/components/ui/Button";

export default function RoommateDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { user, isLoading: authLoading } = useRequireAuth();
  const [profile, setProfile] = useState<PublicProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!Number.isInteger(id) || id <= 0) { setError("Roommate profile not found."); setLoading(false); return; }
    if (authLoading || !user) return;
    const controller = new AbortController();
    roommatesApi.get(id, controller.signal).then(setProfile)
      .catch((reason) => { if (!(reason instanceof DOMException && reason.name === "AbortError")) setError(reason instanceof ApiError ? reason.message : "Could not load this profile."); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [id, authLoading, user]);

  if (authLoading || !user || loading) return <p className="text-sm text-foreground/55">Loading profile…</p>;
  if (!profile) return <div className="w-full max-w-lg space-y-4"><Alert type="error">{error || "Roommate profile not found."}</Alert><ButtonLink href="/roommates" variant="secondary">Back to roommates</ButtonLink></div>;
  return <div className="w-full space-y-4"><ButtonLink href="/roommates" variant="secondary">← All roommates</ButtonLink><PublicProfile profile={profile} /></div>;
}
