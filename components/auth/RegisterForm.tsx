"use client";

import { useState } from "react";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const { message } = await authApi.register(email, password);
      setSuccess(message);
      setPassword("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success} Check your inbox to confirm your email.</Alert>}

      <FormField label="Email" name="email" type="email" autoComplete="email" required
        value={email} onChange={(e) => setEmail(e.target.value)} />
      <FormField label="Password" name="password" type="password" autoComplete="new-password" required
        value={password} onChange={(e) => setPassword(e.target.value)} />

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
