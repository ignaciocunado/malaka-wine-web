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
        title="Crea tu cuenta"
        subtitle="Una sola cuenta para tu perfil de gustos, tu caja y tus envíos."
      />
      <form action={action} className="space-y-6" noValidate>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        {state.error && <Alert>{state.error}</Alert>}

        <GroupedSection>
          <TextField
            label="Nombre"
            name="firstName"
            autoComplete="given-name"
            required
            defaultValue={state.values?.firstName}
            error={errors.firstName}
          />
          <TextField
            label="Apellidos (opcional)"
            name="lastName"
            autoComplete="family-name"
            defaultValue={state.values?.lastName}
            error={errors.lastName}
          />
        </GroupedSection>

        <GroupedSection footer="Usa al menos 8 caracteres.">
          <TextField
            label="Correo electrónico"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="nombre@ejemplo.com"
            defaultValue={state.values?.email}
            error={errors.email}
          />
          <TextField
            label="Contraseña"
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
            Confirmo que tengo 18 años o más. Solo vendemos y entregamos vino a adultos.
            {errors.adultConfirmed && <span className="mt-1 block text-system-red">{errors.adultConfirmed}</span>}
          </span>
        </label>

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Creando cuenta…" : "Continuar"}
        </Button>
      </form>
      <p className="mt-8 text-center text-subheadline text-label-secondary">
        ¿Ya tienes cuenta?{" "}
        <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-tint hover:underline">
          Inicia sesión
        </Link>
      </p>
    </>
  );
}
