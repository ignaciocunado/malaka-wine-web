import { Faq } from "@/components/landing/faq";
import { PlanCard } from "@/components/landing/plan-card";
import { Tablecloth } from "@/components/landing/tablecloth";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";
import {
  BoxIcon,
  CalendarIcon,
  ChevronRightIcon,
  HandshakeIcon,
  SparklesIcon,
  WineGlassIcon,
} from "@/components/ui/icons";
import { JsonLd } from "@/components/seo/json-ld";
import { CATALOG_IS_SAMPLE, HERO_STAGE_ID, getCatalog, regionStageId } from "@/lib/catalog";
import { getDictionary } from "@/lib/content";
import { ANCHORS, pagePath, topicPath, type Lang } from "@/lib/site";
import { homeFaqJsonLd, plansJsonLd } from "@/lib/structured-data";

const FEATURE_ICONS = [HandshakeIcon, SparklesIcon, CalendarIcon];

/** Cards read as sheets of paper lying on the tablecloth, each a touch askew. */
const PAPER = "rounded-md bg-elevated p-7 shadow-paper odd:-rotate-1 even:rotate-[0.6deg]";

/**
 * Reserves the patch of tablecloth where a group of 3D bottles comes to rest; see `TableclothScene`. The bottles
 * are drawn on the canvas behind the page, so this element is empty and only describes them to screen readers.
 */
function BottleStage({ id, side, label }: { id: string; side: "left" | "right"; label: string }) {
  return (
    <div
      data-bottle-stage={id}
      data-side={side}
      role="img"
      aria-label={label}
      className={cn("h-80 md:h-[30rem]", side === "left" && "md:order-1")}
    />
  );
}

