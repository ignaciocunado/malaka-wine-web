import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";

import { Logo } from "./logo";

const links = [
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/#planes", label: "Planes" },
  { href: "/#bodegas", label: "Bodegas" },
];

/** Translucent top bar using the HIG "material" effect (blur + saturation over content). */
export function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-separator/50 bg-material backdrop-blur-xl backdrop-saturate-180">
      <nav className="mx-auto flex h-13 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Logo />
        <ul className="hidden items-center gap-7 text-footnote text-label/80 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="transition-colors hover:text-label">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <ButtonLink href="/taste" size="sm">
          Haz el test
        </ButtonLink>
      </nav>
    </header>
  );
}
