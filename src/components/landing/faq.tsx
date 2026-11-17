import { ChevronRightIcon } from "@/components/ui/icons";
import type { FaqQuestion } from "@/lib/content/faq";

/** Sets `**phrase**` in bold. */
function Inline({ text }: { text: string }) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 ? (
      <strong key={i} className="font-semibold text-label">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

/** Questions and answers as collapsible rows. The answers stay in the HTML while collapsed, so crawlers read them. */
export function Faq({ questions }: { questions: FaqQuestion[] }) {
  return (
    <div className="border-b border-separator">
      {questions.map(({ q, a }) => (
        <details key={q} className="disclosure group border-t border-separator">
          <summary className="flex min-h-15 cursor-pointer list-none items-center justify-between gap-4 py-4 text-headline transition-colors duration-300 ease-spring select-none hover:text-accent active:opacity-75 active:duration-0 [&::-webkit-details-marker]:hidden">
            <h3>{q}</h3>
            <ChevronRightIcon className="size-4 shrink-0 text-label-tertiary transition-transform duration-500 ease-spring group-open:rotate-90" />
          </summary>
          <div className="space-y-4 pr-8 pb-6 text-body text-label-secondary">
            {a.map((block, i) =>
              typeof block === "string" ? (
                <p key={i}>
                  <Inline text={block} />
                </p>
              ) : (
                <ul key={i} className="list-disc space-y-3 pl-5 marker:text-label-tertiary">
                  {block.list.map((item) => (
                    <li key={item}>
                      <Inline text={item} />
                    </li>
                  ))}
                </ul>
              ),
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
