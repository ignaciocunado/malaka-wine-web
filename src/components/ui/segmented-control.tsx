"use client";

import { useId } from "react";

import { cn } from "./cn";

type Props<T extends string> = {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

/**
 * HIG segmented control, built on native radio inputs so arrow keys and screen readers work. The selection is one
 * thumb that slides between segments on a spring, so a change reads as movement rather than a jump.
 */
export function SegmentedControl<T extends string>({ label, options, value, onChange, className }: Props<T>) {
  const name = useId();
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  return (
    <fieldset
      className={cn("relative grid rounded-[9px] bg-fill-tertiary p-0.5", className)}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      <legend className="sr-only">{label}</legend>
      <span
        aria-hidden
        className="absolute inset-y-0.5 left-0.5 rounded-[7px] bg-segment-selected shadow-[0_3px_8px_rgba(0,0,0,0.12),0_3px_1px_rgba(0,0,0,0.04)] transition-transform duration-500 ease-spring motion-reduce:transition-none"
        style={{
          width: `calc((100% - 4px) / ${options.length})`,
          transform: `translateX(${selectedIndex * 100}%)`,
        }}
      />
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            "relative flex min-h-8 cursor-pointer items-center justify-center rounded-[7px] px-3 text-center",
            "text-footnote font-medium transition-colors duration-300 ease-spring active:duration-0",
            "has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-system-blue/60",
            option.value === value ? "font-semibold" : "text-label hover:bg-fill-quaternary active:bg-fill-tertiary",
          )}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={option.value === value}
            onChange={() => onChange(option.value)}
            className="sr-only"
          />
          {option.label}
        </label>
      ))}
    </fieldset>
  );
}
