# Parts Unlimited – Bestellservice

Übungsprojekt der Veranstaltung **DevOps** (THM, Wirtschaftsinformatik B.Sc.).
Parts Unlimited ist das fiktive Unternehmen aus dem Roman *Projekt Phoenix*. Sie bauen in den Übungen
Schritt für Schritt den Weg dieser kleinen Anwendung vom Commit bis in die Produktion.

## Starten

Voraussetzung: Node.js 22 oder neuer (`node -v`). Externe Pakete werden nicht benötigt.

```bash
npm test     # automatisierte Tests
npm start    # Webserver auf http://localhost:3000
```

| Pfad | Inhalt |
|---|---|
| `/` | Teilekatalog als Webseite |
| `/api/parts` | Teilekatalog als JSON |
| `/health` | Gesundheitszustand (für Monitoring und Deployment) |

## Aufbau

```
src/inventory.js   Katalog, Lagerprüfung, Preisberechnung
src/server.js      Webserver
test/              Tests mit dem eingebauten Test-Runner von Node
```
