import type { TasteProfile } from "./types";

export const DEFAULT_TASTE_PROFILE: TasteProfile = {
  wineStyles: ["RED", "WHITE"],
  wineBody: 3,
  wineSweetness: "DRY",
  adventurousness: 3,
  bottlesPerBox: 3,
  budgetEur: 50,
  notes: "",
};

/** The plan that best fits the answers: a bigger budget means Reserva, more bottles means Bodega. */
export function recommendedPlan(profile: Pick<TasteProfile, "bottlesPerBox" | "budgetEur">) {
  if (profile.budgetEur >= 70) return "RESERVA";
  if (profile.bottlesPerBox >= 3) return "BODEGA";
  return "VINO";
}

/** Turns a `{ value: label }` table from the dictionary into the options a control takes, in the table's order. */
export function optionsOf<T extends string>(labels: Record<T, string>) {
  return (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }));
}
