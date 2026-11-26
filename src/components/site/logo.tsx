import Image from "next/image";
import Link from "next/link";

import { getDictionary } from "@/lib/content";
import { pagePath, type Lang } from "@/lib/site";

/**
 * The one-line Malaka Wine logo from the design system (`malaka-compact-on-dark.svg`), linking home. The design
 * system sets its minimum width at 120px; at 24px tall it is 128px wide.
 */
export function Logo({ lang }: { lang: Lang }) {
  return (
    <Link href={pagePath(lang, "home")} className="flex shrink-0 items-center" aria-label={getDictionary(lang).nav.home}>
      {/* The link's label names it, so the picture itself stays silent to screen readers. SVGs are served as is. */}
      <Image src="/brand/malaka-compact-on-dark.svg" alt="" width={128} height={24} loading="eager" className="h-6 w-auto" />
    </Link>
  );
}
