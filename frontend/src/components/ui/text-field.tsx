import { useId, type ComponentProps } from "react";

import { cn } from "./cn";
import { rowSeparator } from "./grouped-list";

/** A text input that sits inside a GroupedSection row, like iOS Settings and Apple Account forms. */
export function TextField({
  label,
  error,
  className,
  ...props
}: ComponentProps<"input"> & { label: string; error?: string }) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={cn(rowSeparator, "px-4 pt-2 pb-2.5", className)}>
      <label htmlFor={id} className="block text-caption text-label-secondary">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="mt-0.5 block w-full bg-transparent text-body text-label outline-none placeholder:text-label-tertiary"
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-1 text-caption text-system-red">
          {error}
        </p>
      )}
    </div>
  );
}
