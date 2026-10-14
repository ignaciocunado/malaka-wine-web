import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
      <p className="text-headline text-tint">Error 404</p>
      <h1 className="mt-2 text-large-title">No encontramos esta página.</h1>
      <p className="mt-3 text-body text-label-secondary">Puede que el enlace esté mal o que la página ya no exista.</p>
      <ButtonLink href="/" className="mt-8">
        Volver al inicio
      </ButtonLink>
    </div>
  );
}
