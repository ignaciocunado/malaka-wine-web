import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { ChevronRightIcon } from "@/components/ui/icons";
import { AreaExplorer, AreaTable, type ExplorerArea } from "@/components/guide/relief-table";
import type { PlaceKey } from "@/components/scene/relief-scene";
import province from "@/components/scene/data/province.json";
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
            className="flex h-full items-center justify-between gap-4 rounded-md bg-elevated p-6 ring-1 ring-separator/60 transition-colors duration-300 hover:ring-accent/60"
          >
            <span>
              <span className="block font-display text-headline">{topic.name}</span>
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

/** Whether a guide topic is one of the wine areas marked on the relief table (their keys there are the slugs). */
const onTable = (slug: string): slug is PlaceKey => slug in province.places;

/** The closing lines every guide page shares: when it was updated and the invitation to register. */
function Closing({ lang }: { lang: Lang }) {
  const { cta, labels } = getGuide(lang);
  const updated = new Intl.DateTimeFormat(DATE_LOCALE[lang], { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(GUIDE_UPDATED),
  );
  return (
    <>
      <p className="mt-14 text-footnote text-label-secondary">
        {labels.updated} <time dateTime={GUIDE_UPDATED}>{updated}</time>
      </p>
      <aside className="mt-8 rounded-md bg-elevated p-6 ring-1 ring-separator/60">
        <h2 className="text-title1">{cta.title}</h2>
        <p className="mt-2 max-w-md text-body text-label-secondary">{cta.body}</p>
        <ButtonLink href={pagePath(lang, "interest")} size="lg" className="mt-6">
          {cta.button}
        </ButtonLink>
      </aside>
    </>
  );
}

/** The overview of Málaga wines: the province's relief table to explore the areas, then the grapes and the rest. */
export function GuidePage({ lang }: { lang: Lang }) {
  const guide = getGuide(lang);
  const ofKind = (kind: TopicKind) => guide.topics.filter((topic) => topic.kind === kind);
  const areas: ExplorerArea[] = ofKind("zone").flatMap((topic) =>
    onTable(topic.slug)
      ? [{ key: topic.slug, name: topic.name, summary: topic.summary, intro: topic.intro, facts: topic.facts.slice(0, 4), more: topic.title, href: topicPath(lang, topic.slug) }]
      : [],
  );
  return (
    <article className="pt-10 pb-16 sm:pt-14">
      <JsonLd data={guideJsonLd(lang)} />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Breadcrumbs items={[{ label: guide.labels.breadcrumbHome, href: pagePath(lang, "home") }, { label: guide.labels.backToGuide }]} />
        <header className="mt-6 max-w-3xl">
          <p className="text-headline text-accent">{guide.eyebrow}</p>
          <h1 className="mt-2 text-large-title sm:text-hero">{guide.title}</h1>
          <p className="mt-5 text-title3 font-normal text-label-secondary">{guide.intro}</p>
        </header>
        <section className="mt-14">
          <h2 className="text-title1">{guide.zones.heading}</h2>
          <div className="mt-7">
            <AreaExplorer labels={guide.labels.table} areas={areas} overview={guide.zones.body.join(" ")} />
          </div>
        </section>
      </div>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Sections sections={guide.opening} />
        <Sections sections={[guide.grapes]} />
        <TopicLinks lang={lang} topics={ofKind("grape")} />
        <Sections sections={guide.closing} />
        <Closing lang={lang} />
      </div>
    </article>
  );
}

/** One wine area or grape. An area's page opens with the relief table turned to it. */
export function TopicPage({ lang, topic }: { lang: Lang; topic: Topic }) {
  const guide = getGuide(lang);
  const others = guide.topics.filter((other) => other.slug !== topic.slug);
  // Same kind first: someone reading about an area most likely wants the other areas next.
  const related = [...others.filter((other) => other.kind === topic.kind), ...others.filter((other) => other.kind !== topic.kind)].slice(0, 4);
  const header = (
    <>
      <Breadcrumbs
        items={[
          { label: guide.labels.breadcrumbHome, href: pagePath(lang, "home") },
          { label: guide.labels.backToGuide, href: pagePath(lang, "guide") },
          { label: topic.name },
        ]}
      />
      <header className="mt-6">
        <p className="text-headline text-accent">{guide.labels.kind[topic.kind]}</p>
        <h1 className="mt-2 text-large-title sm:text-hero">{topic.title}</h1>
        <p className="mt-5 text-title3 font-normal text-label-secondary">{topic.intro}</p>
      </header>
    </>
  );
  return (
    <article className="pt-10 pb-16 sm:pt-14">
      <JsonLd data={topicJsonLd(lang, topic)} />
      {onTable(topic.slug) ? (
        <div className="mx-auto grid max-w-6xl items-center gap-x-12 gap-y-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div>{header}</div>
          <div>
            <AreaTable labels={guide.labels.table} place={{ key: topic.slug, name: topic.name }} className="aspect-4/3 sm:aspect-16/10" />
            <p className="mt-3 text-footnote text-label-secondary">{guide.labels.table.credit}</p>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-3xl px-4 sm:px-6">{header}</div>
      )}
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <section className="mt-12">
          <h2 className="text-headline text-accent">{guide.labels.facts}</h2>
          <dl className="mt-3 border-b border-separator text-subheadline">
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
        <Closing lang={lang} />
      </div>
    </article>
  );
}
