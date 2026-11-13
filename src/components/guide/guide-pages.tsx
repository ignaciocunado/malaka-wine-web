import Link from "next/link";
import type { ReactNode } from "react";

import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { ChevronRightIcon } from "@/components/ui/icons";
import { GUIDE_UPDATED, getGuide, type Section, type Topic, type TopicKind } from "@/lib/content/guide";
import { pagePath, topicPath, type Lang } from "@/lib/site";
import { guideJsonLd, topicJsonLd } from "@/lib/structured-data";

const DATE_LOCALE: Record<Lang, string> = { es: "es-ES", en: "en-GB" };

function Sections({ sections }: { sections: Section[] }) {
  return sections.map((section) => (
    <section key={section.heading} className="mt-14">
      <h2 className="text-title1">{section.heading}</h2>
      {section.body.map((paragraph) => (
        <p key={paragraph} className="mt-4 text-body text-label-secondary">
          {paragraph}
        </p>
      ))}
    </section>
  ));
}

function TopicLinks({ lang, topics }: { lang: Lang; topics: Topic[] }) {
  return (
    <ul className="mt-6 grid gap-4 sm:grid-cols-2">
      {topics.map((topic) => (
        <li key={topic.slug}>
          <Link
            href={topicPath(lang, topic.slug)}
            className="flex h-full items-center justify-between gap-4 rounded-2xl bg-elevated p-5 ring-1 ring-separator/40 transition-shadow duration-300 hover:shadow-md"
          >
            <span>
              <span className="block text-headline">{topic.name}</span>
              <span className="mt-1 block text-subheadline text-label-secondary">{topic.summary}</span>
            </span>
            <ChevronRightIcon className="size-4 shrink-0 text-label-tertiary" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-footnote text-label-secondary">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {index > 0 && <span aria-hidden>/</span>}
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-label">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Shell({ lang, children }: { lang: Lang; children: ReactNode }) {
  const { cta, labels } = getGuide(lang);
  const updated = new Intl.DateTimeFormat(DATE_LOCALE[lang], { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(GUIDE_UPDATED),
  );
  return (
    <div className="bg-system-secondary">
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        {children}
        <p className="mt-14 text-footnote text-label-secondary">
          {labels.updated} <time dateTime={GUIDE_UPDATED}>{updated}</time>
        </p>
        <aside className="mt-8 rounded-3xl bg-elevated p-8 text-center ring-1 ring-separator/40">
          <h2 className="text-title2">{cta.title}</h2>
          <p className="mx-auto mt-2 max-w-md text-body text-label-secondary">{cta.body}</p>
          <ButtonLink href={pagePath(lang, "interest")} size="lg" className="mt-6">
            {cta.button}
          </ButtonLink>
        </aside>
      </article>
    </div>
  );
}

/** The overview of Málaga wines, linking to every area and grape. */
export function GuidePage({ lang }: { lang: Lang }) {
  const guide = getGuide(lang);
  const ofKind = (kind: TopicKind) => guide.topics.filter((topic) => topic.kind === kind);
  return (
    <Shell lang={lang}>
      <JsonLd data={guideJsonLd(lang)} />
      <Breadcrumbs items={[{ label: guide.labels.breadcrumbHome, href: pagePath(lang, "home") }, { label: guide.labels.backToGuide }]} />
      <header className="mt-6">
        <p className="text-headline text-tint">{guide.eyebrow}</p>
        <h1 className="mt-2 text-large-title sm:text-[3rem] sm:leading-[1.05]">{guide.title}</h1>
        <p className="mt-5 text-title3 font-normal text-label-secondary">{guide.intro}</p>
      </header>
      <Sections sections={guide.opening} />
      <Sections sections={[guide.zones]} />
      <TopicLinks lang={lang} topics={ofKind("zone")} />
      <Sections sections={[guide.grapes]} />
      <TopicLinks lang={lang} topics={ofKind("grape")} />
      <Sections sections={guide.closing} />
    </Shell>
  );
}

/** One wine area or grape. */
export function TopicPage({ lang, topic }: { lang: Lang; topic: Topic }) {
  const guide = getGuide(lang);
  const others = guide.topics.filter((other) => other.slug !== topic.slug);
  // Same kind first: someone reading about an area most likely wants the other areas next.
  const related = [...others.filter((other) => other.kind === topic.kind), ...others.filter((other) => other.kind !== topic.kind)].slice(0, 4);
  return (
    <Shell lang={lang}>
      <JsonLd data={topicJsonLd(lang, topic)} />
      <Breadcrumbs
        items={[
          { label: guide.labels.breadcrumbHome, href: pagePath(lang, "home") },
          { label: guide.labels.backToGuide, href: pagePath(lang, "guide") },
          { label: topic.name },
        ]}
      />
      <header className="mt-6">
        <p className="text-headline text-tint">{guide.labels.kind[topic.kind]}</p>
        <h1 className="mt-2 text-large-title sm:text-[3rem] sm:leading-[1.05]">{topic.title}</h1>
        <p className="mt-5 text-title3 font-normal text-label-secondary">{topic.intro}</p>
      </header>
      <section className="mt-10 rounded-2xl bg-elevated p-6 ring-1 ring-separator/40">
        <h2 className="text-headline">{guide.labels.facts}</h2>
        <dl className="mt-3 text-subheadline">
          {topic.facts.map(([label, value]) => (
            <div key={label} className="grid gap-x-4 gap-y-0.5 border-t border-separator py-3 sm:grid-cols-[10rem_1fr]">
              <dt className="font-semibold">{label}</dt>
              <dd className="text-label-secondary">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
      <Sections sections={topic.sections} />
      <section className="mt-14">
        <h2 className="text-title2">{guide.labels.related}</h2>
        <TopicLinks lang={lang} topics={related} />
      </section>
    </Shell>
  );
}
