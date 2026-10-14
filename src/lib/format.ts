const euro = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

/** e.g. "39 €" */
export function formatEuros(cents: number) {
  return euro.format(cents / 100);
}
