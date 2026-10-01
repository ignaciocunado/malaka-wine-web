import type { ReactNode } from "react";

export function AuthHeader({ title, subtitle }: { title: string; subtitle: ReactNode }) {
  return (
    <div className="mb-8 text-center">
      <svg viewBox="0 0 28 28" className="mx-auto size-14" aria-hidden="true">
        <circle cx="14" cy="14" r="14" className="fill-tint" />
        <path
          d="M10 7.5h8l-.35 3.9a3.66 3.66 0 0 1-7.3 0L10 7.5zM14 15v4.5M11.5 19.75h5"
          fill="none"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <h1 className="mt-5 text-title1">{title}</h1>
      <p className="mt-2 text-subheadline text-label-secondary">{subtitle}</p>
    </div>
  );
}
