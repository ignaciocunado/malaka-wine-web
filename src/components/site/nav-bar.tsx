import { ButtonLink } from "@/components/ui/button";
import { getDictionary } from "@/lib/content";
import { homeAnchor, pagePath, type Lang } from "@/lib/site";

import { LanguageSwitch } from "./language-switch";
import { Logo } from "./logo";
import { NavLinks, NavMenu } from "./nav-menu";

/**
 * Translucent top bar using the HIG bar material; see `.bar-material` in globals.css. From 768px it shows the links
 * and the language switch; below that they move into the phone menu, and below 360px the sign-up button does too.
 */
export function NavBar({ lang }: { lang: Lang }) {
  const { nav } = getDictionary(lang);
  const links = [
    { href: homeAnchor(lang, "how"), label: nav.howItWorks },
    { href: homeAnchor(lang, "plans"), label: nav.plans },
    { href: pagePath(lang, "guide"), label: nav.guide },
    { href: pagePath(lang, "about"), label: nav.about },
  ];
  const registerHref = pagePath(lang, "interest");
  return (
    <header className="bar-material sticky top-0 z-50">
      <nav aria-label={nav.label} className="mx-auto flex h-13 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Logo lang={lang} />
        <NavLinks
          links={links}
          className="hidden items-center gap-7 text-footnote text-label-secondary md:flex"
          linkClassName="whitespace-nowrap transition-colors hover:text-label aria-[current=page]:text-label"
        />
        <div className="flex items-center gap-4">
          <LanguageSwitch
            lang={lang}
            label={nav.switchLabel}
            title={nav.switchTitle}
            // Padding gives the two letters a 44px target; the matching negative margin keeps the bar's layout as it was.
            className="-mx-3.5 hidden h-11 items-center rounded-full px-3.5 text-footnote font-semibold text-label-secondary transition-colors hover:text-label md:flex"
          />
          <ButtonLink href={registerHref} size="sm" className="max-[360px]:hidden">
            {nav.register}
          </ButtonLink>
          <NavMenu
            lang={lang}
            links={links}
            text={{ menu: nav.menu, otherLanguage: nav.otherLanguage, register: nav.register, registerHref }}
          />
        </div>
      </nav>
    </header>
  );
}
