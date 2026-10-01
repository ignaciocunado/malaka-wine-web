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
  firstName: z.string().trim().min(1, "Enter your first name").max(100),
  lastName: z.string().trim().max(100).optional(),
  email: z.email("Enter a valid email address").max(255),
  password: z.string().min(8, "Use at least 8 characters").max(72, "Use at most 72 characters"),
  adultConfirmed: z.literal("on", "Please confirm you're 18 or older"),
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
            ? "Incorrect email or password."
            : "We couldn't sign you in right now. Please try again in a moment.",
        values: { email },
      };
    }
    throw error;
  }
}

export async function login(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password.", values: { email } };
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
      return { fieldErrors: { email: "An account with this email already exists" }, values };
    }
    if (error instanceof ApiError && error.status === 400) {
      return { error: error.message, fieldErrors: error.fieldErrors, values };
    }
    return { error: "We couldn't create your account right now. Please try again in a moment.", values };
  }

  return signInAndRedirect(email, password, safeCallbackUrl(formData.get("callbackUrl")));
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}
