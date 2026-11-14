export type Plan = {
  code: string;
  name: string;
  tagline: string;
  contents: string;
  priceCents: number;
  featured: boolean;
};

export type WineStyle = "RED" | "WHITE" | "ROSE" | "SWEET" | "SPARKLING";
export type WineSweetness = "DRY" | "OFF_DRY" | "SWEET";
export type DeliveryFrequency = "MONTHLY" | "BIMONTHLY";

export type TasteProfile = {
  wineStyles: WineStyle[];
  wineBody: number;
  wineSweetness: WineSweetness;
  adventurousness: number;
  bottlesPerBox: number;
  deliveryFrequency: DeliveryFrequency;
  monthlyBudgetEur: number;
  notes: string;
};
