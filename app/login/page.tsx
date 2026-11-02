"use client";

import Link from "next/link";
import { useRequireGuest } from "@/hooks/useRequireGuest";
import { routes } from "@/lib/config";
import { LoginForm } from "@/components/auth/LoginForm";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const { isReady } = useRequireGuest();
  if (!isReady) return <p className="text-sm">Loading…</p>;

  return (
    <Card title="Log in">
      <LoginForm />
      <p className="text-sm">
        No account yet?{" "}
        <Link href={routes.register} className="underline">Register</Link>
      </p>
    </Card>
  );
}
