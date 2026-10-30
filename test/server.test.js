import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { server } from "../src/server.js";

let base;

before(async () => {
  await new Promise((resolve) => server.listen(0, resolve));
  base = `http://localhost:${server.address().port}`;
});

after(() => server.close());

test("GET /health meldet ok", async () => {
  const res = await fetch(`${base}/health`);
  assert.equal(res.status, 200);
  assert.equal((await res.json()).status, "ok");
});

test("GET /api/parts liefert den Katalog", async () => {
  const parts = await (await fetch(`${base}/api/parts`)).json();
  assert.ok(parts.length >= 5);
});

test("unbekannte Pfade liefern 404", async () => {
  const res = await fetch(`${base}/gibts-nicht`);
  assert.equal(res.status, 404);
});
