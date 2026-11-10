"use client";

import { usePathname } from "next/navigation";

import { alternatePath, type Lang } from "@/lib/site";

/**
 * Link to the current page in the other language. A plain `<a>`: each language has its own root layout, so the
 * browser loads the page in full either way.
 */
export function LanguageSwitch({ lang, label, title, className }: { lang: Lang; label: string; title?: string; className?: string }) {
  const target: Lang = lang === "es" ? "en" : "es";
  const pathname = usePathname();
  return (
    <a href={alternatePath(pathname, target)} hrefLang={target} lang={target} title={title} aria-label={title} className={className}>
      {label}
    </a>
  );
}
