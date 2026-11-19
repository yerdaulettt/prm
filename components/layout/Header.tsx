"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { config, routes } from "@/lib/config";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export function Header() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace(routes.home);
  }

  return (
    <header className="sticky top-0 z-20 border-b border-foreground/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href={routes.home} className="text-xl font-bold tracking-tight">{config.appName}<span className="text-foreground/35">.</span></Link>
        {!isLoading && (
          <nav aria-label="Main navigation" className="flex flex-wrap items-center justify-end gap-2 text-sm">
            <Link href={routes.home} className="rounded-lg px-3 py-2 hover:bg-foreground/5">Find a room</Link>
            {user ? (
              <>
                <Link href={routes.roommates} className="rounded-lg px-3 py-2 hover:bg-foreground/5">Roommates</Link>
                <Link href={routes.myRooms} className="rounded-lg px-3 py-2 hover:bg-foreground/5">My rooms</Link>
                <ButtonLink href={routes.profile} variant="secondary">Profile</ButtonLink>
                <Button variant="ghost" onClick={handleLogout}>Log out</Button>
              </>
            ) : (
              <>
                <ButtonLink href={routes.login} variant="secondary">Log in</ButtonLink>
                <ButtonLink href={routes.register}>Sign up</ButtonLink>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
