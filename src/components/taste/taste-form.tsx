"use client";

import { useState, type ReactNode } from "react";

import { Button, ButtonLink } from "@/components/ui/button";
import { ChipGroup } from "@/components/ui/chip-group";
import { cn } from "@/components/ui/cn";
import { GroupedSection, ListRow } from "@/components/ui/grouped-list";
import { CheckIcon, ChevronLeftIcon } from "@/components/ui/icons";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Slider } from "@/components/ui/slider";
import { Stepper } from "@/components/ui/stepper";
import { getCatalog } from "@/lib/catalog";
import { getDictionary, type Dictionary } from "@/lib/content";
import { formatEuros } from "@/lib/format";
import { homeAnchor, type Lang } from "@/lib/site";
import { DEFAULT_TASTE_PROFILE, optionsOf, recommendedPlan } from "@/lib/taste";
import type { Plan, TasteProfile } from "@/lib/types";

const STEPS = ["styles", "palate", "box", "review"] as const;
type StepId = (typeof STEPS)[number];

type TasteText = Dictionary["taste"];

type Result = { plan: Plan; chosen: boolean };

/**
 * Demo taste quiz: everything happens in the browser and nothing is stored. It ends with the plan picked on the
 * landing page (`/taste?plan=BODEGA`) or, when none was picked, the one recommended for the answers.
 */
