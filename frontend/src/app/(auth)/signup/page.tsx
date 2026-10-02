import type { Metadata } from "next";

import { SignupForm } from "@/components/auth/signup-form";
import { safeCallbackUrl } from "@/lib/format";

export const metadata: Metadata = { title: "Create your account" };

export default async function SignupPage({ searchParams }: PageProps<"/signup">) {
  const { callbackUrl } = await searchParams;
  return <SignupForm callbackUrl={safeCallbackUrl(typeof callbackUrl === "string" ? callbackUrl : undefined)} />;
}
