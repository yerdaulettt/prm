"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRequireGuest } from "@/hooks/useRequireGuest";
import { routes } from "@/lib/config";
import { LoginForm } from "@/components/auth/LoginForm";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const { isReady } = useRequireGuest();
  if (!isReady) return <p className="text-sm">Loading…</p>;
  return (
    <Card title="Welcome back">
      <Suspense fallback={<p className="text-sm">Loading sign-in form…</p>}><LoginForm /></Suspense>
      <p className="text-sm">Don't have an account? <Link href={routes.register} className="underline underline-offset-4">Register</Link></p>
    </Card>
  );
}
