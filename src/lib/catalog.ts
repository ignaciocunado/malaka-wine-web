import type { Plan, Producer, Region, Wine } from "./types";

// Demo content: plans, prices and producers are fictional samples. Replace them before launch.

export const PLANS: Plan[] = [
  {
    code: "VINO",
    name: "Descubre",
    tagline: "Dos vinos de pequeñas bodegas malagueñas cada mes.",
    contents: "2 botellas · fichas de cata",
    priceCents: 4000,
    featured: false,
  },
  {
    code: "BODEGA",
    name: "Bodega",
    tagline: "Tres vinos para recorrer la provincia, de los blancos de Moscatel a los tintos de Ronda.",
    contents: "3 botellas · fichas de cata · maridajes",
    priceCents: 5500,
    featured: true,
  },
  {
    code: "RESERVA",
    name: "Reserva",
    tagline: "Vinos de producción muy limitada, crianzas y dulces de añada.",
    contents: "3 botellas de edición limitada · fichas de cata",
    priceCents: 7000,
    featured: false,
  },
];

export const PRODUCERS: Producer[] = [
  {
    slug: "mirador-de-manilva",
    name: "Bodega Mirador de Manilva",
    town: "Manilva",
    area: "Costa Occidental",
    specialty: "Moscatel junto al Mediterráneo",
    description:
      "Viñas a pocos kilómetros de la playa. Blancos secos de Moscatel, frescos y salinos, y un dulce de vendimia tardía.",
  },
  {
    slug: "bodega-tajo-alto",
    name: "Bodega Tajo Alto",
    town: "Ronda",
    area: "Serranía de Ronda",
    specialty: "Tintos de altura",
    description:
      "Una pequeña bodega a 750 m que elabora tintos estructurados de Tempranillo, Syrah y Petit Verdot, con noches frescas y maduración lenta.",
  },
  {
    slug: "lagar-montes-verdes",
    name: "Lagar Montes Verdes",
    town: "Málaga",
    area: "Montes de Málaga",
    specialty: "Pedro Ximénez dulce tradicional",
    description:
      "Un lagar antiguo en los montes que rodean la ciudad, donde se asolean las uvas de Pedro Ximénez para los clásicos vinos dulces de Málaga.",
  },
  {
    slug: "lagar-vega-norte",
    name: "Lagar Vega Norte",
    town: "Mollina",
    area: "Norte de Málaga",
    specialty: "Rosados y tintos de la vega",
    description:
      "Una bodega familiar en la llanura del norte de la provincia, con rosados de Syrah y tintos jóvenes para el día a día.",
  },
  {
    slug: "lomas-de-rome",
    name: "Lomas de Romé",
    town: "Moclinejo",
    area: "Axarquía",
    specialty: "Romé, la uva tinta autóctona",
    description:
      "Rescatan viñas viejas de Romé, una variedad casi desaparecida, para elaborar rosados y tintos ligeros llenos de fruta.",
  },
  {
    slug: "vinas-de-la-cuesta",
    name: "Viñas de la Cuesta",
    town: "Cómpeta",
    area: "Axarquía",
    specialty: "Moscatel de Alejandría, seco y dulce",
    description:
      "Viñedo familiar en laderas de pizarra sobre el mar, vendimiado a mano. Su Moscatel seco es puro azahar y brisa salina.",
  },
];

export const REGIONS: Region[] = [
  {
    name: "Axarquía",
    detail: "Laderas de pizarra sobre el mar. Moscatel de Alejandría y la Romé, la uva tinta autóctona.",
    accent: "#e2735a",
    wines: [
      { name: "Moscatel seco", producer: "Viñas de la Cuesta, Cómpeta", shape: "Borgona", glass: "gold", foil: "gold" },
      { name: "Moscatel dulce", producer: "Viñas de la Cuesta, Cómpeta", shape: "Borgona", glass: "amber", foil: "wine" },
      { name: "Rosado de Romé", producer: "Lomas de Romé, Moclinejo", shape: "Borgona", glass: "rose", foil: "black" },
    ],
  },
  {
    name: "Montes de Málaga",
    detail: "Los montes que rodean la ciudad, cuna de los clásicos vinos dulces de Pedro Ximénez asoleado.",
    accent: "#7b2d3f",
    wines: [
      { name: "Pedro Ximénez dulce", producer: "Lagar Montes Verdes, Málaga", shape: "Bordelesa", glass: "mahogany", foil: "black" },
      { name: "Pedro Ximénez dulce", producer: "Lagar Montes Verdes, Málaga", shape: "Bordelesa", glass: "mahogany", foil: "gold" },
    ],
  },
  {
    name: "Serranía de Ronda",
    detail: "Viñedos de montaña de hasta 1000 metros. Tintos frescos y con estructura.",
    accent: "#3e4f6b",
    wines: [
      { name: "Tempranillo", producer: "Bodega Tajo Alto, Ronda", shape: "Bordelesa", glass: "green", foil: "wine" },
      { name: "Syrah", producer: "Bodega Tajo Alto, Ronda", shape: "Bordelesa", glass: "ink", foil: "black" },
      { name: "Petit Verdot", producer: "Bodega Tajo Alto, Ronda", shape: "Bordelesa", glass: "green", foil: "gold" },
    ],
  },
  {
    name: "Norte de Málaga",
    detail: "Las llanuras de Antequera y Mollina: Pedro Ximénez, rosados y tintos jóvenes para el día a día.",
    accent: "#8c5a3c",
    wines: [
      { name: "Rosado de Syrah", producer: "Lagar Vega Norte, Mollina", shape: "Borgona", glass: "rose", foil: "wine" },
      { name: "Tinto joven", producer: "Lagar Vega Norte, Mollina", shape: "Bordelesa", glass: "ink", foil: "gold" },
    ],
  },
];

/** The three bottles that roll onto the tablecloth next to the hero. */
export const HERO_WINES: Wine[] = [
  { ...REGIONS[0].wines[0], origin: REGIONS[0].name, accent: REGIONS[0].accent },
  { ...REGIONS[2].wines[0], origin: REGIONS[2].name, accent: REGIONS[2].accent },
  { ...REGIONS[1].wines[0], origin: REGIONS[1].name, accent: REGIONS[1].accent },
];

/**
 * Ids that tie a group of 3D bottles to the spot on the homepage where it rests: the page puts the id on an element
 * (`data-bottle-stage`) and the tablecloth scene looks that element up.
 */
export const HERO_STAGE_ID = "hero";
export const regionStageId = (index: number) => `region-${index}`;
