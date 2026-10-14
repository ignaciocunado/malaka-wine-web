import type { Plan, Producer } from "./types";

// Demo content: plans, prices and producers are fictional samples. Replace them before launch.

export const PLANS: Plan[] = [
  {
    code: "VINO",
    name: "Descubre",
    tagline: "Dos vinos de pequeñas bodegas malagueñas cada mes.",
    contents: "2 botellas · fichas de cata",
    priceCents: 3900,
    featured: false,
  },
  {
    code: "BODEGA",
    name: "Bodega",
    tagline: "Tres vinos para recorrer la provincia, de los blancos de Moscatel a los tintos de Ronda.",
    contents: "3 botellas · fichas de cata · maridajes",
    priceCents: 5400,
    featured: true,
  },
  {
    code: "RESERVA",
    name: "Reserva",
    tagline: "Vinos de producción muy limitada, crianzas y dulces de añada.",
    contents: "3 botellas de edición limitada · fichas de cata",
    priceCents: 8900,
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

export const REGIONS = [
  {
    name: "Axarquía",
    detail: "Laderas de pizarra sobre el mar. Moscatel de Alejandría y la Romé, la uva tinta autóctona.",
    gradient: "from-[#f6c27a] to-[#e2735a]",
  },
  {
    name: "Montes de Málaga",
    detail: "Los montes que rodean la ciudad, cuna de los clásicos vinos dulces de Pedro Ximénez asoleado.",
    gradient: "from-[#c98a6b] to-[#7b2d3f]",
  },
  {
    name: "Serranía de Ronda",
    detail: "Viñedos de montaña de hasta 1000 metros. Tintos frescos y con estructura.",
    gradient: "from-[#8aa1b8] to-[#3e4f6b]",
  },
  {
    name: "Norte de Málaga",
    detail: "Las llanuras de Antequera y Mollina: Pedro Ximénez, rosados y tintos jóvenes para el día a día.",
    gradient: "from-[#d9b98c] to-[#8c5a3c]",
  },
];
