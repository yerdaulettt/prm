"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/lib/api/auth";
import { ApiError, fieldError } from "@/lib/api/errors";
import { safeReturnTo } from "@/lib/config";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = safeReturnTo(searchParams.get("returnTo"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [info, setInfo] = useState("");
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setError(""); setInfo(""); setFieldErrors({}); setNeedsConfirmation(false); setIsSubmitting(true);
    try {
      await login(email, password);
      router.replace(returnTo);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setFieldErrors(err.errors);
        setNeedsConfirmation(err.status === 403);
      } else setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    setError(""); setInfo("");
    try {
      const result = await authApi.resend(email.trim());
      setInfo(result.message);
      setNeedsConfirmation(false);
    } catch (err) {
      if (err instanceof ApiError) { setError(err.message); setFieldErrors(err.errors); }
      else setError("Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error">{error}</Alert>}
      {info && <Alert type="success">{info}</Alert>}
      <FormField label="Email" name="email" type="email" autoComplete="email" required value={email}
        onChange={(event) => setEmail(event.target.value)} error={fieldError(fieldErrors, "email")} />
      <FormField label="Password" name="password" type="password" autoComplete="current-password" required value={password}
        onChange={(event) => setPassword(event.target.value)} error={fieldError(fieldErrors, "password")} />
      {needsConfirmation && (
        <Button type="button" variant="secondary" onClick={handleResend} className="w-full">Resend confirmation email</Button>
      )}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Logging in…" : "Log in"}
      </Button>
    </form>
  );
}
