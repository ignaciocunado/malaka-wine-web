"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";

import { saveTasteProfile } from "@/app/taste/actions";
import { Alert } from "@/components/ui/alert";
import { Button, ButtonLink } from "@/components/ui/button";
import { ChipGroup } from "@/components/ui/chip-group";
import { cn } from "@/components/ui/cn";
import { GroupedSection, ListRow } from "@/components/ui/grouped-list";
import { CheckIcon, ChevronLeftIcon } from "@/components/ui/icons";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Slider } from "@/components/ui/slider";
import { Stepper } from "@/components/ui/stepper";
import { FALLBACK_PLANS } from "@/lib/catalog";
import { formatEuros } from "@/lib/format";
import {
  ADVENTURE_LABELS,
  BODY_LABELS,
  DEFAULT_TASTE_PROFILE,
  FREQUENCY_OPTIONS,
  SWEETNESS_OPTIONS,
  WINE_STYLE_OPTIONS,
  labelOf,
  labelsOf,
  recommendedPlan,
} from "@/lib/taste";
import type { TasteProfile } from "@/lib/types";

const STEPS = ["styles", "palate", "box", "review"] as const;
type StepId = (typeof STEPS)[number];

const STEP_TITLES: Record<StepId, { title: string; subtitle: string }> = {
  styles: { title: "¿Qué vinos te gustan?", subtitle: "Del Moscatel de la Axarquía a los tintos de altura de Ronda." },
  palate: { title: "Tu paladar", subtitle: "Así sabremos por dónde empezar." },
  box: { title: "Tu caja", subtitle: "Cuánto, cada cuánto y lo que debamos saber." },
  review: { title: "Revisa tus respuestas", subtitle: "Comprueba que todo está bien antes de guardar." },
};

const euros = (amount: number) => formatEuros(amount * 100);

type Props = {
  initialProfile: TasteProfile | null;
  /** True when the answers were carried over from before sign-up and only need saving. */
  resumeDraft: boolean;
  signedIn: boolean;
};

