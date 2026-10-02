import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-headline tracking-tight" aria-label="Terruño home">
      <svg viewBox="0 0 28 28" className="size-7" aria-hidden="true">
        <circle cx="14" cy="14" r="14" className="fill-tint" />
        <path d="M10 7.5h8l-.35 3.9a3.66 3.66 0 0 1-7.3 0L10 7.5zM14 15v4.5M11.5 19.75h5" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>
        Terruño<span className="text-label-secondary font-normal"> · Málaga</span>
      </span>
    </Link>
  );
}
