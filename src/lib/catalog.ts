import type { Lang } from "./site";
import type { Plan, Producer, Region, Wine } from "./types";

/**
 * Demo content: plans, prices and producers are fictional samples. Replace them before launch, then set this to
 * `false`: the footer drops its "sample content" notice and the homepage starts publishing the plans and prices
 * to search engines as structured data (see `plansJsonLd` in `src/lib/structured-data.ts`).
 */
export const CATALOG_IS_SAMPLE = true;

/** A text in both languages. */
type Text = Record<Lang, string>;
/** Swaps the listed text fields of `T` for their two-language version. */
type Localized<T, K extends keyof T> = Omit<T, K> & { [P in K]: Text };

const same = (text: string): Text => ({ es: text, en: text });

const PLANS: Localized<Plan, "tagline" | "contents">[] = [
  {
    code: "VINO",
    name: "Descubre",
    tagline: {
      es: "Dos vinos de pequeñas bodegas malagueñas cada mes.",
      en: "Two wines from small Málaga wineries every month.",
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
    priceCents: 5500,
    featured: true,
  },
  {
    code: "RESERVA",
    name: "Reserva",
    tagline: {
      es: "Vinos de producción muy limitada, crianzas y dulces de añada.",
      en: "Very limited releases, oak-aged wines and vintage sweet wines.",
    },
    contents: {
      es: "3 botellas de edición limitada · fichas de cata",
      en: "3 limited-edition bottles · tasting notes",
    },
    priceCents: 7000,
    featured: false,
  },
];

const PRODUCERS: Localized<Producer, "area" | "specialty" | "description">[] = [
  {
    slug: "mirador-de-manilva",
    name: "Bodega Mirador de Manilva",
    town: "Manilva",
    area: { es: "Costa Occidental", en: "Western coast" },
    specialty: { es: "Moscatel junto al Mediterráneo", en: "Moscatel by the Mediterranean" },
    description: {
      es: "Viñas a pocos kilómetros de la playa. Blancos secos de Moscatel, frescos y salinos, y un dulce de vendimia tardía.",
      en: "Vines a few kilometres from the beach. Dry Moscatel whites, fresh and saline, and a late-harvest sweet wine.",
    },
  },
  {
    slug: "bodega-tajo-alto",
    name: "Bodega Tajo Alto",
    town: "Ronda",
    area: same("Serranía de Ronda"),
    specialty: { es: "Tintos de altura", en: "High-altitude reds" },
    description: {
      es: "Una pequeña bodega a 750 m que elabora tintos estructurados de Tempranillo, Syrah y Petit Verdot, con noches frescas y maduración lenta.",
      en: "A small winery at 750 m making structured reds from Tempranillo, Syrah and Petit Verdot, with cool nights and slow ripening.",
    },
  },
  {
    slug: "lagar-montes-verdes",
    name: "Lagar Montes Verdes",
    town: "Málaga",
    area: same("Montes de Málaga"),
    specialty: { es: "Pedro Ximénez dulce tradicional", en: "Traditional sweet Pedro Ximénez" },
    description: {
      es: "Un lagar antiguo en los montes que rodean la ciudad, donde se asolean las uvas de Pedro Ximénez para los clásicos vinos dulces de Málaga.",
      en: "An old wine-press house in the hills around the city, where Pedro Ximénez grapes are dried in the sun for Málaga's classic sweet wines.",
    },
  },
  {
    slug: "lagar-vega-norte",
    name: "Lagar Vega Norte",
    town: "Mollina",
    area: same("Norte de Málaga"),
    specialty: { es: "Rosados y tintos de la vega", en: "Rosés and reds from the plain" },
    description: {
      es: "Una bodega familiar en la llanura del norte de la provincia, con rosados de Syrah y tintos jóvenes para el día a día.",
      en: "A family winery on the plain in the north of the province, with Syrah rosés and young reds for everyday drinking.",
    },
  },
  {
    slug: "lomas-de-rome",
    name: "Lomas de Romé",
    town: "Moclinejo",
    area: same("Axarquía"),
    specialty: { es: "Romé, la uva tinta autóctona", en: "Romé, the native red grape" },
    description: {
      es: "Rescatan viñas viejas de Romé, una variedad casi desaparecida, para elaborar rosados y tintos ligeros llenos de fruta.",
      en: "They rescue old vines of Romé, a grape that had almost disappeared, to make rosés and light reds full of fruit.",
    },
  },
  {
    slug: "vinas-de-la-cuesta",
    name: "Viñas de la Cuesta",
    town: "Cómpeta",
    area: same("Axarquía"),
    specialty: { es: "Moscatel de Alejandría, seco y dulce", en: "Moscatel de Alejandría, dry and sweet" },
    description: {
      es: "Viñedo familiar en laderas de pizarra sobre el mar, vendimiado a mano. Su Moscatel seco es puro azahar y brisa salina.",
      en: "A family vineyard on slate slopes above the sea, harvested by hand. Their dry Moscatel is all orange blossom and sea breeze.",
    },
  },
];

type RegionSource = Omit<Region, "detail" | "wines"> & {
  detail: Text;
  wines: Localized<Region["wines"][number], "name">[];
};

const REGIONS: RegionSource[] = [
  {
    slug: "axarquia",
    name: "Axarquía",
    detail: {
      es: "Laderas de pizarra sobre el mar. Moscatel de Alejandría y la Romé, la uva tinta autóctona.",
      en: "Slate slopes above the sea. Moscatel de Alejandría and Romé, the native red grape.",
    },
    accent: "#e2735a",
    wines: [
      { name: { es: "Moscatel seco", en: "Dry Moscatel" }, producer: "Viñas de la Cuesta, Cómpeta", shape: "Borgona", glass: "gold", foil: "gold" },
      { name: { es: "Moscatel dulce", en: "Sweet Moscatel" }, producer: "Viñas de la Cuesta, Cómpeta", shape: "Borgona", glass: "amber", foil: "wine" },
      { name: { es: "Rosado de Romé", en: "Romé rosé" }, producer: "Lomas de Romé, Moclinejo", shape: "Borgona", glass: "rose", foil: "black" },
    ],
  },
  {
    slug: "montes-de-malaga",
    name: "Montes de Málaga",
    detail: {
      es: "Los montes que rodean la ciudad, cuna de los clásicos vinos dulces de Pedro Ximénez asoleado.",
      en: "The hills around the city, home of the classic sweet wines made from sun-dried Pedro Ximénez.",
    },
    accent: "#7b2d3f",
    wines: [
      { name: { es: "Pedro Ximénez dulce", en: "Sweet Pedro Ximénez" }, producer: "Lagar Montes Verdes, Málaga", shape: "Bordelesa", glass: "mahogany", foil: "black" },
      { name: { es: "Pedro Ximénez dulce", en: "Sweet Pedro Ximénez" }, producer: "Lagar Montes Verdes, Málaga", shape: "Bordelesa", glass: "mahogany", foil: "gold" },
    ],
  },
  {
    slug: "serrania-de-ronda",
    name: "Serranía de Ronda",
    detail: {
      es: "Viñedos de montaña de hasta 1000 metros. Tintos frescos y con estructura.",
      en: "Mountain vineyards up to 1,000 metres. Fresh, structured reds.",
    },
    accent: "#3e4f6b",
    wines: [
      { name: same("Tempranillo"), producer: "Bodega Tajo Alto, Ronda", shape: "Bordelesa", glass: "green", foil: "wine" },
      { name: same("Syrah"), producer: "Bodega Tajo Alto, Ronda", shape: "Bordelesa", glass: "ink", foil: "black" },
      { name: same("Petit Verdot"), producer: "Bodega Tajo Alto, Ronda", shape: "Bordelesa", glass: "green", foil: "gold" },
    ],
  },
  {
    slug: "norte-de-malaga",
    name: "Norte de Málaga",
    detail: {
      es: "Las llanuras de Antequera y Mollina: Pedro Ximénez, rosados y tintos jóvenes para el día a día.",
      en: "The plains of Antequera and Mollina: Pedro Ximénez, rosés and young reds for everyday drinking.",
    },
    accent: "#8c5a3c",
    wines: [
      { name: { es: "Rosado de Syrah", en: "Syrah rosé" }, producer: "Lagar Vega Norte, Mollina", shape: "Borgona", glass: "rose", foil: "wine" },
      { name: { es: "Tinto joven", en: "Young red" }, producer: "Lagar Vega Norte, Mollina", shape: "Bordelesa", glass: "ink", foil: "gold" },
    ],
  },
];

export type Catalog = { plans: Plan[]; producers: Producer[]; regions: Region[]; heroWines: Wine[] };

function build(lang: Lang): Catalog {
  const regions = REGIONS.map((region) => ({
    ...region,
    detail: region.detail[lang],
    wines: region.wines.map((wine) => ({ ...wine, name: wine.name[lang] })),
  }));
  const bottle = (region: number): Wine => ({
    ...regions[region].wines[0],
    origin: regions[region].name,
    accent: regions[region].accent,
  });
  return {
    plans: PLANS.map((plan) => ({ ...plan, tagline: plan.tagline[lang], contents: plan.contents[lang] })),
    producers: PRODUCERS.map((producer) => ({
      ...producer,
      area: producer.area[lang],
      specialty: producer.specialty[lang],
      description: producer.description[lang],
    })),
    regions,
    // The three bottles that roll onto the tablecloth next to the hero.
    heroWines: [bottle(0), bottle(2), bottle(1)],
  };
}

const CATALOGS: Record<Lang, Catalog> = { es: build("es"), en: build("en") };

/** Plans, producers and regions with their text in one language. */
export const getCatalog = (lang: Lang) => CATALOGS[lang];

/**
 * Ids that tie a group of 3D bottles to the spot on the homepage where it rests: the page puts the id on an element
 * (`data-bottle-stage`) and the tablecloth scene looks that element up.
 */
export const HERO_STAGE_ID = "hero";
export const regionStageId = (index: number) => `region-${index}`;
