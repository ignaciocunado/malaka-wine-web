"use client";

import dynamic from "next/dynamic";

import { HERO_STAGE_ID, HERO_WINES, REGIONS, regionStageId } from "@/lib/catalog";

import type { BottleStage } from "./tablecloth-scene";

// three.js only runs in the browser and is heavy, so it loads after the page's text is on screen.
const TableclothScene = dynamic(() => import("./tablecloth-scene"), { ssr: false });

const STAGES: BottleStage[] = [
  { id: HERO_STAGE_ID, wines: HERO_WINES, intro: true },
  ...REGIONS.map((region, index) => ({
    id: regionStageId(index),
    wines: region.wines.map((wine) => ({ ...wine, origin: region.name, accent: region.accent })),
  })),
];

/** The 3D tablecloth and its bottles, fixed behind the homepage. */
export function Tablecloth() {
  return <TableclothScene stages={STAGES} />;
}
