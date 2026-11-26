import Link from "next/link";

import { MailIcon } from "@/components/ui/icons";
import { getDictionary } from "@/lib/content";
import { CUSTOM_PAGES, PAGE_ALTERNATES } from "@/lib/content/pages";
import { CONTROLLER, LINKEDIN_URL, customPagePath, homeAnchor, pagePath, type Lang } from "@/lib/site";

import { LanguageSwitch } from "./language-switch";

export function Footer({ lang }: { lang: Lang }) {
  const { footer } = getDictionary(lang);
  const link = "transition-colors hover:text-label";
  return (
    <footer className="relative border-t border-separator text-caption text-label-secondary">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="border-b border-separator pb-4 leading-relaxed">{footer.legal}</p>
        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Malaka Wine. {footer.made} {footer.credit}
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <li>
              <Link href={homeAnchor(lang, "plans")} className={link}>
                {footer.plans}
              </Link>
            </li>
            <li>
              <Link href={pagePath(lang, "interest")} className={link}>
                {footer.register}
              </Link>
            </li>
            <li>
              <Link href={pagePath(lang, "about")} className={link}>
                {footer.about}
              </Link>
            </li>
            {/* Pages created in the CMS. */}
            {CUSTOM_PAGES.map((page) => (
              <li key={page.es.slug}>
                <Link href={customPagePath(lang, page[lang].slug)} className={link}>
                  {page[lang].title}
                </Link>
              </li>
            ))}
            <li>
              <Link href={pagePath(lang, "privacy")} className={link}>
                {footer.privacy}
              </Link>
            </li>
            <li>
              <a href={LINKEDIN_URL} className={link}>
                {footer.linkedin}
              </a>
            </li>
            <li>
              {/* -my-1 keeps the 24px target from making the row taller than the text links. */}
              <a
                href={`mailto:${CONTROLLER.email}`}
                aria-label={footer.email.replace("{address}", CONTROLLER.email)}
                className={`-my-1 flex size-6 items-center justify-center ${link}`}
              >
                <MailIcon className="size-5" />
              </a>
            </li>
            <li>
              <LanguageSwitch lang={lang} label={footer.otherLanguage} className={link} alternates={PAGE_ALTERNATES} />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
