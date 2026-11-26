import type { ReactNode } from "react";

import { cn } from "./cn";

/** The inset hairline between rows of a grouped list (hidden above the first row). */
export const rowSeparator =
  "relative before:absolute before:top-0 before:right-0 before:left-4 before:h-px before:bg-separator before:content-[''] first:before:hidden";

/** HIG "inset grouped" list: a rounded section with a header, hairline-separated rows and an optional footer. */
export function GroupedSection({
  header,
  footer,
  children,
  className,
}: {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      {header && <h2 className="mb-1.5 px-4 text-footnote text-label-secondary uppercase">{header}</h2>}
      <div className="overflow-hidden rounded-sm bg-grouped-secondary">{children}</div>
      {footer && <p className="mt-1.5 px-4 text-footnote text-label-secondary">{footer}</p>}
    </section>
  );
}

export function ListRow({
  label,
  children,
  className,
}: {
  label?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        rowSeparator,
        "flex min-h-11 items-center justify-between gap-4 px-4 py-2.5 text-body",
        className,
      )}
    >
      {label !== undefined && <span className="shrink-0">{label}</span>}
      {children}
    </div>
  );
}
