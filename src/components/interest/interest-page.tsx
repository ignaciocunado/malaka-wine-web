import { ScenePoster } from "@/components/scene/poster";
import { getDictionary } from "@/lib/content";
import type { Lang } from "@/lib/site";

import { InterestForm } from "./interest-form";

/** "Register your interest": stands in for the taste quiz until subscriptions open. */
export function InterestPage({ lang }: { lang: Lang }) {
  const { interest } = getDictionary(lang);
  return (
    // The vineyard above the bay, as on the homepage, shaded so the form reads on top of it.
    <div className="relative isolate -mt-13 min-h-dvh overflow-hidden px-4 pt-28 pb-16 sm:px-6 sm:pt-36">
      <ScenePoster name="vineyard" eager className="absolute inset-0 -z-10 size-full object-cover" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-system/80 lg:bg-transparent lg:bg-linear-to-r lg:from-system/95 lg:via-system/80 lg:via-45% lg:to-system/10" />
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <header className="mb-10">
            <p className="text-headline text-accent">{interest.eyebrow}</p>
            <h1 className="mt-2 text-large-title sm:text-hero">{interest.title}</h1>
            <p className="mt-4 max-w-md text-title3 font-normal text-label-secondary">{interest.body}</p>
          </header>
          <InterestForm lang={lang} />
        </div>
      </div>
    </div>
  );
}
