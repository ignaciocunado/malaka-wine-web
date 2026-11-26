import Link from "next/link";

import { MailIcon } from "@/components/ui/icons";
import { CATALOG_IS_SAMPLE } from "@/lib/catalog";
import { getDictionary } from "@/lib/content";
import { getGuide } from "@/lib/content/guide";
import { CONTROLLER, LINKEDIN_URL, homeAnchor, pagePath, topicPath, type Lang } from "@/lib/site";

import { LanguageSwitch } from "./language-switch";

export function Footer({ lang }: { lang: Lang }) {
  const { footer } = getDictionary(lang);
  const link = "transition-colors hover:text-label";
  return (
    <footer className="relative border-t border-separator text-caption text-label-secondary">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Links to every page of the wine guide, so visitors and crawlers can reach them from anywhere. */}
        <nav aria-label={footer.guide} className="border-b border-separator pb-4">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li>
              <Link href={pagePath(lang, "guide")} className={`font-semibold text-label ${link}`}>
                {footer.guide}
              </Link>
            </li>
            {getGuide(lang).topics.map((topic) => (
              <li key={topic.slug}>
                <Link href={topicPath(lang, topic.slug)} className={link}>
                  {topic.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="border-b border-separator py-4 leading-relaxed">
          {footer.legal}
          {CATALOG_IS_SAMPLE && ` ${footer.sample}`}
        </p>
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
                aria-label={footer.email(CONTROLLER.email)}
                className={`-my-1 flex size-6 items-center justify-center ${link}`}
              >
                <MailIcon className="size-5" />
              </a>
            </li>
            <li>
              <LanguageSwitch lang={lang} label={footer.otherLanguage} className={link} />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
