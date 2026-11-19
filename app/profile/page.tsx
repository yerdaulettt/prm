"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Card } from "@/components/ui/Card";

export default function ProfilePage() {
  const { user, isLoading } = useRequireAuth();
  if (isLoading || !user) return <p className="text-sm text-foreground/55">Loading profile…</p>;

  return (
    <div className="w-full max-w-3xl space-y-5">
      <Card title="Your account" className="max-w-none" wide>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><p className="text-xs text-foreground/50">Email address</p><p className="mt-1 text-sm font-medium">{user.email}</p></div>
          <div><p className="text-xs text-foreground/50">Member since</p><p className="mt-1 text-sm font-medium">{new Date(user.createdAt).toLocaleDateString()}</p></div>
        </div>
      </Card>
      <Card title="Your public profile" className="max-w-none" wide>
        <ProfileForm profile={user.profile} />
      </Card>
    </div>
  );
}
