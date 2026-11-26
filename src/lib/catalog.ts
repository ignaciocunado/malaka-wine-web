import plansFile from "@content/plans.json";

import type { Lang } from "./site";
import type { Plan } from "./types";

// The plans live in `content/plans.json`, where the CMS edits them, with the same fields in Spanish and English.
// Typing both languages as the Spanish one fails the build if the English is missing a field.
const PLANS: Record<Lang, typeof plansFile.es> = plansFile;

/**
 * Demo content: the plans and their prices are fictional samples. Replace them before launch, then turn off
 * `sample` in `content/plans.json`: the homepage starts publishing the plans and prices to search engines as
 * structured data (see `plansJsonLd` in `src/lib/structured-data.ts`).
 */
export const CATALOG_IS_SAMPLE = PLANS.es.sample;

export type Catalog = { plans: Plan[] };

// Prices are written in whole euros in the CMS; the site counts in cents.
const build = (lang: Lang): Catalog => ({
  plans: PLANS[lang].plans.map(({ price, ...plan }) => ({ ...plan, priceCents: price * 100 })),
});

const CATALOGS: Record<Lang, Catalog> = { es: build("es"), en: build("en") };

/** The plans with their text in one language. */
export const getCatalog = (lang: Lang) => CATALOGS[lang];
