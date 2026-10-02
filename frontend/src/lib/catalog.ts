import type { Plan } from "./types";

/** Shown when the API is unreachable, so the marketing pages still render. Mirrors the seed data. */
export const FALLBACK_PLANS: Plan[] = [
  {
    code: "VINO",
    name: "La Bodega",
    tagline: "Two bottles from Málaga's small wineries.",
    contents: "2 bottles of wine · tasting cards",
    productType: "WINE",
    priceCents: 3900,
    featured: false,
  },
  {
    code: "MESA",
    name: "La Mesa",
    tagline: "The full table: wine and extra virgin olive oil.",
    contents: "2 bottles of wine · 500 ml EVOO · tasting cards",
    productType: "BOTH",
    priceCents: 5400,
    featured: true,
  },
  {
    code: "ACEITE",
    name: "La Almazara",
    tagline: "Fresh-pressed extra virgin olive oil from local mills.",
    contents: "2 × 500 ml EVOO · pairing ideas",
    productType: "OLIVE_OIL",
    priceCents: 2600,
    featured: false,
  },
];

export const REGIONS = [
  {
    name: "Axarquía",
    detail: "Steep slate hillsides over the sea. Moscatel de Alejandría, the native Romé grape and gentle Verdial olives.",
    gradient: "from-[#f6c27a] to-[#e2735a]",
  },
  {
    name: "Montes de Málaga",
    detail: "The hills behind the city, home of the classic sweet wines made from sun-dried Pedro Ximénez.",
    gradient: "from-[#c98a6b] to-[#7b2d3f]",
  },
  {
    name: "Serranía de Ronda",
    detail: "Mountain vineyards up to 1,000 m. Fresh, structured reds and organic mountain olive groves.",
    gradient: "from-[#8aa1b8] to-[#3e4f6b]",
  },
  {
    name: "Antequera",
    detail: "The fertile vega of the north. Hojiblanca country and the province's olive oil heartland.",
    gradient: "from-[#c4c77a] to-[#5e6b1e]",
  },
];
