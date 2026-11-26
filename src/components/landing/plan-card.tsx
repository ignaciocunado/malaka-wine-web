import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";
import { formatEuros } from "@/lib/format";
import { getDictionary } from "@/lib/content";
import { pagePath, type Lang } from "@/lib/site";
import type { Plan } from "@/lib/types";

/** One plan as a column under a rule; the featured plan's rule is amber and it gets the filled button. */
export function PlanCard({ plan, lang }: { plan: Plan; lang: Lang }) {
  const text = getDictionary(lang).home.plans;
  return (
    <article className={cn("flex flex-col border-t pt-7 pb-10", plan.featured ? "border-t-2 border-accent" : "border-label/25")}>
      {/* Every column keeps this line's height, so the names line up whether or not a plan is featured. */}
      <p className="min-h-5 text-footnote font-semibold text-accent">{plan.featured && text.featured}</p>
      <h3 className="mt-3 text-title1">{plan.name}</h3>
      {/* flex-1 keeps the prices aligned across columns with taglines of different lengths */}
      <p className="mt-2 flex-1 text-body text-label-secondary">{plan.tagline}</p>
      <p className="mt-6 flex items-baseline gap-1.5">
        <span className="text-hero leading-none">{formatEuros(plan.priceCents, lang)}</span>
        <span className="text-subheadline text-label-secondary">{text.period}</span>
      </p>
      <p className="mt-4 text-subheadline">{plan.contents}</p>
      <ButtonLink href={`${pagePath(lang, "interest")}?plan=${plan.code}`} variant={plan.featured ? "filled" : "tinted"} className="mt-7 w-full">
        {text.choose(plan.name)}
      </ButtonLink>
    </article>
  );
}
