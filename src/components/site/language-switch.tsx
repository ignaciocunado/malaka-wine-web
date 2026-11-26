"use client";

import { usePathname } from "next/navigation";

import { alternatePath, type Lang } from "@/lib/site";

/**
 * Link to the current page in the other language. A plain `<a>`: each language has its own root layout, so the
 * browser loads the page in full either way. `alternates` maps the addresses of pages created in the CMS to their
 * translation's, which can't be worked out from the address.
 */
export function LanguageSwitch({
  lang,
  label,
  title,
  className,
  alternates,
}: {
  lang: Lang;
  label: string;
  title?: string;
  className?: string;
  alternates: Record<string, string>;
}) {
  const target: Lang = lang === "es" ? "en" : "es";
  const pathname = usePathname();
  return (
    <a href={alternates[pathname] ?? alternatePath(pathname, target)} hrefLang={target} lang={target} title={title} aria-label={title} className={className}>
      {label}
    </a>
  );
}
