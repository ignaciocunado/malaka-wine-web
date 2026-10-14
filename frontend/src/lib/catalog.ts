import type { Plan } from "./types";

/** Shown when the API is unreachable, so the marketing pages still render. Mirrors the seed data. */
export const FALLBACK_PLANS: Plan[] = [
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
