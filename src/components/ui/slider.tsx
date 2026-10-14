"use client";

import type { CSSProperties } from "react";

type Props = {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  minLabel: string;
  maxLabel: string;
  valueText?: string;
};

export function Slider({ label, min, max, step = 1, value, onChange, minLabel, maxLabel, valueText }: Props) {
  const percent = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <input
        type="range"
        aria-label={label}
        aria-valuetext={valueText}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="ios-slider"
        style={{ "--value": percent } as CSSProperties}
      />
      <div className="mt-1 flex justify-between text-footnote text-label-secondary">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}
