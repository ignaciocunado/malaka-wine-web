import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-system-secondary text-caption text-label-secondary">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="border-b border-separator pb-4 leading-relaxed">
          Malaka solo vende bebidas alcohólicas a mayores de 18 años. Bebe con moderación. Las bodegas, los precios
          y las cajas que aparecen en esta web son contenido de ejemplo.
        </p>
        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Malaka Wine. Hecho en Málaga.</p>
          <ul className="flex gap-5">
            <li>
              <Link href="/#planes" className="transition-colors hover:text-label">
                Planes
              </Link>
            </li>
            <li>
              <Link href="/taste" className="transition-colors hover:text-label">
                Test de gustos
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
