import type { DeliveryFrequency, TasteProfile, WineStyle, WineSweetness } from "./types";

type Option<T extends string> = { value: T; label: string };

export const WINE_STYLE_OPTIONS: Option<WineStyle>[] = [
  { value: "RED", label: "Tinto" },
  { value: "WHITE", label: "Blanco" },
  { value: "ROSE", label: "Rosado" },
  { value: "SWEET", label: "Dulce y Moscatel" },
  { value: "SPARKLING", label: "Espumoso" },
];

export const SWEETNESS_OPTIONS: Option<WineSweetness>[] = [
  { value: "DRY", label: "Seco" },
  { value: "OFF_DRY", label: "Semiseco" },
  { value: "SWEET", label: "Dulce" },
];

export const FREQUENCY_OPTIONS: Option<DeliveryFrequency>[] = [
  { value: "MONTHLY", label: "Cada mes" },
  { value: "BIMONTHLY", label: "Cada 2 meses" },
];

export const BODY_LABELS = ["Muy ligero", "Ligero", "Medio", "Con cuerpo", "Muy intenso"];
export const ADVENTURE_LABELS = ["Solo clásicos", "Sobre todo clásicos", "Un poco de todo", "Con curiosidad", "Sorpréndeme"];

export const DEFAULT_TASTE_PROFILE: TasteProfile = {
  wineStyles: ["RED", "WHITE"],
  wineBody: 3,
  wineSweetness: "DRY",
  adventurousness: 3,
  bottlesPerBox: 3,
  deliveryFrequency: "MONTHLY",
  monthlyBudgetEur: 50,
  notes: "",
};

/** The plan that best fits the answers: a bigger budget means Reserva, more bottles means Bodega. */
export function recommendedPlan(profile: Pick<TasteProfile, "bottlesPerBox" | "monthlyBudgetEur">) {
  if (profile.monthlyBudgetEur >= 70) return "RESERVA";
  if (profile.bottlesPerBox >= 3) return "BODEGA";
  return "VINO";
}

export function labelOf<T extends string>(options: Option<T>[], value: T) {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function labelsOf<T extends string>(options: Option<T>[], values: T[]) {
  // Follow the options' order, not the order the answers were picked in.
  const labels = options.filter((option) => values.includes(option.value)).map((option) => option.label);
  return labels.length === 0 ? "Sin preferencia" : labels.join(", ");
}
