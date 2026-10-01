"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { ApiError, api } from "@/lib/api";
import { tasteProfileSchema } from "@/lib/taste-schema";
import type { TasteProfile } from "@/lib/types";

export type SaveTasteResult =
  | { status: "saved" }
  | { status: "unauthenticated" }
  | { status: "error"; message: string };

export async function saveTasteProfile(profile: TasteProfile): Promise<SaveTasteResult> {
  const session = await auth();
  if (!session) return { status: "unauthenticated" };

  const parsed = tasteProfileSchema.safeParse(profile);
  if (!parsed.success) return { status: "error", message: "Some answers look off. Please review them and try again." };

  try {
    await api.saveTasteProfile(session.accessToken, parsed.data);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return { status: "unauthenticated" };
    const message =
      error instanceof ApiError && error.status === 400
        ? "Some answers look off. Please review them and try again."
        : "We couldn't save your profile right now. Please try again in a moment.";
    return { status: "error", message };
  }

  revalidatePath("/account");
  return { status: "saved" };
}
