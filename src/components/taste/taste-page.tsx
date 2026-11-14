import { getDictionary } from "@/lib/content";
import type { Lang } from "@/lib/site";

import { TasteForm } from "./taste-form";

export function TastePage({ lang }: { lang: Lang }) {
  const { taste } = getDictionary(lang);
  return (
    <div className="min-h-[calc(100dvh-3.25rem)] bg-grouped px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <header className="mb-10 text-center">
          <p className="text-headline text-accent">{taste.eyebrow}</p>
          <h1 className="mt-2 text-large-title">{taste.title}</h1>
          <p className="mx-auto mt-3 max-w-md text-body text-label-secondary">{taste.body}</p>
        </header>
        <TasteForm lang={lang} />
      </div>
    </div>
  );
}