export function TasteForm({ initialProfile, resumeDraft, signedIn }: Props) {
  const router = useRouter();
  const [profile, setProfile] = useState<TasteProfile>({ ...DEFAULT_TASTE_PROFILE, ...initialProfile });
  const [stepId, setStepId] = useState<StepId>(resumeDraft ? "review" : "styles");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();

  const stepIndex = STEPS.indexOf(stepId);
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
    const planCode = recommendedPlan(profile);
    const planName = FALLBACK_PLANS.find((plan) => plan.code === planCode)?.name ?? planCode;
    return (
      <Card className="text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-system-green text-white">
          <CheckIcon className="size-9" strokeWidth={2.5} />
        </span>
        <h2 className="mt-6 text-title1">Tu perfil de gustos está guardado.</h2>
        <p className="mx-auto mt-2 max-w-sm text-body text-label-secondary">
          Según tus respuestas, te recomendamos el plan <strong className="text-label">{planName}</strong>. Tu
          primera caja sale el día 1.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <ButtonLink href={`/account?plan=${planCode}`} size="lg">
            Elegir {planName}
          </ButtonLink>
          <Button
            variant="plain"
            onClick={() => {
              setSaved(false);
              goTo("review");
            }}
          >
            Editar mis respuestas
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
            Paso {stepIndex + 1} de {STEPS.length}
          </span>
          {resumeDraft && stepId === "review" && <span className="text-tint">¡Ya casi está! Solo falta guardar.</span>}
        </div>
        <div
          className="mt-2 h-1 overflow-hidden rounded-full bg-fill-secondary"
          role="progressbar"
          aria-label="Progreso del test"
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-valuenow={stepIndex + 1}
        >
          <div
            className="h-full rounded-full bg-tint transition-[width] duration-500 ease-ios"
            style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <Card>
        <h2 className="text-title2">{STEP_TITLES[stepId].title}</h2>
        <p className="mt-1 text-subheadline text-label-secondary">{STEP_TITLES[stepId].subtitle}</p>

        <div className="mt-8 space-y-9">
          {stepId === "styles" && (
            <>
              <Question title="Estilos" hint="Elige todos los que quieras.">
                <ChipGroup
                  label="Estilos de vino"
                  options={WINE_STYLE_OPTIONS}
                  value={profile.wineStyles}
                  onChange={(wineStyles) => update({ wineStyles })}
                />
              </Question>
              <Question title="¿Seco o dulce?">
                <SegmentedControl
                  label="Dulzor"
                  options={SWEETNESS_OPTIONS}
                  value={profile.wineSweetness}
                  onChange={(wineSweetness) => update({ wineSweetness })}
                />
              </Question>
            </>
          )}

          {stepId === "palate" && (
            <>
              <Question title="¿Con cuánto cuerpo?" value={BODY_LABELS[profile.wineBody - 1]}>
                <Slider
                  label="Cuerpo"
                  min={1}
                  max={5}
                  value={profile.wineBody}
                  onChange={(wineBody) => update({ wineBody })}
                  minLabel="Ligero y fresco"
                  maxLabel="Intenso y con cuerpo"
                  valueText={BODY_LABELS[profile.wineBody - 1]}
                />
              </Question>
              <Question title="¿Cuánto te gusta arriesgar?" value={ADVENTURE_LABELS[profile.adventurousness - 1]}>
                <Slider
                  label="Ganas de probar cosas nuevas"
                  min={1}
                  max={5}
                  value={profile.adventurousness}
                  onChange={(adventurousness) => update({ adventurousness })}
                  minLabel="Mis favoritos de siempre"
                  maxLabel="Uvas raras como la Romé"
                  valueText={ADVENTURE_LABELS[profile.adventurousness - 1]}
                />
              </Question>
            </>
          )}

          {stepId === "box" && (
            <>
              <Question title="Botellas por caja">
                <div className="flex items-center justify-between rounded-xl bg-fill-quaternary px-4 py-3">
                  <span className="text-body">{profile.bottlesPerBox} botellas</span>
                  <Stepper
                    label="Botellas por caja"
                    value={profile.bottlesPerBox}
                    min={2}
                    max={6}
                    onChange={(bottlesPerBox) => update({ bottlesPerBox })}
                  />
                </div>
              </Question>
              <Question title="¿Cada cuánto?">
                <SegmentedControl
                  label="Frecuencia de envío"
                  options={FREQUENCY_OPTIONS}
                  value={profile.deliveryFrequency}
                  onChange={(deliveryFrequency) => update({ deliveryFrequency })}
                />
              </Question>
              <Question title="Presupuesto por caja" value={euros(profile.monthlyBudgetEur)}>
                <Slider
                  label="Presupuesto por caja"
                  min={20}
                  max={150}
                  step={5}
                  value={profile.monthlyBudgetEur}
                  onChange={(monthlyBudgetEur) => update({ monthlyBudgetEur })}
                  minLabel={euros(20)}
                  maxLabel={euros(150)}
                  valueText={`${profile.monthlyBudgetEur} euros`}
                />
              </Question>
              <Question title="¿Algo que debamos saber?" hint="Alergias, cosas que no te gustan, una bodega favorita…">
                <textarea
                  value={profile.notes ?? ""}
                  onChange={(event) => update({ notes: event.target.value })}
                  maxLength={1000}
                  rows={3}
                  aria-label="Notas"
                  placeholder="p. ej., nada de blancos con madera."
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
            <Button variant="gray" onClick={() => goTo(STEPS[stepIndex - 1])}>
              <ChevronLeftIcon className="-ml-1 size-4" /> Atrás
            </Button>
          ) : (
            <span />
          )}
          {stepId === "review" ? (
            <Button onClick={save} disabled={saving}>
              {saving ? "Guardando…" : signedIn ? "Guardar mi perfil" : "Crear cuenta y guardar"}
            </Button>
          ) : (
            <Button onClick={() => goTo(STEPS[stepIndex + 1])}>Continuar</Button>
          )}
        </div>
      </Card>

      {!signedIn && (
        <p className="mt-6 text-center text-footnote text-label-secondary">
          No necesitas cuenta para hacer el test. Te la pediremos al guardar.
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
  const header = (title: string, step: StepId) => (
    <span className="flex items-center justify-between">
      {title}
      <button type="button" onClick={() => onEdit(step)} className="text-subheadline font-normal normal-case text-tint">
        Editar
      </button>
    </span>
  );

  return (
    <div className="space-y-7">
      <GroupedSection header={header("Estilos", "styles")} className="[&>div]:bg-fill-quaternary">
        <SummaryRow label="Vinos" value={labelsOf(WINE_STYLE_OPTIONS, profile.wineStyles)} />
        <SummaryRow label="Dulzor" value={labelOf(SWEETNESS_OPTIONS, profile.wineSweetness)} />
      </GroupedSection>
      <GroupedSection header={header("Paladar", "palate")} className="[&>div]:bg-fill-quaternary">
        <SummaryRow label="Cuerpo" value={BODY_LABELS[profile.wineBody - 1]} />
        <SummaryRow label="Novedades" value={ADVENTURE_LABELS[profile.adventurousness - 1]} />
      </GroupedSection>
      <GroupedSection header={header("Caja", "box")} className="[&>div]:bg-fill-quaternary">
        <SummaryRow label="Botellas" value={String(profile.bottlesPerBox)} />
        <SummaryRow label="Envío" value={labelOf(FREQUENCY_OPTIONS, profile.deliveryFrequency)} />
        <SummaryRow label="Presupuesto" value={`${euros(profile.monthlyBudgetEur)} por caja`} />
        {profile.notes?.trim() && <SummaryRow label="Notas" value={profile.notes.trim()} />}
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
