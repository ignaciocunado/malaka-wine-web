import { z } from "zod";

import type { TasteProfile } from "./types";

/** Mirrors the API's TasteProfileDto validation, so bad input is caught before it leaves the browser/server. */
export const tasteProfileSchema = z.object({
  wineStyles: z.array(z.enum(["RED", "WHITE", "ROSE", "SWEET", "SPARKLING"])),
  wineBody: z.int().min(1).max(5),
  wineSweetness: z.enum(["DRY", "OFF_DRY", "SWEET"]),
  adventurousness: z.int().min(1).max(5),
  bottlesPerBox: z.int().min(2).max(6),
  deliveryFrequency: z.enum(["MONTHLY", "BIMONTHLY"]),
  monthlyBudgetEur: z.int().min(20).max(300),
  notes: z.string().max(1000).nullable(),
}) satisfies z.ZodType<Omit<TasteProfile, "updatedAt">>;

/** Parses quiz answers carried through the sign-up redirect (`/taste?draft=...`). */
export function parseDraft(raw: string | string[] | undefined): TasteProfile | null {
  if (typeof raw !== "string") return null;
  try {
    const result = tasteProfileSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
