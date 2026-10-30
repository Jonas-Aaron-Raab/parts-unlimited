import { test } from "node:test";
import assert from "node:assert/strict";
import { findPart, isInStock, orderTotal, formatEuro } from "../src/inventory.js";

test("findet ein Teil anhand der Artikelnummer", () => {
  assert.equal(findPart("PU-2001").name, "Ölfilter");
  assert.equal(findPart("GIBT-ES-NICHT"), undefined);
});

test("prüft den Lagerbestand", () => {
  assert.equal(isInStock("PU-1001", 1), true);
  assert.equal(isInStock("PU-1001", 43), false);
  assert.equal(isInStock("PU-3001"), false); // ausverkauft
  assert.equal(isInStock("GIBT-ES-NICHT"), false);
});

test("berechnet Netto, Mehrwertsteuer und Brutto", () => {
  // 2 x Ölfilter = 17,80 € netto, 19 % MwSt = 3,38 €
  assert.deepEqual(orderTotal([{ sku: "PU-2001", quantity: 2 }]), {
    netCents: 1780,
    vatCents: 338,
    grossCents: 2118,
  });
});

test("gewährt ab 10 Stück 5 % Mengenrabatt", () => {
  // 10 x Zündkerze = 65,00 € -> 61,75 € netto
  const total = orderTotal([{ sku: "PU-3001", quantity: 10 }]);
  assert.equal(total.netCents, 6175);
});

test("lehnt unbekannte Artikel und ungültige Mengen ab", () => {
  assert.throws(() => orderTotal([{ sku: "XX", quantity: 1 }]), /Unbekannte Artikelnummer/);
  assert.throws(() => orderTotal([{ sku: "PU-2001", quantity: 0 }]), /Ungültige Menge/);
});

test("formatiert Beträge in Euro", () => {
  assert.equal(formatEuro(4990).replace(/\s/g, " "), "49,90 €");
});
