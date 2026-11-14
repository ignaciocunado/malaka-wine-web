import { getPrivacyPolicy } from "@/lib/content/privacy";
import { PRIVACY_UPDATED, type Lang } from "@/lib/site";

const DATE_LOCALE: Record<Lang, string> = { es: "es-ES", en: "en-GB" };

/** The privacy policy. Its text is in `src/lib/content/privacy.ts`; the controller's details are in `src/lib/site.ts`. */
export function PrivacyPage({ lang }: { lang: Lang }) {
  const policy = getPrivacyPolicy(lang);
  const updated = new Intl.DateTimeFormat(DATE_LOCALE[lang], { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(PRIVACY_UPDATED),
  );
  return (
    <div>
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <header>
          <h1 className="text-large-title sm:text-[3rem] sm:leading-[1.05]">{policy.title}</h1>
          <p className="mt-3 text-footnote text-label-secondary">
            {policy.updated} <time dateTime={PRIVACY_UPDATED}>{updated}</time>
          </p>
          <p className="mt-5 text-title3 font-normal text-label-secondary">{policy.intro}</p>
        </header>
        {policy.sections.map((section) => (
          <section key={section.heading} className="mt-12">
            <h2 className="text-title2">{section.heading}</h2>
            {section.body.map((block) =>
              typeof block === "string" ? (
                <p key={block} className="mt-4 text-body text-label-secondary">
                  {block}
                </p>
              ) : (
                <ul key={block[0]} className="mt-4 list-disc space-y-2 pl-6 text-body text-label-secondary">
                  {block.map((item) => (
                    <li key={item} className="break-words">
                      {item}
                    </li>
                  ))}
                </ul>
              ),
            )}
          </section>
        ))}
      </article>
    </div>
  );
}
