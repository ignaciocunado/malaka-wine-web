import { Faq } from "@/components/landing/faq";
import { HeroArt } from "@/components/landing/hero-art";
import { PlanCard } from "@/components/landing/plan-card";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";
import {
  BoxIcon,
  CalendarIcon,
  ChevronRightIcon,
  DropIcon,
  HandshakeIcon,
  SparklesIcon,
  WineGlassIcon,
} from "@/components/ui/icons";
import { api } from "@/lib/api";
import { FALLBACK_PLANS, REGIONS } from "@/lib/catalog";
import type { Plan, Producer } from "@/lib/types";

const FEATURES = [
  {
    icon: HandshakeIcon,
    title: "Only small producers",
    body: "Family wineries and mills making a few thousand bottles a year. Most never reach a supermarket shelf.",
  },
  {
    icon: SparklesIcon,
    title: "Matched to your taste",
    body: "Tell us what you love once. Every box is picked around your profile, and gets better as you rate it.",
  },
  {
    icon: CalendarIcon,
    title: "Delivered every month",
    body: "Your box ships in the first week of the month. Change plan, skip or cancel whenever you like.",
  },
];

const STEPS = [
  { title: "Take the taste quiz", body: "Two minutes on styles, intensity and budget." },
  { title: "We curate your box", body: "Bottles chosen from this month's releases across the province." },
  { title: "Open a little Málaga", body: "With tasting notes, pairings and the story of each producer." },
];

async function loadCatalog(): Promise<{ plans: Plan[]; producers: Producer[] }> {
  // The marketing page still renders (with sample plans) if the API is down.
  const [plans, producers] = await Promise.allSettled([api.plans(), api.producers()]);
  return {
    plans: plans.status === "fulfilled" && plans.value.length > 0 ? plans.value : FALLBACK_PLANS,
    producers: producers.status === "fulfilled" ? producers.value : [],
  };
}

export default async function Home() {
  const { plans, producers } = await loadCatalog();

  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden bg-system-secondary">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pt-16 pb-8 sm:px-6 md:grid-cols-2 md:pt-24 md:pb-16">
          <div className="text-center md:text-left">
            <p className="text-headline text-tint">Wine &amp; olive oil subscription</p>
            <h1 className="mt-3 text-hero">Málaga, delivered monthly.</h1>
            <p className="mx-auto mt-5 max-w-md text-title3 font-normal text-label-secondary md:mx-0">
              A box of wine and extra virgin olive oil from the province&apos;s best small producers, matched to
              your taste.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-5 md:justify-start">
              <ButtonLink href="/taste" size="lg">
                Find your taste
              </ButtonLink>
              <ButtonLink href="#plans" variant="plain">
                See plans <ChevronRightIcon className="size-4" />
              </ButtonLink>
            </div>
          </div>
          <HeroArt className="mx-auto w-full max-w-md md:max-w-none" />
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="max-w-2xl text-large-title">
          The taste of the place. <span className="text-label-secondary">Straight from the people who make it.</span>
        </h2>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-3xl bg-system-secondary p-7">
              <Icon className="size-8 text-tint" />
              <h3 className="mt-5 text-title3">{title}</h3>
              <p className="mt-2 text-body text-label-secondary">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-14 bg-system-secondary">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <p className="text-headline text-tint">How it works</p>
          <h2 className="mt-2 text-large-title">Three steps to your first box.</h2>
          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title} className="rounded-3xl bg-elevated p-7">
                <span className="flex size-9 items-center justify-center rounded-full bg-tint text-headline text-tint-contrast">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-title3">{step.title}</h3>
                <p className="mt-2 text-body text-label-secondary">{step.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10">
            <ButtonLink href="/taste" variant="plain">
              Take the taste quiz <ChevronRightIcon className="size-4" />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Regions */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="text-headline text-tint">From the hills to your table</p>
        <h2 className="mt-2 text-large-title">Four corners of one province.</h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {REGIONS.map((region) => (
            <div
              key={region.name}
              className={cn("flex min-h-56 flex-col justify-end rounded-3xl bg-linear-to-br p-7 text-white", region.gradient)}
            >
              <h3 className="text-title1">{region.name}</h3>
              <p className="mt-2 max-w-md text-callout text-white/90">{region.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="scroll-mt-14 bg-system-secondary">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="text-center">
            <p className="text-headline text-tint">Plans</p>
            <h2 className="mt-2 text-large-title">Pick your box.</h2>
            <p className="mx-auto mt-3 max-w-xl text-body text-label-secondary">
              Free delivery in mainland Spain. Change or cancel any time.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard key={plan.code} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      {/* Producers */}
      {producers.length > 0 && (
        <section id="producers" className="mx-auto max-w-6xl scroll-mt-14 px-4 py-20 sm:px-6">
          <p className="text-headline text-tint">Meet the makers</p>
          <h2 className="mt-2 text-large-title">This season&apos;s producers.</h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {producers.map((producer) => {
              const isWinery = producer.kind === "WINERY";
              const Icon = isWinery ? WineGlassIcon : DropIcon;
              return (
                <article key={producer.slug} className="rounded-3xl bg-system-secondary p-7">
                  <div className="flex items-center gap-2 text-footnote text-label-secondary">
                    <Icon className={cn("size-4", isWinery ? "text-tint" : "text-olive")} />
                    {isWinery ? "Winery" : "Olive mill"} · {producer.town}, {producer.area}
                  </div>
                  <h3 className="mt-3 text-title3">{producer.name}</h3>
                  <p className="mt-1 text-subheadline font-medium">{producer.specialty}</p>
                  <p className="mt-3 text-subheadline text-label-secondary">{producer.description}</p>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="bg-system-secondary">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <h2 className="text-center text-large-title">Questions? Answers.</h2>
          <div className="mt-10">
            <Faq />
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
        <BoxIcon className="mx-auto size-12 text-tint" />
        <h2 className="mt-5 text-large-title">Your first box ships on the 1st.</h2>
        <p className="mx-auto mt-3 max-w-lg text-body text-label-secondary">
          Two minutes of questions now, a little piece of Málaga on your table every month.
        </p>
        <ButtonLink href="/taste" size="lg" className="mt-8">
          Find your taste
        </ButtonLink>
      </section>
    </>
  );
}
