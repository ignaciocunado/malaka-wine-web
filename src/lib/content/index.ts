import type { Lang } from "@/lib/site";

import { en } from "./en";
import { es, type Dictionary } from "./es";

const DICTIONARIES: Record<Lang, Dictionary> = { es, en };

export const getDictionary = (lang: Lang) => DICTIONARIES[lang];
export type { Dictionary };
