const euro = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const longDate = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** e.g. "39 €" */
export function formatEuros(cents: number) {
  return euro.format(cents / 100);
}

/** e.g. "1 de noviembre de 2026" */
export function formatDate(isoDate: string) {
  return longDate.format(new Date(isoDate));
}

/** Keeps post-login redirects on this site: only the path, query and hash of the URL are used. */
export function safeCallbackUrl(raw: FormDataEntryValue | string | null | undefined, fallback = "/account") {
  if (typeof raw !== "string" || raw === "") return fallback;
  try {
    const url = new URL(raw, "http://localhost");
    if (!url.pathname.startsWith("/") || url.pathname.startsWith("//")) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
