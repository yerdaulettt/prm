"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { routes } from "@/lib/config";

export function useRequireAuth() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.replace(routes.login);
  }, [isLoading, user, router]);

  return { user, isLoading };
}
