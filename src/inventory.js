// Teilekatalog und Preislogik von Parts Unlimited.
// Bewusst klein gehalten: Es geht in den Übungen um den Weg in die Produktion, nicht um die Fachlogik.

export const VAT_RATE = 0.19;
export const VOLUME_DISCOUNT_RATE = 0.05;
export const VOLUME_DISCOUNT_MIN_QTY = 10;

export const catalog = [
  { sku: "PU-1001", name: "Bremsscheibe vorne", priceCents: 4990, stock: 42 },
  { sku: "PU-1002", name: "Bremsbeläge (Satz)", priceCents: 2950, stock: 120 },
  { sku: "PU-2001", name: "Ölfilter", priceCents: 890, stock: 300 },
  { sku: "PU-2002", name: "Luftfilter", priceCents: 1490, stock: 85 },
  { sku: "PU-3001", name: "Zündkerze", priceCents: 650, stock: 0 },
  { sku: "PU-4001", name: "Scheibenwischer (Paar)", priceCents: 1990, stock: 64 },
];

/** Sucht ein Teil anhand der Artikelnummer (SKU). Gibt undefined zurück, wenn es das Teil nicht gibt. */
export function findPart(sku) {
  return catalog.find((part) => part.sku === sku);
}

/** Prüft, ob die gewünschte Menge eines Teils auf Lager ist. */
export function isInStock(sku, quantity = 1) {
  const part = findPart(sku);
  if (!part) return false;
  return part.stock >= quantity;
}

/**
 * Berechnet die Summe einer Bestellung in Cent.
 * items: [{ sku, quantity }]
 * Ab VOLUME_DISCOUNT_MIN_QTY Stück einer Position gibt es VOLUME_DISCOUNT_RATE Rabatt auf diese Position.
 * Ergebnis: { netCents, vatCents, grossCents }
 */
export function orderTotal(items) {
  let netCents = 0;
  for (const { sku, quantity } of items) {
    const part = findPart(sku);
    if (!part) throw new Error(`Unbekannte Artikelnummer: ${sku}`);
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error(`Ungültige Menge für ${sku}: ${quantity}`);
    }
    let line = part.priceCents * quantity;
    if (quantity >= VOLUME_DISCOUNT_MIN_QTY) {
      line = Math.round(line * (1 - VOLUME_DISCOUNT_RATE));
    }
    netCents += line;
  }
  const vatCents = Math.round(netCents * VAT_RATE);
  return { netCents, vatCents, grossCents: netCents + vatCents };
}

/** Formatiert Cent als Euro-Betrag, z. B. 4990 -> "49,90 €". */
export function formatEuro(cents) {
  return (cents / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" });
}
