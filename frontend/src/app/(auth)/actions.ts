"use server";

import { AuthError } from "next-auth";
import { z } from "zod";

import { signIn, signOut } from "@/auth";
import { ApiError, api } from "@/lib/api";
import { safeCallbackUrl } from "@/lib/format";

export type AuthFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
};

const signupSchema = z.object({
  firstName: z.string().trim().min(1, "Introduce tu nombre").max(100),
  lastName: z.string().trim().max(100).optional(),
  email: z.email("Introduce un correo electrónico válido").max(255),
  password: z.string().min(8, "Usa al menos 8 caracteres").max(72, "Usa como máximo 72 caracteres"),
  adultConfirmed: z.literal("on", "Confirma que tienes 18 años o más"),
});

async function signInAndRedirect(email: string, password: string, callbackUrl: string): Promise<AuthFormState> {
  try {
    // On success this throws Next.js's redirect, which must propagate.
    await signIn("credentials", { email, password, redirectTo: callbackUrl });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error:
          error.type === "CredentialsSignin"
            ? "Correo o contraseña incorrectos."
            : "No hemos podido iniciar tu sesión. Inténtalo de nuevo en un momento.",
        values: { email },
      };
    }
    throw error;
  }
}

export async function login(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Introduce tu correo y tu contraseña.", values: { email } };
  return signInAndRedirect(email, password, safeCallbackUrl(formData.get("callbackUrl")));
}

export async function signup(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const values = { firstName: raw.firstName ?? "", lastName: raw.lastName ?? "", email: raw.email ?? "" };
  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
    return { fieldErrors, values };
  }

  const { firstName, lastName, email, password } = parsed.data;
  try {
    await api.register({ firstName, lastName: lastName || undefined, email, password, adultConfirmed: true });
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      return { fieldErrors: { email: "Ya existe una cuenta con este correo" }, values };
    }
    if (error instanceof ApiError && error.status === 400) {
      return { error: error.message, fieldErrors: error.fieldErrors, values };
    }
    return { error: "No hemos podido crear tu cuenta. Inténtalo de nuevo en un momento.", values };
  }

  return signInAndRedirect(email, password, safeCallbackUrl(formData.get("callbackUrl")));
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}
