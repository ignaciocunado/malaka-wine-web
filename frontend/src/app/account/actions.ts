"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { ApiError, api } from "@/lib/api";

export type PlanFormState = { error?: string; success?: string };

async function requireToken() {
  const session = await auth();
  if (!session) redirect("/login?callbackUrl=/account");
  return session.accessToken;
}

export async function choosePlan(_prev: PlanFormState, formData: FormData): Promise<PlanFormState> {
  const token = await requireToken();
  const planCode = String(formData.get("planCode") ?? "");
  if (!planCode) return { error: "Elige un plan primero." };

  try {
    const subscription = await api.subscribe(token, planCode);
    revalidatePath("/account");
    return { success: `Te has suscrito al plan ${subscription.planName}.` };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect("/login?callbackUrl=/account");
    return { error: "No hemos podido actualizar tu suscripción. Inténtalo de nuevo." };
  }
}

export async function cancelSubscription(): Promise<PlanFormState> {
  const token = await requireToken();
  try {
    await api.cancelSubscription(token);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect("/login?callbackUrl=/account");
    return { error: "No hemos podido cancelar tu suscripción. Inténtalo de nuevo." };
  }
  revalidatePath("/account");
  return {};
}
