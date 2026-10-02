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
  if (!planCode) return { error: "Choose a plan first." };

  try {
    const subscription = await api.subscribe(token, planCode);
    revalidatePath("/account");
    return { success: `You're subscribed to ${subscription.planName}.` };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect("/login?callbackUrl=/account");
    return { error: "We couldn't update your subscription. Please try again." };
  }
}

export async function cancelSubscription(): Promise<PlanFormState> {
  const token = await requireToken();
  try {
    await api.cancelSubscription(token);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect("/login?callbackUrl=/account");
    return { error: "We couldn't cancel your subscription. Please try again." };
  }
  revalidatePath("/account");
  return {};
}
