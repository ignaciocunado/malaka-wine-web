// Shapes of the Spring Boot API's JSON responses (see backend/src/main/java/com/terruno/api).

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
