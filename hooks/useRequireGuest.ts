"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { routes } from "@/lib/config";

export function useRequireGuest() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && user) router.replace(routes.home);
  }, [isLoading, user, router]);
  return { isReady: !isLoading && !user };
}
