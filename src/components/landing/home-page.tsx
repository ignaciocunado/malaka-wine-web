import { Faq } from "@/components/landing/faq";
import { HomeStage } from "@/components/landing/home-stage";
import { PlanCard } from "@/components/landing/plan-card";
import { ButtonLink } from "@/components/ui/button";
import { ChevronRightIcon } from "@/components/ui/icons";
import { JsonLd } from "@/components/seo/json-ld";
import { getCatalog } from "@/lib/catalog";
import { getDictionary } from "@/lib/content";
import { ANCHORS, pagePath, type Lang } from "@/lib/site";
import { homeFaqJsonLd, plansJsonLd } from "@/lib/structured-data";

/**
 * Where the band sits on each scale of the taste-profile picture, per stage, as [start, width] in percent: wide after
 * the taste test, narrower after a box, narrow after a few. The numbers only draw the idea; they are not data.
 */
const PROFILE_BANDS = [
  [[2, 56], [27, 56], [22, 56]],
  [[9, 34], [45, 34], [43, 34]],
  [[15, 14], [59, 14], [65, 14]],
];

/** The homepage in one language; `app/(es)/page.tsx` and `app/en/page.tsx` render it. */
export function HomePage({ lang }: { lang: Lang }) {
  const { home, taste } = getDictionary(lang);
  const { plans } = getCatalog(lang);
  const anchors = ANCHORS[lang];
  const interestPath = pagePath(lang, "interest");
  const scales = [
    [taste.sweetness.options.DRY, taste.sweetness.options.SWEET],
    [taste.body_.min, taste.body_.max],
    [taste.adventure.min, taste.adventure.max],
  ];
  return (
    // The stage slides up under the translucent navigation bar, so the opening picture fills the whole screen.
    <div className="-mt-13">
      <JsonLd data={homeFaqJsonLd(lang)} />
      <JsonLd data={plansJsonLd(lang)} />

      <HomeStage description={home.hero.scene}>
        {/* Hero: the headline sits in the sky, the buttons on the vineyard at the foot of the screen. */}
        <section className="home-stage-hero mx-auto flex min-h-svh max-w-6xl flex-col px-4 pt-28 pb-8 sm:px-6 md:pt-36">
          {/* One heading: the line that says what the site sells, then the headline. */}
          <h1 className="max-w-2xl">
            <span className="block font-sans text-headline text-accent">{home.hero.eyebrow}</span>
            <span className="mt-4 block text-hero">{home.hero.title}</span>
          </h1>
          <p className="mt-6 max-w-md text-title3 font-normal text-label-secondary">{home.hero.body}</p>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-x-7 gap-y-3 pt-10">
            <div className="flex w-full flex-col items-center gap-x-7 gap-y-2 sm:w-auto sm:flex-row">
              <ButtonLink href={interestPath} size="lg" className="w-full shadow-[0_14px_40px_rgb(142_28_59/0.35)] sm:w-auto">
                {home.hero.cta}
              </ButtonLink>
              <ButtonLink href={`#${anchors.plans}`} variant="plain" className="h-11 text-label">
                {home.hero.plans} <ChevronRightIcon className="size-4" />
              </ButtonLink>
            </div>
            <a
              href={`#${anchors.how}`}
              className="hidden h-11 items-center gap-2 text-subheadline text-label-secondary transition-colors hover:text-label sm:inline-flex"
            >
              {home.hero.scroll} <ChevronRightIcon className="size-4 rotate-90" />
            </a>
          </div>
        </section>

        {/* Empty scroll: this is where the camera walks down the track and through the lagar's door. */}
        <div aria-hidden className="h-[110svh]" />

        {/* How it works, inside the cellar. */}
        <section
          id={anchors.how}
          data-stage-cellar
          className="mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-4 pt-24 pb-[32svh] sm:px-6"
        >
          <div className="max-w-xl">
            <p className="sr-only">{home.how.scene}</p>
            <p className="text-headline text-accent">{home.how.eyebrow}</p>
            <h2 className="mt-2 text-large-title md:text-hero">{home.how.title}</h2>
            <p className="mt-5 text-title3 font-normal text-label-secondary">{home.how.body}</p>
            <ol className="mt-10 border-b border-separator">
              {home.how.steps.map((step, index) => (
                <li key={step.title} className="flex gap-5 border-t border-separator py-5">
                  <span aria-hidden className="w-8 shrink-0 font-display text-title1 leading-none text-accent">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-title3">{step.title}</h3>
                    <p className="mt-1 text-body text-label-secondary">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <ButtonLink href={interestPath} variant="plain" className="mt-6 h-11">
              {home.how.cta} <ChevronRightIcon className="size-4" />
            </ButtonLink>
          </div>
        </section>
      </HomeStage>

      {/* The taste profile narrowing, box by box. */}
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-24 sm:px-6">
        <h2 className="max-w-2xl text-large-title">{home.profile.title}</h2>
        <p className="mt-3 max-w-xl text-body text-label-secondary">{home.profile.body}</p>
        <ol className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-3">
          {home.profile.stages.map((stage, stageIndex) => (
            <li key={stage.title} className="border-t border-label/25 pt-6">
              <h3 className="text-title3">{stage.title}</h3>
              <p className="mt-1 text-subheadline text-label-secondary md:min-h-10">{stage.body}</p>
              {/* A drawing of the idea; the heading and the line above say what it shows. */}
              <div aria-hidden className="mt-2">
                {scales.map(([min, max], scaleIndex) => {
                  const [start, width] = PROFILE_BANDS[stageIndex][scaleIndex];
                  return (
                    <div key={min} className="mt-6">
                      <div className="flex justify-between gap-3 text-footnote text-label-secondary">
                        <span>{min}</span>
                        <span className="text-right">{max}</span>
                      </div>
                      <div className="relative mt-2 h-3.5">
                        <div className="absolute inset-x-0 top-1.5 h-0.5 bg-label/20" />
                        <div className="absolute top-0.5 h-2.5 rounded-full bg-accent" style={{ left: `${start}%`, width: `${width}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-footnote text-label-secondary">{home.profile.note}</p>
      </section>

      {/* Plans */}
      <section id={anchors.plans} className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <p className="text-headline text-accent">{home.plans.eyebrow}</p>
        <h2 className="mt-2 max-w-3xl text-large-title md:text-hero">{home.plans.title}</h2>
        <p className="mt-4 max-w-xl text-body text-label-secondary">{home.plans.body}</p>
        <div className="mt-14 grid gap-x-12 md:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.code} plan={plan} lang={lang} />
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <h2 className="text-large-title">{home.faq.title}</h2>
        <div className="mt-8">
          <Faq questions={home.faq.questions} />
        </div>
      </section>
    </div>
  );
}
