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
import { HERO_STAGE_ID, PLANS, PRODUCERS, REGIONS, regionStageId } from "@/lib/catalog";

const FEATURES = [
  {
    icon: HandshakeIcon,
    title: "Solo pequeñas bodegas",
    body: "Bodegas familiares que elaboran unos pocos miles de botellas al año. La mayoría nunca llega a un supermercado.",
  },
  {
    icon: SparklesIcon,
    title: "Elegido para ti",
    body: "Cuéntanos qué te gusta y elegiremos cada caja según tu perfil: estilos, cuerpo y presupuesto.",
  },
  {
    icon: CalendarIcon,
    title: "Cada mes en tu puerta",
    body: "Tu caja sale la primera semana de cada mes. Cambia de plan o cancela cuando quieras.",
  },
];

const STEPS = [
  { title: "Haz el test de gustos", body: "Dos minutos sobre estilos, cuerpo y presupuesto." },
  { title: "Elegimos tus vinos", body: "Botellas seleccionadas entre las novedades del mes de toda la provincia." },
  { title: "Abre un trocito de Málaga", body: "Con fichas de cata, maridajes y la historia de cada bodega." },
];

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

export default function Home() {
  return (
    <div className="tablecloth relative isolate overflow-x-clip">
      <Tablecloth />

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 pt-16 pb-8 sm:px-6 md:min-h-[42rem] md:grid-cols-2 md:pt-24 md:pb-16">
        <div className="text-center md:text-left">
          <p className="text-headline text-tint">Suscripción de vino</p>
          <h1 className="mt-3 text-hero">Málaga, cada mes en tu copa.</h1>
          <p className="mx-auto mt-5 max-w-md text-title3 font-normal text-label-secondary md:mx-0">
            Una caja con los vinos de las mejores pequeñas bodegas de la provincia, elegidos según tus gustos.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 md:justify-start">
            <ButtonLink href="/taste" size="lg">
              Descubre tu gusto
            </ButtonLink>
            <ButtonLink href="#planes" variant="plain">
              Ver planes <ChevronRightIcon className="size-4" />
            </ButtonLink>
          </div>
        </div>
        <BottleStage id={HERO_STAGE_ID} side="right" label="Tres botellas de vino de Málaga sobre el mantel" />
      </section>

      {/* Why */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="max-w-2xl text-large-title">
          El sabor de la tierra. <span className="text-label-secondary">Directo de quienes lo elaboran.</span>
        </h2>
        <div className="mt-12 grid gap-7 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className={PAPER}>
              <Icon className="size-8 text-tint" />
              <h3 className="mt-5 text-title3">{title}</h3>
              <p className="mt-2 text-body text-label-secondary">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="scroll-mt-14">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <p className="text-headline text-tint">Cómo funciona</p>
          <h2 className="mt-2 text-large-title">Tres pasos hasta tu primera caja.</h2>
          <ol className="mt-12 grid gap-7 md:grid-cols-3">
            {STEPS.map((step, index) => (
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
            <ButtonLink href="/taste" variant="plain">
              Haz el test de gustos <ChevronRightIcon className="size-4" />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Regions */}
      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
        <p className="text-headline text-tint">Del viñedo a tu mesa</p>
        <h2 className="mt-2 max-w-3xl text-hero">Cuatro rincones de una provincia.</h2>
        {REGIONS.map((region, index) => {
          const side = index % 2 === 0 ? "right" : "left";
          return (
            <div key={region.name} className="grid items-center gap-x-12 gap-y-4 py-14 md:min-h-[44rem] md:grid-cols-2 md:py-20">
              <div className={cn(side === "left" && "md:order-2")}>
                <p className="text-footnote font-semibold tracking-widest text-label-secondary">
                  0{index + 1} / 0{REGIONS.length}
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
              </div>
              <BottleStage
                id={regionStageId(index)}
                side={side}
                label={`Botellas de ${region.name}: ${region.wines.map((wine) => wine.name).join(", ")}`}
              />
            </div>
          );
        })}
      </section>

      {/* Plans */}
      <section id="planes" className="scroll-mt-14">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="text-center">
            <p className="text-headline text-tint">Planes</p>
            <h2 className="mt-2 text-large-title">Elige tu caja.</h2>
            <p className="mx-auto mt-3 max-w-xl text-body text-label-secondary">
              Envío gratis a la península. Cambia de plan o cancela cuando quieras.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {PLANS.map((plan) => (
              <PlanCard key={plan.code} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      {/* Producers */}
      <section id="bodegas" className="mx-auto max-w-6xl scroll-mt-14 px-4 py-20 sm:px-6">
        <p className="text-headline text-tint">Quiénes lo hacen</p>
        <h2 className="mt-2 text-large-title">Las bodegas de esta temporada.</h2>
        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCERS.map((producer) => (
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

      {/* FAQ */}
      <section>
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <h2 className="text-center text-large-title">¿Preguntas? Respuestas.</h2>
          <div className="mt-10">
            <Faq />
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
        <BoxIcon className="mx-auto size-12 text-tint" />
        <h2 className="mt-5 text-large-title">Tu primera caja sale el día 1.</h2>
        <p className="mx-auto mt-3 max-w-lg text-body text-label-secondary">
          Dos minutos de preguntas ahora y un trocito de Málaga en tu mesa cada mes.
        </p>
        <ButtonLink href="/taste" size="lg" className="mt-8">
          Descubre tu gusto
        </ButtonLink>
      </section>
    </div>
  );
}
