"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { routes } from "@/lib/config";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function ProfilePage() {
  const { user, isLoading } = useRequireAuth();
  const { logout } = useAuth();
  const router = useRouter();

  if (isLoading || !user) return <p className="text-sm">Loading…</p>;

  function handleLogout() {
    logout();
    router.push(routes.home);
  }

  return (
    <Card title="Your profile">
      <dl className="space-y-3 text-sm">
        <div>
          <dt className="opacity-60">Email</dt>
          <dd className="font-medium">{user.email}</dd>
        </div>
        <div>
          <dt className="opacity-60">Joined at</dt>
          <dd className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</dd>
        </div>
        <div>
          <dt className="opacity-60">User ID</dt>
          <dd className="font-medium">{user.id}</dd>
        </div>
      </dl>
      <div className="flex gap-3">
        <ButtonLink href={routes.home} variant="secondary">Home</ButtonLink>
        <Button variant="secondary" onClick={handleLogout}>Log out</Button>
      </div>
    </Card>
  );
}
