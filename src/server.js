// Minimaler Webserver ohne externe Abhängigkeiten.
// Start: npm start  ->  http://localhost:3000
import { createServer } from "node:http";
import { pathToFileURL } from "node:url";
import { catalog, formatEuro } from "./inventory.js";

const PORT = Number(process.env.PORT) || 3000;
const VERSION = process.env.APP_VERSION || "dev";

function sendJson(res, status, body) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function renderPage() {
  const rows = catalog
    .map(
      (p) =>
        `<tr><td>${p.sku}</td><td>${p.name}</td><td>${formatEuro(p.priceCents)}</td><td>${
          p.stock > 0 ? p.stock : "ausverkauft"
        }</td></tr>`,
    )
    .join("");
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Parts Unlimited</title>
<style>body{font-family:Arial,sans-serif;margin:2rem;color:#333}table{border-collapse:collapse}td,th{padding:.4rem .8rem;border-bottom:1px solid #ddd;text-align:left}</style>
</head><body><h1>Parts Unlimited – Teilekatalog</h1>
<table><thead><tr><th>Artikel</th><th>Bezeichnung</th><th>Preis</th><th>Lager</th></tr></thead><tbody>${rows}</tbody></table>
<p><small>Version ${VERSION}</small></p></body></html>`;
}

export const server = createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/health") return sendJson(res, 200, { status: "ok", version: VERSION });
  if (url.pathname === "/api/parts") return sendJson(res, 200, catalog);
  if (url.pathname === "/") {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    return res.end(renderPage());
  }
  sendJson(res, 404, { error: "Nicht gefunden" });
});

// Nur starten, wenn die Datei direkt ausgeführt wird (nicht beim Import in Tests)
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  server.listen(PORT, () => console.log(`Parts Unlimited läuft auf http://localhost:${PORT}`));

  // Sauber beenden, wenn z. B. "docker stop" das Signal SIGTERM schickt
  for (const signal of ["SIGTERM", "SIGINT"]) {
    process.on(signal, () => server.close(() => process.exit(0)));
  }
}
