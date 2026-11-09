export type Plan = {
  code: string;
  name: string;
  tagline: string;
  contents: string;
  priceCents: number;
  featured: boolean;
};

export type Producer = {
  slug: string;
  name: string;
  town: string;
  area: string;
  specialty: string;
  description: string;
};

/** A bottle shown on the homepage. `shape`, `glass` and `foil` pick the 3D model and its materials. */
export type RegionWine = {
  name: string;
  producer: string;
  shape: "Bordelesa" | "Borgona";
  glass: "gold" | "amber" | "rose" | "mahogany" | "green" | "ink";
  foil: "wine" | "gold" | "black";
};

export type Region = {
  name: string;
  detail: string;
  /** Color of the band on this region's bottle labels. */
  accent: string;
  wines: RegionWine[];
};

/** A bottle with everything its label needs. */
export type Wine = RegionWine & { origin: string; accent: string };

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
