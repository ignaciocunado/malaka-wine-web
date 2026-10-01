"use client";

import Link from "next/link";
import { useActionState } from "react";

import { login, type AuthFormState } from "@/app/(auth)/actions";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { GroupedSection } from "@/components/ui/grouped-list";
import { TextField } from "@/components/ui/text-field";

import { AuthHeader } from "./auth-header";

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(login, {});

  return (
    <>
      <AuthHeader title="Sign in to Terruño" subtitle="Manage your box, your taste profile and your deliveries." />
      <form action={action} className="space-y-5">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        {state.error && <Alert>{state.error}</Alert>}
        <GroupedSection>
          <TextField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={state.values?.email}
            placeholder="name@example.com"
          />
          <TextField label="Password" name="password" type="password" autoComplete="current-password" required />
        </GroupedSection>
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className="mt-8 text-center text-subheadline text-label-secondary">
        New to Terruño?{" "}
        <Link href={`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-tint hover:underline">
          Create an account
        </Link>
      </p>
    </>
  );
}
