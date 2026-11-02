"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";

export function LoginForm() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setInfo("");
    setNeedsConfirmation(false);
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setNeedsConfirmation(err.status === 403);
      } else {
        setError("Something went wrong.");
      }
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    try {
      const { message } = await authApi.resend(email);
      setError("");
      setNeedsConfirmation(false);
      setInfo(message);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error">{error}</Alert>}
      {info && <Alert type="success">{info}</Alert>}
      {needsConfirmation && (
        <Button type="button" variant="secondary" onClick={handleResend} className="w-full">
          Resend confirmation email
        </Button>
      )}

      <FormField label="Email" name="email" type="email" autoComplete="email" required
        value={email} onChange={(e) => setEmail(e.target.value)} />
      <FormField label="Password" name="password" type="password" autoComplete="current-password" required
        value={password} onChange={(e) => setPassword(e.target.value)} />

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Logging in…" : "Log in"}
      </Button>
    </form>
  );
}
