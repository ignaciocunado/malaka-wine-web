export type Plan = {
  code: string;
  name: string;
  tagline: string;
  contents: string;
  /** The price of one box. Members pay for the year's three boxes at once: see `yearlyPriceCents`. */
  priceCents: number;
  featured: boolean;
};

export type WineStyle = "RED" | "WHITE" | "ROSE" | "SWEET" | "SPARKLING";
export type WineSweetness = "DRY" | "OFF_DRY" | "SWEET";

export type TasteProfile = {
  wineStyles: WineStyle[];
  wineBody: number;
  wineSweetness: WineSweetness;
  adventurousness: number;
  bottlesPerBox: number;
  budgetEur: number;
  notes: string;
};
