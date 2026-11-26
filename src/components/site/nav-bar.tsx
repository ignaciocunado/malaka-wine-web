import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { getDictionary } from "@/lib/content";
import { PAGE_ALTERNATES } from "@/lib/content/pages";
import { homeAnchor, pagePath, type Lang } from "@/lib/site";

import { LanguageSwitch } from "./language-switch";
import { Logo } from "./logo";

/** Translucent top bar using the HIG bar material; see `.bar-material` in globals.css. */
export function NavBar({ lang }: { lang: Lang }) {
  const { nav } = getDictionary(lang);
  const links = [
    { href: homeAnchor(lang, "how"), label: nav.howItWorks },
    { href: homeAnchor(lang, "plans"), label: nav.plans },
    { href: pagePath(lang, "guide"), label: nav.guide },
    { href: pagePath(lang, "about"), label: nav.about },
  ];
  return (
    <header className="bar-material sticky top-0 z-50">
      <nav className="mx-auto flex h-13 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Logo lang={lang} />
        <ul className="hidden items-center gap-7 text-footnote text-label-secondary md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="whitespace-nowrap transition-colors hover:text-label">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4">
          <LanguageSwitch
            lang={lang}
            label={nav.switchLabel}
            title={nav.switchTitle}
            alternates={PAGE_ALTERNATES}
            // Padding gives the two letters a 44px target; the matching negative margin keeps the bar's layout as it was.
            className="-mx-3.5 flex h-11 items-center rounded-full px-3.5 text-footnote font-semibold text-label-secondary transition-colors hover:text-label"
          />
          <ButtonLink href={pagePath(lang, "interest")} size="sm">
            {nav.register}
          </ButtonLink>
        </div>
      </nav>
    </header>
  );
}
