import { ScenePoster } from "@/components/scene/poster";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink, buttonClasses } from "@/components/ui/button";
import { ChevronRightIcon } from "@/components/ui/icons";
import { getDictionary } from "@/lib/content";
import { FOUNDER, pagePath, type Lang } from "@/lib/site";
import { aboutJsonLd } from "@/lib/structured-data";

/** Who is behind Malaka Wine: the founder, the projects that built the contacts with producers, and why. */
export function AboutPage({ lang }: { lang: Lang }) {
  const { about } = getDictionary(lang);
  return (
    <article className="pb-16">
      <JsonLd data={aboutJsonLd(lang)} />
      {/* The vineyard above the bay, as on the Apúntate page, fading into the page ground below. */}
      <header className="relative isolate -mt-13 overflow-hidden px-4 pt-28 pb-20 sm:px-6 sm:pt-36 sm:pb-28">
        <ScenePoster name="vineyard" eager className="absolute inset-0 -z-10 size-full object-cover" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-system/80 lg:bg-transparent lg:bg-linear-to-r lg:from-system/95 lg:via-system/80 lg:via-45% lg:to-system/10" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-linear-to-b from-transparent to-system" />
        <div className="mx-auto max-w-6xl">
          <div className="max-w-xl">
            <p className="text-headline text-accent">{about.eyebrow}</p>
            <h1 className="mt-2 text-large-title sm:text-[3.5rem] sm:leading-[1.03]">{about.title}</h1>
            <p className="mt-5 text-title3 font-normal text-label/85">{about.intro}</p>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <section className="mt-4">
          <p className="text-headline text-accent">{about.founder.role}</p>
          <h2 className="mt-2 text-title1">{FOUNDER.name}</h2>
          {about.founder.body.map((paragraph) => (
            <p key={paragraph} className="mt-4 text-body text-label-secondary">
              {paragraph}
            </p>
          ))}
          <a href={FOUNDER.linkedIn} className={buttonClasses({ variant: "plain" }, "mt-5 h-11")}>
            {about.founder.linkedIn} <ChevronRightIcon className="size-4" />
          </a>
        </section>
        <section className="mt-14">
          <h2 className="text-title1">{about.projects.title}</h2>
          <dl className="mt-5 border-b border-separator text-subheadline">
            {about.projects.items.map(([name, description]) => (
              <div key={name} className="grid gap-x-4 gap-y-0.5 border-t border-separator py-3 sm:grid-cols-[12rem_1fr]">
                <dt className="font-semibold">{name}</dt>
                <dd className="text-label-secondary">{description}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="mt-14">
          <h2 className="text-title1">{about.why.title}</h2>
          {about.why.body.map((paragraph) => (
            <p key={paragraph} className="mt-4 text-body text-label-secondary">
              {paragraph}
            </p>
          ))}
        </section>
        <aside className="mt-14 rounded-3xl bg-elevated p-8 ring-1 ring-separator/60 sm:p-10">
          <h2 className="text-title1">{about.cta.title}</h2>
          <p className="mt-2 max-w-md text-body text-label-secondary">{about.cta.body}</p>
          <ButtonLink href={pagePath(lang, "interest")} size="lg" className="mt-6">
            {about.cta.button}
          </ButtonLink>
        </aside>
      </div>
    </article>
  );
}
