import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";
import { WineGlassIcon } from "@/components/ui/icons";
import { formatEuros } from "@/lib/format";
import { getDictionary } from "@/lib/content";
import { pagePath, type Lang } from "@/lib/site";
import type { Plan } from "@/lib/types";

export function PlanCard({ plan, lang }: { plan: Plan; lang: Lang }) {
  const text = getDictionary(lang).home.plans;
  return (
    <article
      className={cn(
        "relative flex flex-col rounded-3xl bg-elevated p-7",
        plan.featured ? "ring-2 ring-tint" : "ring-1 ring-separator/40",
      )}
    >
      {plan.featured && (
        <span className="absolute -top-3 left-7 rounded-full bg-tint px-3 py-1 text-caption font-semibold text-tint-contrast">
          {text.featured}
        </span>
      )}
      <WineGlassIcon className="size-8 text-tint" />
      <h3 className="mt-4 text-title2">{plan.name}</h3>
      <p className="mt-1 text-subheadline text-label-secondary">{plan.tagline}</p>
      <p className="mt-6 flex items-baseline gap-1">
        <span className="text-large-title">{formatEuros(plan.priceCents, lang)}</span>
        <span className="text-subheadline text-label-secondary">{text.perMonth}</span>
      </p>
      {/* flex-1 keeps the buttons aligned across cards with taglines of different lengths */}
      <p className="mt-2 flex-1 text-footnote text-label-secondary">{plan.contents}</p>
      <ButtonLink
        href={`${pagePath(lang, "interest")}?plan=${plan.code}`}
        variant={plan.featured ? "filled" : "tinted"}
        className="mt-7 w-full"
      >
        {text.choose(plan.name)}
      </ButtonLink>
    </article>
  );
}