/** The homepage in one language; `app/(es)/page.tsx` and `app/en/page.tsx` render it. */
export function HomePage({ lang }: { lang: Lang }) {
  const { home } = getDictionary(lang);
  const { plans, producers, regions } = getCatalog(lang);
  const anchors = ANCHORS[lang];
  const tastePath = pagePath(lang, "taste");
  return (
    <div className="tablecloth relative isolate overflow-x-clip">
      <JsonLd data={homeFaqJsonLd(lang)} />
      {!CATALOG_IS_SAMPLE && <JsonLd data={plansJsonLd(lang)} />}
      <Tablecloth lang={lang} />

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 pt-16 pb-8 sm:px-6 md:min-h-[42rem] md:grid-cols-2 md:pt-24 md:pb-16">
        <div className="text-center md:text-left">
          {/* One heading: the line that says what the site sells, then the headline. */}
          <h1>
            <span className="block font-sans text-headline text-tint">{home.hero.eyebrow}</span>
            <span className="mt-3 block text-hero">{home.hero.title}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-title3 font-normal text-label-secondary md:mx-0">
            {home.hero.body}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 md:justify-start">
            <ButtonLink href={tastePath} size="lg">
              {home.hero.cta}
            </ButtonLink>
            <ButtonLink href={`#${anchors.plans}`} variant="plain">
              {home.hero.plans} <ChevronRightIcon className="size-4" />
            </ButtonLink>
          </div>
        </div>
        <BottleStage id={HERO_STAGE_ID} side="right" label={home.hero.bottles} />
      </section>

      {/* Why */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="max-w-2xl text-large-title">
          {home.why.title} <span className="text-label-secondary">{home.why.titleMuted}</span>
        </h2>
        <div className="mt-12 grid gap-7 md:grid-cols-3">
          {home.why.features.map(({ title, body }, index) => {
            const Icon = FEATURE_ICONS[index];
            return (
              <div key={title} className={PAPER}>
                <Icon className="size-8 text-tint" />
                <h3 className="mt-5 text-title3">{title}</h3>
                <p className="mt-2 text-body text-label-secondary">{body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section id={anchors.how} className="scroll-mt-14">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <p className="text-headline text-tint">{home.how.eyebrow}</p>
          <h2 className="mt-2 text-large-title">{home.how.title}</h2>
          <ol className="mt-12 grid gap-7 md:grid-cols-3">
            {home.how.steps.map((step, index) => (
              <li key={step.title} className={PAPER}>
                <span className="flex size-9 items-center justify-center rounded-full bg-tint text-headline text-tint-contrast">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-title3">{step.title}</h3>
                <p className="mt-2 text-body text-label-secondary">{step.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10">
            <ButtonLink href={tastePath} variant="plain">
              {home.how.cta} <ChevronRightIcon className="size-4" />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Regions */}
      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
        <p className="text-headline text-tint">{home.regions.eyebrow}</p>
        <h2 className="mt-2 max-w-3xl text-hero">{home.regions.title}</h2>
        {regions.map((region, index) => {
          const side = index % 2 === 0 ? "right" : "left";
          return (
            <div key={region.name} className="grid items-center gap-x-12 gap-y-4 py-14 md:min-h-[44rem] md:grid-cols-2 md:py-20">
              <div className={cn(side === "left" && "md:order-2")}>
                <p className="text-footnote font-semibold tracking-widest text-label-secondary">
                  0{index + 1} / 0{regions.length}
                </p>
                <h3 className="mt-3 text-large-title md:text-[3.75rem] md:leading-none">{region.name}</h3>
                <p className="mt-4 max-w-md text-title3 font-normal text-label-secondary">{region.detail}</p>
                <ul className="mt-7 max-w-md text-subheadline">
                  {region.wines
                    .filter((wine, position, wines) => wines.findIndex((other) => other.name === wine.name) === position)
                    .map((wine) => (
                      <li key={wine.name} className="flex justify-between gap-4 border-t border-separator py-3">
                        <span className="font-semibold">{wine.name}</span>
                        <span className="text-right text-label-secondary">{wine.producer}</span>
                      </li>
                    ))}
                </ul>
                <ButtonLink href={topicPath(lang, region.slug)} variant="plain" className="mt-5">
                  {home.regions.more} <ChevronRightIcon className="size-4" />
                </ButtonLink>
              </div>
              <BottleStage
                id={regionStageId(index)}
                side={side}
                label={home.regions.bottles(region.name, region.wines.map((wine) => wine.name).join(", "))}
              />
            </div>
          );
        })}
      </section>

      {/* Plans */}
      <section id={anchors.plans} className="scroll-mt-14">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="text-center">
            <p className="text-headline text-tint">{home.plans.eyebrow}</p>
            <h2 className="mt-2 text-large-title">{home.plans.title}</h2>
            <p className="mx-auto mt-3 max-w-xl text-body text-label-secondary">
              {home.plans.body}
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard key={plan.code} plan={plan} lang={lang} />
            ))}
          </div>
        </div>
      </section>

      {/* Producers */}
      <section id={anchors.producers} className="mx-auto max-w-6xl scroll-mt-14 px-4 py-20 sm:px-6">
        <p className="text-headline text-tint">{home.producers.eyebrow}</p>
        <h2 className="mt-2 text-large-title">{home.producers.title}</h2>
        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {producers.map((producer) => (
            <article key={producer.slug} className={PAPER}>
              <div className="flex items-center gap-2 text-footnote text-label-secondary">
                <WineGlassIcon className="size-4 text-tint" />
                {producer.town} · {producer.area}
              </div>
              <h3 className="mt-3 text-title3">{producer.name}</h3>
              <p className="mt-1 text-subheadline font-medium">{producer.specialty}</p>
              <p className="mt-3 text-subheadline text-label-secondary">{producer.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Wine guide */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl rounded-md bg-elevated p-7 shadow-paper sm:p-10">
          <p className="text-headline text-tint">{home.guide.eyebrow}</p>
          <h2 className="mt-2 text-large-title">{home.guide.title}</h2>
          <p className="mt-4 text-body text-label-secondary">{home.guide.body}</p>
          <ButtonLink href={pagePath(lang, "guide")} variant="plain" className="mt-6">
            {home.guide.cta} <ChevronRightIcon className="size-4" />
          </ButtonLink>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <h2 className="text-center text-large-title">{home.faq.title}</h2>
          <div className="mt-10">
            <Faq questions={home.faq.questions} />
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
        <BoxIcon className="mx-auto size-12 text-tint" />
        <h2 className="mt-5 text-large-title">{home.closing.title}</h2>
        <p className="mx-auto mt-3 max-w-lg text-body text-label-secondary">
          {home.closing.body}
        </p>
        <ButtonLink href={tastePath} size="lg" className="mt-8">
          {home.closing.cta}
        </ButtonLink>
      </section>
    </div>
  );
}
