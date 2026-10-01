// Shapes of the Spring Boot API's JSON responses (see backend/src/main/java/com/terruno/api).

export type ProductType = "WINE" | "OLIVE_OIL" | "BOTH";

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string | null;
};

export type AuthResponse = {
  token: string;
  expiresAt: string;
  user: User;
};

export type Plan = {
  code: string;
  name: string;
  tagline: string;
  contents: string;
  productType: ProductType;
  priceCents: number;
  featured: boolean;
};

export type Producer = {
  slug: string;
  name: string;
  kind: "WINERY" | "OLIVE_MILL";
  town: string;
  area: string;
  specialty: string;
  description: string;
};

export type WineStyle = "RED" | "WHITE" | "ROSE" | "SWEET" | "SPARKLING";
export type WineSweetness = "DRY" | "OFF_DRY" | "SWEET";
export type OilIntensity = "DELICATE" | "MEDIUM" | "ROBUST";
export type OliveVariety = "HOJIBLANCA" | "VERDIAL" | "PICUAL" | "ARBEQUINA" | "LECHIN";
export type OilUse = "DRESSING" | "COOKING" | "FINISHING" | "BREAD";
export type DeliveryFrequency = "MONTHLY" | "BIMONTHLY";

export type TasteProfile = {
  productPreference: ProductType;
  wineStyles: WineStyle[];
  wineBody: number;
  wineSweetness: WineSweetness;
  adventurousness: number;
  oilIntensity: OilIntensity;
  oliveVarieties: OliveVariety[];
  oilUses: OilUse[];
  bottlesPerBox: number;
  deliveryFrequency: DeliveryFrequency;
  monthlyBudgetEur: number;
  notes: string | null;
  updatedAt?: string;
};

export type Subscription = {
  planCode: string;
  planName: string;
  priceCents: number;
  status: "ACTIVE" | "CANCELLED";
  startedAt: string;
  nextBoxDate: string | null;
};
