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

/** HIG segmented control, built on native radio inputs so arrow keys and screen readers work. */
export function SegmentedControl<T extends string>({ label, options, value, onChange, className }: Props<T>) {
  const name = useId();
  return (
    <fieldset className={cn("flex rounded-[9px] bg-fill-tertiary p-0.5", className)}>
      <legend className="sr-only">{label}</legend>
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            "relative flex min-h-8 flex-1 cursor-pointer items-center justify-center rounded-[7px] px-3 text-center",
            "text-footnote font-medium transition-all duration-200 ease-ios",
            "has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-system-blue/60",
            option.value === value
              ? "bg-segment-selected font-semibold shadow-[0_3px_8px_rgba(0,0,0,0.12),0_3px_1px_rgba(0,0,0,0.04)]"
              : "text-label hover:bg-fill-quaternary",
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
