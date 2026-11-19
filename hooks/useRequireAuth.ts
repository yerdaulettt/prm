"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { routes } from "@/lib/config";

export function useRequireAuth(returnTo?: string) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const destination = returnTo ?? pathname ?? routes.home;

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(`${routes.login}?returnTo=${encodeURIComponent(destination)}`);
    }
  }, [destination, isLoading, user, router]);

  return { user, isLoading };
}
