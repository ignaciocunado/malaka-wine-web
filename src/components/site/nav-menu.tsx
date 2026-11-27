"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ButtonLink } from "@/components/ui/button";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import type { Lang } from "@/lib/site";

import { LanguageSwitch } from "./language-switch";

export type NavLink = { href: string; label: string };

/** The navigation's links, with the page being viewed marked as current. */
export function NavLinks({ links, className, linkClassName }: { links: NavLink[]; className?: string; linkClassName?: string }) {
  const pathname = usePathname();
  return (
    <ul className={className}>
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} aria-current={link.href === pathname ? "page" : undefined} className={linkClassName}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

const PANEL_ID = "site-menu";

const hide = (panel: HTMLElement | null) => {
  if (panel?.matches(":popover-open")) panel.hidePopover();
};

/**
 * The phone menu: a button in the bar and a panel that unrolls under it with the links, the other language and,
 * on the narrowest phones, the sign-up button. The panel is a native popover, so Escape, a tap outside and focus
 * going back to the button work without script; the script only closes it after a link is chosen or once the
 * window is wide enough for the full bar.
 */
export function NavMenu({
  lang,
  links,
  text,
}: {
  lang: Lang;
  links: NavLink[];
  text: { menu: string; otherLanguage: string; register: string; registerHref: string };
}) {
  const panel = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 48rem)");
    const onChange = () => wide.matches && hide(panel.current);
    wide.addEventListener("change", onChange);
    return () => wide.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="md:hidden">
      {/* A 44px target; the negative margin keeps the bar's layout to the icon's width. */}
      <button
        type="button"
        popoverTarget={PANEL_ID}
        aria-controls={PANEL_ID}
        aria-expanded={open}
        className="-mx-2.5 flex size-11 items-center justify-center rounded-full text-label transition-colors hover:text-accent"
      >
        {open ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
        <span className="sr-only">{text.menu}</span>
      </button>
      <div
        ref={panel}
        id={PANEL_ID}
        popover="auto"
        onToggle={(event) => setOpen(event.newState === "open")}
        onClick={(event) => (event.target as HTMLElement).closest("a") && hide(panel.current)}
        className="nav-panel"
      >
        {/* pt-2 leaves room for the first link's focus ring, which the panel would otherwise clip. */}
        <div className="mx-auto max-w-6xl px-4 pt-2 pb-6 sm:px-6">
          <NavLinks
            links={links}
            className="divide-y divide-separator border-b border-separator"
            linkClassName="flex min-h-11 items-center py-2 text-body text-label transition-colors hover:text-accent aria-[current=page]:text-accent"
          />
          <LanguageSwitch
            lang={lang}
            label={text.otherLanguage}
            className="flex min-h-11 items-center py-2 text-body text-label-secondary transition-colors hover:text-label"
          />
          <ButtonLink href={text.registerHref} className="mt-4 w-full min-[360px]:hidden">
            {text.register}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
