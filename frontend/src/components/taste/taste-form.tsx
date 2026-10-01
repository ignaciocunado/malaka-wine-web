"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";

import { saveTasteProfile } from "@/app/taste/actions";
import { Alert } from "@/components/ui/alert";
import { Button, ButtonLink } from "@/components/ui/button";
import { ChipGroup } from "@/components/ui/chip-group";
import { cn } from "@/components/ui/cn";
import { GroupedSection, ListRow } from "@/components/ui/grouped-list";
import { BoxIcon, CheckIcon, ChevronLeftIcon, DropIcon, WineGlassIcon } from "@/components/ui/icons";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Slider } from "@/components/ui/slider";
import { Stepper } from "@/components/ui/stepper";
import { FALLBACK_PLANS } from "@/lib/catalog";
import {
  ADVENTURE_LABELS,
  BODY_LABELS,
  DEFAULT_TASTE_PROFILE,
  FREQUENCY_OPTIONS,
  OIL_INTENSITY_OPTIONS,
  OIL_USE_OPTIONS,
  OLIVE_VARIETY_OPTIONS,
  PRODUCT_OPTIONS,
  RECOMMENDED_PLAN,
  SWEETNESS_OPTIONS,
  WINE_STYLE_OPTIONS,
  labelOf,
  labelsOf,
  wantsOil,
  wantsWine,
} from "@/lib/taste";
import type { ProductType, TasteProfile } from "@/lib/types";

type StepId = "product" | "wine" | "oil" | "box" | "review";

const STEP_TITLES: Record<StepId, { title: string; subtitle: string }> = {
  product: { title: "What should we send you?", subtitle: "You can change this at any time." },
  wine: { title: "Your wine", subtitle: "From Axarquía Moscatel to high-altitude reds from Ronda." },
  oil: { title: "Your olive oil", subtitle: "Every bottle is extra virgin, pressed this season." },
  box: { title: "Your box", subtitle: "How much, how often, and anything we should know." },
  review: { title: "Review your answers", subtitle: "Check everything looks right before saving." },
};

const PRODUCT_ICONS: Record<ProductType, typeof WineGlassIcon> = {
  WINE: WineGlassIcon,
  OLIVE_OIL: DropIcon,
  BOTH: BoxIcon,
};

function stepsFor(profile: TasteProfile): StepId[] {
  return ["product", ...(wantsWine(profile) ? ["wine" as const] : []), ...(wantsOil(profile) ? ["oil" as const] : []), "box", "review"];
}

type Props = {
  initialProfile: TasteProfile | null;
  /** True when the answers were carried over from before sign-up and only need saving. */
  resumeDraft: boolean;
  signedIn: boolean;
};

