import type {
  DeliveryFrequency,
  OilIntensity,
  OilUse,
  OliveVariety,
  ProductType,
  TasteProfile,
  WineStyle,
  WineSweetness,
} from "./types";

type Option<T extends string> = { value: T; label: string; hint?: string };

export const PRODUCT_OPTIONS: Option<ProductType>[] = [
  { value: "WINE", label: "Wine", hint: "Reds, whites and the sweet wines Málaga is famous for." },
  { value: "OLIVE_OIL", label: "Olive oil", hint: "Fresh extra virgin olive oil from local mills." },
  { value: "BOTH", label: "Both", hint: "The full Málaga table, every month." },
];

export const WINE_STYLE_OPTIONS: Option<WineStyle>[] = [
  { value: "RED", label: "Red" },
  { value: "WHITE", label: "White" },
  { value: "ROSE", label: "Rosé" },
  { value: "SWEET", label: "Sweet & Moscatel" },
  { value: "SPARKLING", label: "Sparkling" },
];

export const SWEETNESS_OPTIONS: Option<WineSweetness>[] = [
  { value: "DRY", label: "Dry" },
  { value: "OFF_DRY", label: "Off-dry" },
  { value: "SWEET", label: "Sweet" },
];

export const OIL_INTENSITY_OPTIONS: Option<OilIntensity>[] = [
  { value: "DELICATE", label: "Delicate", hint: "Soft, sweet and buttery. Lovely with fish and salads." },
  { value: "MEDIUM", label: "Medium", hint: "Green and fruity with a gentle bitter note." },
  { value: "ROBUST", label: "Robust", hint: "Grassy, bitter and peppery. Made for bread and stews." },
];

export const OLIVE_VARIETY_OPTIONS: Option<OliveVariety>[] = [
  { value: "HOJIBLANCA", label: "Hojiblanca", hint: "Antequera's olive: artichoke and almond" },
  { value: "VERDIAL", label: "Verdial", hint: "Axarquía's sweet, gentle olive" },
  { value: "PICUAL", label: "Picual", hint: "Intense, with tomato leaf" },
  { value: "ARBEQUINA", label: "Arbequina", hint: "Mild, apple and banana" },
  { value: "LECHIN", label: "Lechín", hint: "Rare, grassy and fresh" },
];

export const OIL_USE_OPTIONS: Option<OilUse>[] = [
  { value: "DRESSING", label: "Salads & dressings" },
  { value: "COOKING", label: "Everyday cooking" },
  { value: "FINISHING", label: "Finishing dishes" },
  { value: "BREAD", label: "Bread & tostadas" },
];

export const FREQUENCY_OPTIONS: Option<DeliveryFrequency>[] = [
  { value: "MONTHLY", label: "Every month" },
  { value: "BIMONTHLY", label: "Every 2 months" },
];

export const BODY_LABELS = ["Very light", "Light", "Medium", "Full", "Very full"];
export const ADVENTURE_LABELS = ["Classics only", "Mostly classics", "A bit of both", "Curious", "Surprise me"];

export const DEFAULT_TASTE_PROFILE: TasteProfile = {
  productPreference: "BOTH",
  wineStyles: ["RED", "WHITE"],
  wineBody: 3,
  wineSweetness: "DRY",
  adventurousness: 3,
  oilIntensity: "MEDIUM",
  oliveVarieties: ["HOJIBLANCA", "VERDIAL"],
  oilUses: ["DRESSING", "BREAD"],
  bottlesPerBox: 3,
  deliveryFrequency: "MONTHLY",
  monthlyBudgetEur: 50,
  notes: "",
};

/** The plan that best fits what the subscriber wants in their box. */
export const RECOMMENDED_PLAN: Record<ProductType, string> = {
  WINE: "VINO",
  OLIVE_OIL: "ACEITE",
  BOTH: "MESA",
};

export function labelOf<T extends string>(options: Option<T>[], value: T) {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function labelsOf<T extends string>(options: Option<T>[], values: T[]) {
  // Follow the options' order, not the (unordered) order the API returns sets in.
  const labels = options.filter((option) => values.includes(option.value)).map((option) => option.label);
  return labels.length === 0 ? "No preference" : labels.join(", ");
}

export const wantsWine = (profile: TasteProfile) => profile.productPreference !== "OLIVE_OIL";
export const wantsOil = (profile: TasteProfile) => profile.productPreference !== "WINE";
