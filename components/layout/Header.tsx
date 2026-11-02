"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { config, routes } from "@/lib/config";
import { ButtonLink } from "@/components/ui/Button";

export function Header() {
  const { user, isLoading } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-foreground/15 px-6 py-3">
      <Link href={routes.home} className="text-lg font-semibold">
        {config.appName}
      </Link>

      {}
      {!isLoading && (
        <nav className="flex gap-3">
          {user ? (
            <ButtonLink href={routes.profile}>Profile</ButtonLink>
          ) : (
            <>
              <ButtonLink href={routes.login} variant="secondary">Log in</ButtonLink>
              <ButtonLink href={routes.register}>Register</ButtonLink>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
