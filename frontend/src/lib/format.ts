const euro = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export function formatEuros(cents: number) {
  return euro.format(cents / 100);
}

export function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
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
