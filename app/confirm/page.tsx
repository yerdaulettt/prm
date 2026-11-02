import { Suspense } from "react";
import { ConfirmEmail } from "@/components/auth/ConfirmEmail";
import { Card } from "@/components/ui/Card";

export default function ConfirmPage() {
  return (
    <Card title="Email confirmation">
      {}
      <Suspense fallback={<p className="text-sm">Loading…</p>}>
        <ConfirmEmail />
      </Suspense>
    </Card>
  );
}
