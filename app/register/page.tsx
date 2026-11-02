"use client";

import Link from "next/link";
import { useRequireGuest } from "@/hooks/useRequireGuest";
import { routes } from "@/lib/config";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Card } from "@/components/ui/Card";

export default function RegisterPage() {
  const { isReady } = useRequireGuest();
  if (!isReady) return <p className="text-sm">Loading…</p>;

  return (
    <Card title="Create account">
      <RegisterForm />
      <p className="text-sm">
        Already have an account?{" "}
        <Link href={routes.login} className="underline">Log in</Link>
      </p>
    </Card>
  );
}
