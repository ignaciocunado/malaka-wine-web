"use client";

import { CheckIcon } from "./icons";
import { cn } from "./cn";

type Props<T extends string> = {
  label: string;
  options: { value: T; label: string; hint?: string }[];
  value: T[];
  onChange: (value: T[]) => void;
};

/** Multi-select "token" buttons backed by checkboxes. */
export function ChipGroup<T extends string>({ label, options, value, onChange }: Props<T>) {
  const toggle = (option: T) =>
    onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option]);

  return (
    <fieldset className="flex flex-wrap gap-2">
      <legend className="sr-only">{label}</legend>
      {options.map((option) => {
        const selected = value.includes(option.value);
        return (
          <label
            key={option.value}
            title={option.hint}
            className={cn(
              "inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full px-4 text-subheadline select-none",
              "transition duration-300 ease-spring active:duration-0 motion-safe:active:scale-[0.96]",
              "has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-system-blue/60",
              selected ? "bg-tint text-tint-contrast" : "bg-fill-tertiary text-label hover:bg-fill-secondary",
            )}
          >
            <input
              type="checkbox"
              checked={selected}
              onChange={() => toggle(option.value)}
              className="sr-only"
            />
            {selected && <CheckIcon className="-ml-1 size-4" strokeWidth={2.5} />}
            {option.label}
          </label>
        );
      })}
    </fieldset>
  );
}
