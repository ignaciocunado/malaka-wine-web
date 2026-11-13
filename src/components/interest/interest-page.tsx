import { getDictionary } from "@/lib/content";
import type { Lang } from "@/lib/site";

import { InterestForm } from "./interest-form";

/** "Register your interest": stands in for the taste quiz until subscriptions open. */
export function InterestPage({ lang }: { lang: Lang }) {
  const { interest } = getDictionary(lang);
  return (
    <div className="min-h-[calc(100dvh-3.25rem)] bg-grouped px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-xl">
        <header className="mb-10 text-center">
          <p className="text-headline text-tint">{interest.eyebrow}</p>
          <h1 className="mt-2 text-large-title">{interest.title}</h1>
          <p className="mx-auto mt-3 max-w-md text-body text-label-secondary">{interest.body}</p>
        </header>
        <InterestForm lang={lang} />
      </div>
    </div>
  );
}
