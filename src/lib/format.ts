import type { Lang } from "./site";

const FORMATS: Record<Lang, Intl.NumberFormat> = {
  es: new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }),
  en: new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }),
};

/** e.g. "40 €" in Spanish, "€40" in English */
export function formatEuros(cents: number, lang: Lang) {
  return FORMATS[lang].format(cents / 100);
}
