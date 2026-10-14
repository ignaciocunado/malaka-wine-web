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
      <AuthHeader title="Inicia sesión en Terruño" subtitle="Gestiona tu caja, tu perfil de gustos y tus envíos." />
      <form action={action} className="space-y-5">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        {state.error && <Alert>{state.error}</Alert>}
        <GroupedSection>
          <TextField
            label="Correo electrónico"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={state.values?.email}
            placeholder="nombre@ejemplo.com"
          />
          <TextField label="Contraseña" name="password" type="password" autoComplete="current-password" required />
        </GroupedSection>
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Iniciando sesión…" : "Iniciar sesión"}
        </Button>
      </form>
      <p className="mt-8 text-center text-subheadline text-label-secondary">
        ¿Nuevo en Terruño?{" "}
        <Link href={`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-tint hover:underline">
          Crea una cuenta
        </Link>
      </p>
    </>
  );
}
