import { ChevronRightIcon } from "@/components/ui/icons";

const QUESTIONS = [
  {
    q: "¿Quiénes son las bodegas?",
    a: "Bodegas familiares de toda la provincia de Málaga (Axarquía, Montes de Málaga, Serranía de Ronda, Costa Occidental y Norte) que elaboran pequeñas partidas difíciles de encontrar fuera de su pueblo.",
  },
  {
    q: "¿Cómo elegís los vinos de mi caja?",
    a: "Tu perfil de gustos marca los estilos, el cuerpo y el presupuesto. Cada mes lo cruzamos con las novedades de nuestras bodegas e incluimos fichas de cata para que sepas qué estás abriendo.",
  },
  {
    q: "¿Cuándo llega mi caja?",
    a: "Las cajas salen la primera semana de cada mes (o cada dos meses, si lo prefieres) a cualquier dirección de la España peninsular.",
  },
  {
    q: "¿Puedo cambiar de plan o cancelar?",
    a: "Sí. Cambia de plan o cancela cuando quieras desde tu cuenta, sin permanencia.",
  },
  {
    q: "¿Hay una edad mínima?",
    a: "Sí. Solo vendemos vino a mayores de 18 años, y la entrega debe recogerla un adulto.",
  },
];

export function Faq() {
  return (
    <div className="overflow-hidden rounded-2xl bg-elevated">
      {QUESTIONS.map(({ q, a }) => (
        <details
          key={q}
          className="disclosure group relative before:absolute before:top-0 before:right-0 before:left-5 before:h-px before:bg-separator before:content-[''] first:before:hidden"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-headline transition-colors duration-300 ease-spring select-none active:bg-fill-quaternary active:duration-0 [&::-webkit-details-marker]:hidden">
            {q}
            <ChevronRightIcon className="size-4 shrink-0 text-label-tertiary transition-transform duration-500 ease-spring group-open:rotate-90" />
          </summary>
          <p className="px-5 pb-5 text-body text-label-secondary">{a}</p>
        </details>
      ))}
    </div>
  );
}
