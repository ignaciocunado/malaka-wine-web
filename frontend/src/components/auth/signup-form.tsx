"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signup, type AuthFormState } from "@/app/(auth)/actions";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";
import { GroupedSection } from "@/components/ui/grouped-list";
import { TextField } from "@/components/ui/text-field";

import { AuthHeader } from "./auth-header";

export function SignupForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(signup, {});
  const errors = state.fieldErrors ?? {};

  return (
    <>
      <AuthHeader
        title="Create your account"
        subtitle="One account for your taste profile, your box and your deliveries."
      />
      <form action={action} className="space-y-6" noValidate>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        {state.error && <Alert>{state.error}</Alert>}

        <GroupedSection>
          <TextField
            label="First name"
            name="firstName"
            autoComplete="given-name"
            required
            defaultValue={state.values?.firstName}
            error={errors.firstName}
          />
          <TextField
            label="Last name (optional)"
            name="lastName"
            autoComplete="family-name"
            defaultValue={state.values?.lastName}
            error={errors.lastName}
          />
        </GroupedSection>

        <GroupedSection footer="Use at least 8 characters.">
          <TextField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="name@example.com"
            defaultValue={state.values?.email}
            error={errors.email}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={72}
            error={errors.password}
          />
        </GroupedSection>

        <label
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-xl bg-grouped-secondary px-4 py-3 text-subheadline",
            errors.adultConfirmed && "ring-1 ring-system-red",
          )}
        >
          <input type="checkbox" name="adultConfirmed" className="mt-0.5 size-5 shrink-0 accent-tint" />
          <span>
            I confirm I am 18 or older. Wine is only sold and delivered to adults.
            {errors.adultConfirmed && <span className="mt-1 block text-system-red">{errors.adultConfirmed}</span>}
          </span>
        </label>

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Creating account…" : "Continue"}
        </Button>
      </form>
      <p className="mt-8 text-center text-subheadline text-label-secondary">
        Already have an account?{" "}
        <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-tint hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}
