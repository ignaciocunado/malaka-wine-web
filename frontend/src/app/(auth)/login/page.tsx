import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";
import { safeCallbackUrl } from "@/lib/format";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { callbackUrl } = await searchParams;
  return <LoginForm callbackUrl={safeCallbackUrl(typeof callbackUrl === "string" ? callbackUrl : undefined)} />;
}
