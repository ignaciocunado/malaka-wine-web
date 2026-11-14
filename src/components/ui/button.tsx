import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "./cn";

type Variant = "filled" | "tinted" | "gray" | "plain";
type Size = "sm" | "md" | "lg";

// Press feedback lands instantly on pointer-down (active:duration-0) and springs back on release.
const base =
  "inline-flex items-center justify-center gap-1.5 rounded-full font-semibold whitespace-nowrap select-none " +
  "transition duration-300 ease-spring active:opacity-75 active:duration-0 motion-safe:active:scale-[0.97] " +
  "disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  // A hairline of light on the wine fill keeps the button's edge visible on the dark ground.
  filled: "bg-tint text-tint-contrast inset-ring inset-ring-white/15 hover:brightness-115",
  tinted: "text-label inset-ring inset-ring-label/40 hover:bg-fill-quaternary",
  gray: "bg-fill-secondary text-label hover:bg-fill",
  plain: "text-accent hover:underline underline-offset-4",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-footnote",
  md: "h-11 px-5 text-callout",
  lg: "h-[52px] px-7 text-headline",
};

type StyleProps = { variant?: Variant; size?: Size };

export function buttonClasses({ variant = "filled", size = "md" }: StyleProps = {}, className?: string) {
  return cn(base, variants[variant], variant === "plain" ? "text-callout" : sizes[size], className);
}

export function Button({ variant, size, className, ...props }: ComponentProps<"button"> & StyleProps) {
  return <button className={buttonClasses({ variant, size }, className)} {...props} />;
}

export function ButtonLink({ variant, size, className, ...props }: ComponentProps<typeof Link> & StyleProps) {
  return <Link className={buttonClasses({ variant, size }, className)} {...props} />;
}
