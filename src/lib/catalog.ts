import type { Lang } from "./site";
import type { Plan } from "./types";

/** A text in both languages. */
type Text = Record<Lang, string>;
/** Swaps the listed text fields of `T` for their two-language version. */
type Localized<T, K extends keyof T> = Omit<T, K> & { [P in K]: Text };

const PLANS: Localized<Plan, "tagline" | "contents">[] = [
  {
    code: "VINO",
    name: "Descubre",
    tagline: {
      es: "Dos vinos de pequeñas bodegas malagueñas cada cuatro meses.",
      en: "Two wines from small Málaga wineries every four months.",
    },
    contents: { es: "2 botellas · fichas de cata", en: "2 bottles · tasting notes" },
    priceCents: 4000,
    featured: false,
  },
  {
    code: "BODEGA",
    name: "Bodega",
    tagline: {
      es: "Tres vinos para recorrer la provincia, de los blancos de Moscatel a los tintos de Ronda.",
      en: "Three wines to travel the province, from Moscatel whites to the reds of Ronda.",
    },
    contents: {
      es: "3 botellas · fichas de cata · maridajes",
      en: "3 bottles · tasting notes · food pairings",
    },
    priceCents: 6000,
    featured: true,
  },
  {
    code: "RESERVA",
    name: "Reserva",
    tagline: {
      es: "Crianzas y dulces de añada más exclusivos, acceso a eventos privados.",
      en: "Our most exclusive oak-aged and vintage sweet wines, with access to private events.",
    },
    contents: {
      es: "3 botellas · fichas de cata",
      en: "3 bottles · tasting notes",
    },
    priceCents: 8000,
    featured: false,
  },
];

export type Catalog = { plans: Plan[] };

const build = (lang: Lang): Catalog => ({
  plans: PLANS.map((plan) => ({ ...plan, tagline: plan.tagline[lang], contents: plan.contents[lang] })),
});

const CATALOGS: Record<Lang, Catalog> = { es: build("es"), en: build("en") };

/** The plans with their text in one language. */
export const getCatalog = (lang: Lang) => CATALOGS[lang];

/** Every plan sends one box every four months, three a year, and the year is billed in a single payment. */
export const yearlyPriceCents = (plan: Plan) => plan.priceCents * 3;
