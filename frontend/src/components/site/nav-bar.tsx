import Link from "next/link";

import { auth } from "@/auth";
import { ButtonLink } from "@/components/ui/button";
import { PersonIcon } from "@/components/ui/icons";

import { Logo } from "./logo";

const links = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#plans", label: "Plans" },
  { href: "/#producers", label: "Producers" },
  { href: "/taste", label: "Taste quiz" },
];

/** Translucent top bar using the HIG "material" effect (blur + saturation over content). */
export async function NavBar() {
  const session = await auth();
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
        <div className="flex items-center gap-2">
          {session ? (
            <ButtonLink href="/account" variant="gray" size="sm">
              <PersonIcon className="size-4" />
              {session.user.name ?? "Account"}
            </ButtonLink>
          ) : (
            <>
              <Link href="/login" className="px-2 text-footnote text-label/80 hover:text-label">
                Sign in
              </Link>
              <ButtonLink href="/signup" size="sm">
                Join
              </ButtonLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