export function TasteForm({ lang }: { lang: Lang }) {
  const text = getDictionary(lang).taste;
  const { plans } = getCatalog(lang);
  const euros = (amount: number) => formatEuros(amount * 100, lang);
  const [profile, setProfile] = useState<TasteProfile>(DEFAULT_TASTE_PROFILE);
  const [stepId, setStepId] = useState<StepId>("styles");
  const [result, setResult] = useState<Result | null>(null);
  // Which way the last step change went; null on first render so the opening step doesn't animate in.
  const [direction, setDirection] = useState<"forward" | "back" | null>(null);

  const stepIndex = STEPS.indexOf(stepId);
  const update = (patch: Partial<TasteProfile>) => setProfile((current) => ({ ...current, ...patch }));
  // Smooth or instant comes from the CSS scroll-behavior, which honours prefers-reduced-motion.
  const scrollToTop = () => window.scrollTo({ top: 0 });
  const goTo = (id: StepId) => {
    setDirection(STEPS.indexOf(id) < stepIndex ? "back" : "forward");
    setStepId(id);
    scrollToTop();
  };

  const finish = () => {
    // Read in the click handler rather than with useSearchParams, so the page can stay fully static.
    const requested = new URLSearchParams(window.location.search).get("plan");
    const chosen = plans.find((plan) => plan.code === requested);
    const recommended = plans.find((plan) => plan.code === recommendedPlan(profile)) ?? plans[0];
    setResult({ plan: chosen ?? recommended, chosen: !!chosen });
    scrollToTop();
  };

  if (result) {
    const { plan, chosen } = result;
    return (
      <Card className="animate-materialize text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-system-green text-white">
          <CheckIcon className="size-9" strokeWidth={2.5} />
        </span>
        <h2 className="mt-6 text-title1">{chosen ? text.result.chosenTitle(plan.name) : text.result.recommendedTitle(plan.name)}</h2>
        <p className="mx-auto mt-2 max-w-sm text-body text-label-secondary">
          {chosen ? text.result.chosenBody : text.result.recommendedBody}
        </p>
        <div className="mx-auto mt-8 max-w-sm rounded-2xl bg-fill-quaternary p-5 text-left">
          <p className="text-headline">{plan.name}</p>
          <p className="mt-1 text-subheadline text-label-secondary">{plan.contents}</p>
          <p className="mt-3 flex items-baseline gap-1">
            <span className="text-title1">{formatEuros(plan.priceCents, lang)}</span>
            <span className="text-subheadline text-label-secondary">{text.result.perMonth}</span>
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-sm text-footnote text-label-secondary">
          {text.result.demo}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <ButtonLink href={homeAnchor(lang, "plans")} size="lg">
            {text.result.allPlans}
          </ButtonLink>
          <Button
            variant="plain"
            onClick={() => {
              setResult(null);
              setDirection("back");
              scrollToTop();
            }}
          >
            {text.result.editAnswers}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-5 px-1">
        <div className="flex items-center justify-between text-footnote text-label-secondary">
          <span>{text.progress(stepIndex + 1, STEPS.length)}</span>
        </div>
        <div
          className="mt-2 h-1 overflow-hidden rounded-full bg-fill-secondary"
          role="progressbar"
          aria-label={text.progressLabel}
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-valuenow={stepIndex + 1}
        >
          <div
            className="h-full rounded-full bg-tint transition-[width] duration-500 ease-spring"
            style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        {/* Keyed so each step mounts fresh and enters from the side matching the direction of travel. */}
        <div
          key={stepId}
          className={cn(direction === "forward" && "animate-step-forward", direction === "back" && "animate-step-back")}
        >
          <h2 className="text-title2">{text.steps[stepId].title}</h2>
          <p className="mt-1 text-subheadline text-label-secondary">{text.steps[stepId].subtitle}</p>

          <div className="mt-8 space-y-9">
            {stepId === "styles" && (
              <>
                <Question title={text.styles.title} hint={text.styles.hint}>
                  <ChipGroup
                    label={text.styles.label}
                    options={optionsOf(text.styles.options)}
                    value={profile.wineStyles}
                    onChange={(wineStyles) => update({ wineStyles })}
                  />
                </Question>
                <Question title={text.sweetness.title}>
                  <SegmentedControl
                    label={text.sweetness.label}
                    options={optionsOf(text.sweetness.options)}
                    value={profile.wineSweetness}
                    onChange={(wineSweetness) => update({ wineSweetness })}
                  />
                </Question>
              </>
            )}

            {stepId === "palate" && (
              <>
                <Question title={text.body_.title} value={text.body_.levels[profile.wineBody - 1]}>
                  <Slider
                    label={text.body_.label}
                    min={1}
                    max={5}
                    value={profile.wineBody}
                    onChange={(wineBody) => update({ wineBody })}
                    minLabel={text.body_.min}
                    maxLabel={text.body_.max}
                    valueText={text.body_.levels[profile.wineBody - 1]}
                  />
                </Question>
                <Question title={text.adventure.title} value={text.adventure.levels[profile.adventurousness - 1]}>
                  <Slider
                    label={text.adventure.label}
                    min={1}
                    max={5}
                    value={profile.adventurousness}
                    onChange={(adventurousness) => update({ adventurousness })}
                    minLabel={text.adventure.min}
                    maxLabel={text.adventure.max}
                    valueText={text.adventure.levels[profile.adventurousness - 1]}
                  />
                </Question>
              </>
            )}

            {stepId === "box" && (
              <>
                <Question title={text.bottles.title}>
                  <div className="flex items-center justify-between rounded-xl bg-fill-quaternary px-4 py-3">
                    <span className="text-body">{text.bottles.count(profile.bottlesPerBox)}</span>
                    <Stepper
                      label={text.bottles.title}
                      decreaseLabel={text.bottles.decrease}
                      increaseLabel={text.bottles.increase}
                      value={profile.bottlesPerBox}
                      min={2}
                      max={6}
                      onChange={(bottlesPerBox) => update({ bottlesPerBox })}
                    />
                  </div>
                </Question>
                <Question title={text.frequency.title}>
                  <SegmentedControl
                    label={text.frequency.label}
                    options={optionsOf(text.frequency.options)}
                    value={profile.deliveryFrequency}
                    onChange={(deliveryFrequency) => update({ deliveryFrequency })}
                  />
                </Question>
                <Question title={text.budget.title} value={euros(profile.monthlyBudgetEur)}>
                  <Slider
                    label={text.budget.title}
                    min={20}
                    max={150}
                    step={5}
                    value={profile.monthlyBudgetEur}
                    onChange={(monthlyBudgetEur) => update({ monthlyBudgetEur })}
                    minLabel={euros(20)}
                    maxLabel={euros(150)}
                    valueText={text.budget.valueText(profile.monthlyBudgetEur)}
                  />
                </Question>
                <Question title={text.notes.title} hint={text.notes.hint}>
                  <textarea
                    value={profile.notes}
                    onChange={(event) => update({ notes: event.target.value })}
                    maxLength={1000}
                    rows={3}
                    aria-label={text.notes.label}
                    placeholder={text.notes.placeholder}
                    className="block w-full resize-none rounded-xl bg-fill-quaternary px-4 py-3 text-body outline-none placeholder:text-label-tertiary focus:ring-2 focus:ring-tint/40"
                  />
                </Question>
              </>
            )}

            {stepId === "review" && <Review profile={profile} onEdit={goTo} text={text} euros={euros} />}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between gap-3">
          {stepIndex > 0 ? (
            <Button variant="gray" onClick={() => goTo(STEPS[stepIndex - 1])}>
              <ChevronLeftIcon className="-ml-1 size-4" /> {text.back}
            </Button>
          ) : (
            <span />
          )}
          {stepId === "review" ? (
            <Button onClick={finish}>{text.finish}</Button>
          ) : (
            <Button onClick={() => goTo(STEPS[stepIndex + 1])}>{text.next}</Button>
          )}
        </div>
      </Card>
    </div>
  );
}

function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-3xl bg-grouped-secondary p-6 shadow-sm sm:p-9", className)}>{children}</div>;
}

