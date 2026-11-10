import { ChevronRightIcon } from "@/components/ui/icons";

/** Questions and answers as collapsible rows. The answers stay in the HTML while collapsed, so crawlers read them. */
export function Faq({ questions }: { questions: { q: string; a: string }[] }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-elevated">
      {questions.map(({ q, a }) => (
        <details
          key={q}
          className="disclosure group relative before:absolute before:top-0 before:right-0 before:left-5 before:h-px before:bg-separator before:content-[''] first:before:hidden"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-headline transition-colors duration-300 ease-spring select-none active:bg-fill-quaternary active:duration-0 [&::-webkit-details-marker]:hidden">
            <h3>{q}</h3>
            <ChevronRightIcon className="size-4 shrink-0 text-label-tertiary transition-transform duration-500 ease-spring group-open:rotate-90" />
          </summary>
          <p className="px-5 pb-5 text-body text-label-secondary">{a}</p>
        </details>
      ))}
    </div>
  );
}
