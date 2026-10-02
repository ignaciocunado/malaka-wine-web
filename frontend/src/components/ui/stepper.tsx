"use client";

import { MinusIcon, PlusIcon } from "./icons";

type Props = {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

/** HIG stepper: a compact −/+ pair for small numeric adjustments. */
export function Stepper({ label, value, min, max, onChange }: Props) {
  const button =
    "flex h-8 w-11 items-center justify-center text-label transition active:bg-fill disabled:text-label-tertiary";
  return (
    <div role="group" aria-label={label} className="inline-flex items-center rounded-lg bg-fill-tertiary">
      <button
        type="button"
        className={`${button} rounded-l-lg`}
        aria-label={`Decrease ${label.toLowerCase()}`}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <MinusIcon className="size-4" strokeWidth={2.25} />
      </button>
      <span className="h-4.5 w-px bg-separator" aria-hidden />
      <button
        type="button"
        className={`${button} rounded-r-lg`}
        aria-label={`Increase ${label.toLowerCase()}`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <PlusIcon className="size-4" strokeWidth={2.25} />
      </button>
    </div>
  );
}
