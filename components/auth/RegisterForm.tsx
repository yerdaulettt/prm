"use client";

import { useState } from "react";
import Link from "next/link";
import { authApi } from "@/lib/api/auth";
import { ApiError, fieldError } from "@/lib/api/errors";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setError(""); setSuccess(""); setFieldErrors({}); setIsSubmitting(true);
    try {
      const result = await authApi.register(email.trim(), password);
      setSuccess(result.message);
      setPassword("");
    } catch (err) {
      if (err instanceof ApiError) { setError(err.message); setFieldErrors(err.errors); }
      else setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">
        {success}
        {success.match(/\/confirm\?token=[^\s.]+/)?.[0] && (
          <span className="mt-2 block"><Link className="font-medium underline underline-offset-4" href={success.match(/\/confirm\?token=[^\s.]+/)![0]}>Confirm this demo account</Link></span>
        )}
      </Alert>}
      <FormField label="Email" name="email" type="email" autoComplete="email" required value={email}
        onChange={(event) => setEmail(event.target.value)} error={fieldError(fieldErrors, "email")} />
      <FormField label="Password" name="password" type="password" autoComplete="new-password" required value={password}
        onChange={(event) => setPassword(event.target.value)} error={fieldError(fieldErrors, "password")} />
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
