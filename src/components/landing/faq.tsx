import { ChevronRightIcon } from "@/components/ui/icons";

/** Questions and answers as collapsible rows. The answers stay in the HTML while collapsed, so crawlers read them. */
export function Faq({ questions }: { questions: { q: string; a: string }[] }) {
  return (
    <div className="border-b border-separator">
      {questions.map(({ q, a }) => (
        <details key={q} className="disclosure group border-t border-separator">
          <summary className="flex min-h-15 cursor-pointer list-none items-center justify-between gap-4 py-4 text-headline transition-colors duration-300 ease-spring select-none hover:text-accent active:opacity-75 active:duration-0 [&::-webkit-details-marker]:hidden">
            <h3>{q}</h3>
            <ChevronRightIcon className="size-4 shrink-0 text-label-tertiary transition-transform duration-500 ease-spring group-open:rotate-90" />
          </summary>
          <p className="pr-8 pb-6 text-body text-label-secondary">{a}</p>
        </details>
      ))}
    </div>
  );
}
