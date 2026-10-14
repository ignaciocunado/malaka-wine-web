import type { Metadata } from "next";

import { TasteForm } from "@/components/taste/taste-form";

export const metadata: Metadata = { title: "Descubre tu gusto" };

export default function TastePage() {
  return (
    <div className="min-h-[calc(100dvh-3.25rem)] bg-grouped px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <header className="mb-10 text-center">
          <p className="text-headline text-tint">Test de gustos</p>
          <h1 className="mt-2 text-large-title">Descubre tu gusto.</h1>
          <p className="mx-auto mt-3 max-w-md text-body text-label-secondary">
            Unas preguntas rápidas para que cada caja parezca elegida solo para ti. Porque lo está.
          </p>
        </header>
        <TasteForm />
      </div>
    </div>
  );
}
