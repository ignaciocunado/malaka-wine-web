import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "./cn";

type Variant = "filled" | "tinted" | "gray" | "plain" | "plain-destructive" | "destructive";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-1.5 rounded-full font-normal whitespace-nowrap select-none " +
  "transition duration-200 ease-ios active:opacity-60 disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  filled: "bg-tint text-tint-contrast hover:brightness-110",
  tinted: "bg-tint/12 text-tint hover:bg-tint/18",
  gray: "bg-fill-secondary text-label hover:bg-fill",
  plain: "text-tint hover:underline underline-offset-4",
  "plain-destructive": "text-system-red hover:underline underline-offset-4",
  destructive: "bg-system-red/12 text-system-red hover:bg-system-red/18",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3.5 text-footnote",
  md: "h-11 px-5 text-callout",
  lg: "h-[52px] px-7 text-headline",
};

type StyleProps = { variant?: Variant; size?: Size };

export function buttonClasses({ variant = "filled", size = "md" }: StyleProps = {}, className?: string) {
  const plain = variant === "plain" || variant === "plain-destructive";
  return cn(base, variants[variant], plain ? "text-callout" : sizes[size], className);
}

export function Button({ variant, size, className, ...props }: ComponentProps<"button"> & StyleProps) {
  return <button className={buttonClasses({ variant, size }, className)} {...props} />;
}

export function ButtonLink({ variant, size, className, ...props }: ComponentProps<typeof Link> & StyleProps) {
  return <Link className={buttonClasses({ variant, size }, className)} {...props} />;
}
