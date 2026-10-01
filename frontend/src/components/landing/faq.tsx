import { ChevronRightIcon } from "@/components/ui/icons";

const QUESTIONS = [
  {
    q: "Who are the producers?",
    a: "Family wineries and olive mills across the province of Málaga — the Axarquía, Montes de Málaga, Serranía de Ronda and Antequera — making small batches you rarely find outside their village.",
  },
  {
    q: "How do you choose what goes in my box?",
    a: "Your taste profile sets the styles, intensity and budget. Each month we match it against what our producers have just released, and include tasting cards so you know what you're opening.",
  },
  {
    q: "When does my box arrive?",
    a: "Boxes ship in the first week of each month (or every other month, if you prefer) to addresses in mainland Spain.",
  },
  {
    q: "Can I pause or cancel?",
    a: "Yes. Change your plan or cancel at any time from your account, with no commitment.",
  },
  {
    q: "Is there an age requirement?",
    a: "Yes. Wine is only sold to adults aged 18 and over, and an adult must sign for delivery.",
  },
];

export function Faq() {
  return (
    <div className="overflow-hidden rounded-2xl bg-elevated">
      {QUESTIONS.map(({ q, a }) => (
        <details
          key={q}
          className="group relative before:absolute before:top-0 before:right-0 before:left-5 before:h-px before:bg-separator before:content-[''] first:before:hidden"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-headline [&::-webkit-details-marker]:hidden">
            {q}
            <ChevronRightIcon className="size-4 shrink-0 text-label-tertiary transition-transform duration-200 group-open:rotate-90" />
          </summary>
          <p className="px-5 pb-5 text-body text-label-secondary">{a}</p>
        </details>
      ))}
    </div>
  );
}
