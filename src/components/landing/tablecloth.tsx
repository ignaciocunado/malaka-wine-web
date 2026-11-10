"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import { HERO_STAGE_ID, getCatalog, regionStageId } from "@/lib/catalog";
import type { Lang } from "@/lib/site";

import type { BottleStage } from "./tablecloth-scene";

// three.js only runs in the browser and is heavy, so it loads after the page's text is on screen.
const TableclothScene = dynamic(() => import("./tablecloth-scene"), { ssr: false });

/** The 3D tablecloth and its bottles, fixed behind the homepage. Bottle labels are in the page's language. */
export function Tablecloth({ lang }: { lang: Lang }) {
  // Memoized: the scene rebuilds its bottles whenever it is handed a new list.
  const stages = useMemo<BottleStage[]>(() => {
    const { heroWines, regions } = getCatalog(lang);
    return [
      { id: HERO_STAGE_ID, wines: heroWines, intro: true },
      ...regions.map((region, index) => ({
        id: regionStageId(index),
        wines: region.wines.map((wine) => ({ ...wine, origin: region.name, accent: region.accent })),
      })),
    ];
  }, [lang]);
  return <TableclothScene stages={stages} />;
}