function Question({
  title,
  hint,
  value,
  children,
}: {
  title: string;
  hint?: string;
  value?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h3 className="text-headline">{title}</h3>
        {value && <span className="shrink-0 text-subheadline font-medium text-tint">{value}</span>}
      </div>
      {hint && <p className="-mt-2 mb-3 text-footnote text-label-secondary">{hint}</p>}
      {children}
    </div>
  );
}

function Review({
  profile,
  onEdit,
  text,
  euros,
}: {
  profile: TasteProfile;
  onEdit: (step: StepId) => void;
  text: TasteText;
  euros: (amount: number) => string;
}) {
  const labels = text.review;
  // Listed in the options' order, not the order the answers were picked in.
  const styles = optionsOf(text.styles.options)
    .filter((option) => profile.wineStyles.includes(option.value))
    .map((option) => option.label);
  const header = (title: string, step: StepId) => (
    <span className="flex items-center justify-between">
      {title}
      <button
        type="button"
        onClick={() => onEdit(step)}
        className="text-subheadline font-normal normal-case text-tint transition-opacity duration-300 active:opacity-60 active:duration-0"
      >
        {text.edit}
      </button>
    </span>
  );

  return (
    <div className="space-y-7">
      <GroupedSection header={header(labels.styles, "styles")} className="[&>div]:bg-fill-quaternary">
        <SummaryRow label={labels.wines} value={styles.length === 0 ? text.styles.none : styles.join(", ")} />
        <SummaryRow label={labels.sweetness} value={text.sweetness.options[profile.wineSweetness]} />
      </GroupedSection>
      <GroupedSection header={header(labels.palate, "palate")} className="[&>div]:bg-fill-quaternary">
        <SummaryRow label={labels.body} value={text.body_.levels[profile.wineBody - 1]} />
        <SummaryRow label={labels.adventure} value={text.adventure.levels[profile.adventurousness - 1]} />
      </GroupedSection>
      <GroupedSection header={header(labels.box, "box")} className="[&>div]:bg-fill-quaternary">
        <SummaryRow label={labels.bottles} value={String(profile.bottlesPerBox)} />
        <SummaryRow label={labels.delivery} value={text.frequency.options[profile.deliveryFrequency]} />
        <SummaryRow label={labels.budget} value={text.budget.perBox(euros(profile.monthlyBudgetEur))} />
        {profile.notes.trim() && <SummaryRow label={labels.notes} value={profile.notes.trim()} />}
      </GroupedSection>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <ListRow label={label}>
      <span className="text-right text-label-secondary">{value}</span>
    </ListRow>
  );
}
