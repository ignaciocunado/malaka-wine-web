"use client";

import { useState, useTransition } from "react";

import { cancelSubscription } from "@/app/account/actions";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

/** Destructive action with an inline confirmation step, in place of an iOS action sheet. */
export function CancelSubscription() {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <Button variant="plain-destructive" onClick={() => setConfirming(true)}>
        Cancelar suscripción
      </Button>
    );
  }

  return (
    <div className="w-full rounded-xl bg-grouped-secondary p-4 text-center">
      <p className="text-subheadline">¿Cancelar tu suscripción? Las cajas ya enviadas llegarán igualmente.</p>
      {error && (
        <div className="mt-3">
          <Alert>{error}</Alert>
        </div>
      )}
      <div className="mt-4 flex justify-center gap-3">
        <Button variant="gray" onClick={() => setConfirming(false)} disabled={pending}>
          Mantenerla
        </Button>
        <Button
          variant="destructive"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const result = await cancelSubscription();
              if (result.error) setError(result.error);
              else setConfirming(false);
            })
          }
        >
          {pending ? "Cancelando…" : "Cancelar suscripción"}
        </Button>
      </div>
    </div>
  );
}
