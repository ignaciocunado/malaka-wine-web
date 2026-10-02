import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";
import { BoxIcon, DropIcon, WineGlassIcon } from "@/components/ui/icons";
import { formatEuros } from "@/lib/format";
import type { Plan } from "@/lib/types";

const planIcon = {
  WINE: WineGlassIcon,
  OLIVE_OIL: DropIcon,
  BOTH: BoxIcon,
};

export function PlanCard({ plan }: { plan: Plan }) {
  const Icon = planIcon[plan.productType];
  return (
    <article
      className={cn(
        "relative flex flex-col rounded-3xl bg-elevated p-7 transition-transform duration-300 ease-ios hover:scale-[1.015]",
        plan.featured ? "ring-2 ring-tint" : "ring-1 ring-separator/40",
      )}
    >
      {plan.featured && (
        <span className="absolute -top-3 left-7 rounded-full bg-tint px-3 py-1 text-caption font-semibold text-tint-contrast">
          Most popular
        </span>
      )}
      <Icon className={cn("size-8", plan.productType === "OLIVE_OIL" ? "text-olive" : "text-tint")} />
      <h3 className="mt-4 text-title2">{plan.name}</h3>
      <p className="mt-1 text-subheadline text-label-secondary">{plan.tagline}</p>
      <p className="mt-6 flex items-baseline gap-1">
        <span className="text-large-title">{formatEuros(plan.priceCents)}</span>
        <span className="text-subheadline text-label-secondary">/ month</span>
      </p>
      <p className="mt-2 text-footnote text-label-secondary">{plan.contents}</p>
      <ButtonLink
        href={`/account?plan=${plan.code}`}
        variant={plan.featured ? "filled" : "tinted"}
        className="mt-7 w-full"
      >
        Choose {plan.name}
      </ButtonLink>
    </article>
  );
}
