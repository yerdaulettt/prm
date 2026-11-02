"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { routes } from "@/lib/config";
import { Alert } from "@/components/ui/Alert";
import { ButtonLink } from "@/components/ui/Button";

type State = { status: "loading" } | { status: "success" | "error"; message: string };

export function ConfirmEmail() {
  const token = useSearchParams().get("token");
  const [state, setState] = useState<State>({ status: "loading" });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    async function confirm() {
      if (!token) {
        setState({ status: "error", message: "This confirmation link is missing its token." });
        return;
      }
      try {
        const { message } = await authApi.confirm(token);
        setState({ status: "success", message });
      } catch (err) {
        const message = err instanceof ApiError ? err.message : "Something went wrong.";
        setState({ status: "error", message });
      }
    }
    confirm();
  }, [token]);

  if (state.status === "loading") return <p className="text-sm">Confirming your email…</p>;

  return (
    <div className="space-y-4">
      <Alert type={state.status}>{state.message}</Alert>
      {state.status === "error" && (
        <p className="text-sm opacity-70">
          Log in with your email and password to get a new confirmation email.
        </p>
      )}
      <ButtonLink href={routes.login}>Go to log in</ButtonLink>
    </div>
  );
}
