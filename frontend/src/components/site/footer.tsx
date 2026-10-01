import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-system-secondary text-caption text-label-secondary">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="border-b border-separator pb-4 leading-relaxed">
          Terruño sells alcoholic drinks only to adults aged 18 and over. Please drink responsibly.
          Producers, prices and boxes shown on this site are sample content for this starter project.
        </p>
        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Terruño Málaga. Made in Málaga.</p>
          <ul className="flex gap-5">
            <li>
              <Link href="/#plans" className="hover:text-label">
                Plans
              </Link>
            </li>
            <li>
              <Link href="/taste" className="hover:text-label">
                Taste quiz
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-label">
                Your account
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
