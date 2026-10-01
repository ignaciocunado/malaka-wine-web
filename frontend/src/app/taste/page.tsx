import type { Metadata } from "next";

import { auth } from "@/auth";
import { TasteForm } from "@/components/taste/taste-form";
import { api } from "@/lib/api";
import { parseDraft } from "@/lib/taste-schema";

export const metadata: Metadata = { title: "Find your taste" };

export default async function TastePage({ searchParams }: PageProps<"/taste">) {
  const session = await auth();
  // Answers given before signing up come back in the URL; otherwise start from the saved profile, if any.
  const draft = parseDraft((await searchParams).draft);
  const saved = !draft && session ? await api.tasteProfile(session.accessToken).catch(() => null) : null;

  return (
    <div className="min-h-[calc(100dvh-3.25rem)] bg-grouped px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <header className="mb-10 text-center">
          <p className="text-headline text-tint">Taste quiz</p>
          <h1 className="mt-2 text-large-title">Find your taste.</h1>
          <p className="mx-auto mt-3 max-w-md text-body text-label-secondary">
            A few quick questions so every box feels like it was picked just for you. Because it was.
          </p>
        </header>
        <TasteForm initialProfile={draft ?? saved} resumeDraft={!!draft} signedIn={!!session} />
      </div>
    </div>
  );
}