export function TasteForm({ initialProfile, resumeDraft, signedIn }: Props) {
  const router = useRouter();
  const [profile, setProfile] = useState<TasteProfile>({ ...DEFAULT_TASTE_PROFILE, ...initialProfile });
  const steps = stepsFor(profile);
  const [stepId, setStepId] = useState<StepId>(resumeDraft ? "review" : "product");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();

  const stepIndex = steps.indexOf(stepId);
  const update = (patch: Partial<TasteProfile>) => setProfile((current) => ({ ...current, ...patch }));
  const goTo = (id: StepId) => {
    setStepId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = () =>
    startSaving(async () => {
      setError(null);
      const answers = { ...profile, notes: profile.notes?.trim() || null };
      const result = await saveTasteProfile(answers);
      if (result.status === "saved") {
        setSaved(true);
        if (resumeDraft) router.replace("/taste");
      } else if (result.status === "unauthenticated") {
        // Keep the answers in the post-auth redirect so nothing has to be filled in twice.
        // (signedIn but unauthenticated means the session expired, so sign in rather than sign up.)
        const resumeUrl = `/taste?draft=${encodeURIComponent(JSON.stringify(answers))}`;
        router.push(`${signedIn ? "/login" : "/signup"}?callbackUrl=${encodeURIComponent(resumeUrl)}`);
      } else {
        setError(result.message);
      }
    });

  if (saved) {
    const planCode = RECOMMENDED_PLAN[profile.productPreference];
    const planName = FALLBACK_PLANS.find((plan) => plan.code === planCode)?.name ?? "a plan";
    return (
      <Card className="text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-system-green text-white">
          <CheckIcon className="size-9" strokeWidth={2.5} />
        </span>
        <h2 className="mt-6 text-title1">Your taste profile is saved.</h2>
        <p className="mx-auto mt-2 max-w-sm text-body text-label-secondary">
          Based on your answers we recommend <strong className="text-label">{planName}</strong>.
          Your first box ships on the 1st.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <ButtonLink href={`/account?plan=${planCode}`} size="lg">
            Choose {planName}
          </ButtonLink>
          <Button variant="plain" onClick={() => { setSaved(false); goTo("review"); }}>
            Edit my answers
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-5 px-1">
        <div className="flex items-center justify-between text-footnote text-label-secondary">
          <span>
            Step {stepIndex + 1} of {steps.length}
          </span>
          {resumeDraft && stepId === "review" && <span className="text-tint">Welcome! One tap to save.</span>}
        </div>
        <div
          className="mt-2 h-1 overflow-hidden rounded-full bg-fill-secondary"
          role="progressbar"
          aria-label="Quiz progress"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={stepIndex + 1}
        >
          <div
            className="h-full rounded-full bg-tint transition-[width] duration-500 ease-ios"
            style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <Card>
        <h2 className="text-title2">{STEP_TITLES[stepId].title}</h2>
        <p className="mt-1 text-subheadline text-label-secondary">{STEP_TITLES[stepId].subtitle}</p>

        <div className="mt-8 space-y-9">
          {stepId === "product" && (
            <fieldset className="grid gap-3 sm:grid-cols-3">
              <legend className="sr-only">What should we send you?</legend>
              {PRODUCT_OPTIONS.map((option) => {
                const Icon = PRODUCT_ICONS[option.value];
                const selected = profile.productPreference === option.value;
                return (
                  <label
                    key={option.value}
                    className={cn(
                      "relative flex cursor-pointer flex-col rounded-2xl p-5 transition-all duration-200 ease-ios",
                      "has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-system-blue/60",
                      selected ? "bg-tint/10 ring-2 ring-tint" : "bg-fill-quaternary ring-1 ring-separator/40 hover:bg-fill-tertiary",
                    )}
                  >
                    <input
                      type="radio"
                      name="productPreference"
                      className="sr-only"
                      checked={selected}
                      onChange={() => update({ productPreference: option.value })}
                    />
                    <Icon className={cn("size-8", option.value === "OLIVE_OIL" ? "text-olive" : "text-tint")} />
                    <span className="mt-4 text-headline">{option.label}</span>
                    <span className="mt-1 text-footnote text-label-secondary">{option.hint}</span>
                    {selected && (
                      <CheckIcon className="absolute top-4 right-4 size-5 text-tint" strokeWidth={2.5} />
                    )}
                  </label>
                );
              })}
            </fieldset>
          )}

          {stepId === "wine" && (
            <>
              <Question title="Which styles do you enjoy?" hint="Pick as many as you like.">
                <ChipGroup
                  label="Wine styles"
                  options={WINE_STYLE_OPTIONS}
                  value={profile.wineStyles}
                  onChange={(wineStyles) => update({ wineStyles })}
                />
              </Question>
              <Question title="How full-bodied?" value={BODY_LABELS[profile.wineBody - 1]}>
                <Slider
                  label="Body"
                  min={1}
                  max={5}
                  value={profile.wineBody}
                  onChange={(wineBody) => update({ wineBody })}
                  minLabel="Light & fresh"
                  maxLabel="Rich & full"
                  valueText={BODY_LABELS[profile.wineBody - 1]}
                />
              </Question>
              <Question title="Dry or sweet?">
                <SegmentedControl
                  label="Sweetness"
                  options={SWEETNESS_OPTIONS}
                  value={profile.wineSweetness}
                  onChange={(wineSweetness) => update({ wineSweetness })}
                />
              </Question>
              <Question title="How adventurous are you?" value={ADVENTURE_LABELS[profile.adventurousness - 1]}>
                <Slider
                  label="Adventurousness"
                  min={1}
                  max={5}
                  value={profile.adventurousness}
                  onChange={(adventurousness) => update({ adventurousness })}
                  minLabel="Familiar favourites"
                  maxLabel="Rare grapes like Romé"
                  valueText={ADVENTURE_LABELS[profile.adventurousness - 1]}
                />
              </Question>
            </>
          )}

          {stepId === "oil" && (
            <>
              <Question title="How intense?">
                <SegmentedControl
                  label="Intensity"
                  options={OIL_INTENSITY_OPTIONS}
                  value={profile.oilIntensity}
                  onChange={(oilIntensity) => update({ oilIntensity })}
                />
                <p className="mt-3 text-footnote text-label-secondary">
                  {OIL_INTENSITY_OPTIONS.find((o) => o.value === profile.oilIntensity)?.hint}
                </p>
              </Question>
              <Question title="Favourite olive varieties" hint="Not sure? Leave them all off and we'll rotate.">
                <ChipGroup
                  label="Olive varieties"
                  options={OLIVE_VARIETY_OPTIONS}
                  value={profile.oliveVarieties}
                  onChange={(oliveVarieties) => update({ oliveVarieties })}
                />
                <ul className="mt-4 grid gap-1 text-footnote text-label-secondary sm:grid-cols-2">
                  {OLIVE_VARIETY_OPTIONS.map((o) => (
                    <li key={o.value}>
                      <span className="font-medium text-label">{o.label}</span> · {o.hint}
                    </li>
                  ))}
                </ul>
              </Question>
              <Question title="How do you use it?">
                <ChipGroup
                  label="Uses"
                  options={OIL_USE_OPTIONS}
                  value={profile.oilUses}
                  onChange={(oilUses) => update({ oilUses })}
                />
              </Question>
            </>
          )}

          {stepId === "box" && (
            <>
              <Question title="Bottles per box">
                <div className="flex items-center justify-between rounded-xl bg-fill-quaternary px-4 py-3">
                  <span className="text-body">
                    {profile.bottlesPerBox} bottles
                  </span>
                  <Stepper
                    label="Bottles per box"
                    value={profile.bottlesPerBox}
                    min={2}
                    max={6}
                    onChange={(bottlesPerBox) => update({ bottlesPerBox })}
                  />
                </div>
              </Question>
              <Question title="How often?">
                <SegmentedControl
                  label="Delivery frequency"
                  options={FREQUENCY_OPTIONS}
                  value={profile.deliveryFrequency}
                  onChange={(deliveryFrequency) => update({ deliveryFrequency })}
                />
              </Question>
              <Question title="Budget per box" value={`€${profile.monthlyBudgetEur}`}>
                <Slider
                  label="Budget per box"
                  min={20}
                  max={150}
                  step={5}
                  value={profile.monthlyBudgetEur}
                  onChange={(monthlyBudgetEur) => update({ monthlyBudgetEur })}
                  minLabel="€20"
                  maxLabel="€150"
                  valueText={`${profile.monthlyBudgetEur} euros`}
                />
              </Question>
              <Question title="Anything we should know?" hint="Allergies, dislikes, a producer you love…">
                <textarea
                  value={profile.notes ?? ""}
                  onChange={(event) => update({ notes: event.target.value })}
                  maxLength={1000}
                  rows={3}
                  aria-label="Notes"
                  placeholder="e.g. No oaky whites, please."
                  className="block w-full resize-none rounded-xl bg-fill-quaternary px-4 py-3 text-body outline-none placeholder:text-label-tertiary focus:ring-2 focus:ring-tint/40"
                />
              </Question>
            </>
          )}

          {stepId === "review" && <Review profile={profile} onEdit={goTo} />}
        </div>

        {error && (
          <div className="mt-8">
            <Alert>{error}</Alert>
          </div>
        )}

        <div className="mt-10 flex items-center justify-between gap-3">
          {stepIndex > 0 ? (
            <Button variant="gray" onClick={() => goTo(steps[stepIndex - 1])}>
              <ChevronLeftIcon className="-ml-1 size-4" /> Back
            </Button>
          ) : (
            <span />
          )}
          {stepId === "review" ? (
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving…" : signedIn ? "Save my taste profile" : "Create account & save"}
            </Button>
          ) : (
            <Button onClick={() => goTo(steps[stepIndex + 1])}>Continue</Button>
          )}
        </div>
      </Card>

      {!signedIn && (
        <p className="mt-6 text-center text-footnote text-label-secondary">
          No account needed to explore. We&apos;ll ask you to sign up when you save.
        </p>
      )}
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

function Review({ profile, onEdit }: { profile: TasteProfile; onEdit: (step: StepId) => void }) {
  const edit = (step: StepId) => (
    <button type="button" onClick={() => onEdit(step)} className="text-subheadline font-normal normal-case text-tint">
      Edit
    </button>
  );
  const header = (title: string, step: StepId) => (
    <span className="flex items-center justify-between">
      {title} {edit(step)}
    </span>
  );

  return (
    <div className="space-y-7">
      <GroupedSection header={header("Box contents", "product")} className="[&>div]:bg-fill-quaternary">
        <SummaryRow label="I'd like" value={labelOf(PRODUCT_OPTIONS, profile.productPreference)} />
      </GroupedSection>
      {wantsWine(profile) && (
        <GroupedSection header={header("Wine", "wine")} className="[&>div]:bg-fill-quaternary">
          <SummaryRow label="Styles" value={labelsOf(WINE_STYLE_OPTIONS, profile.wineStyles)} />
          <SummaryRow label="Body" value={BODY_LABELS[profile.wineBody - 1]} />
          <SummaryRow label="Sweetness" value={labelOf(SWEETNESS_OPTIONS, profile.wineSweetness)} />
          <SummaryRow label="Adventure" value={ADVENTURE_LABELS[profile.adventurousness - 1]} />
        </GroupedSection>
      )}
      {wantsOil(profile) && (
        <GroupedSection header={header("Olive oil", "oil")} className="[&>div]:bg-fill-quaternary">
          <SummaryRow label="Intensity" value={labelOf(OIL_INTENSITY_OPTIONS, profile.oilIntensity)} />
          <SummaryRow label="Varieties" value={labelsOf(OLIVE_VARIETY_OPTIONS, profile.oliveVarieties)} />
          <SummaryRow label="Uses" value={labelsOf(OIL_USE_OPTIONS, profile.oilUses)} />
        </GroupedSection>
      )}
      <GroupedSection header={header("Box", "box")} className="[&>div]:bg-fill-quaternary">
        <SummaryRow label="Bottles" value={String(profile.bottlesPerBox)} />
        <SummaryRow label="Delivery" value={labelOf(FREQUENCY_OPTIONS, profile.deliveryFrequency)} />
        <SummaryRow label="Budget" value={`€${profile.monthlyBudgetEur} per box`} />
        {profile.notes?.trim() && <SummaryRow label="Notes" value={profile.notes.trim()} />}
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
