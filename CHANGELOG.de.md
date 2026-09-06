# Änderungsprotokoll

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt hält sich an [Semantische Versionierung](https://semver.org/lang/de/spec/v2.0.0.html).

---

## [2.0.0] - 06.09.2025

### Hinzugefügt

- **Link-Speicher**: Vollständiges Link-History-Feature mit Sidebar-Integration
  - Speichert bis zu 100 kopierte Links mit Zeitstempel
  - Zugriff auf den Verlauf über die Firefox-Sidebar (F9 oder Ansicht → Sidebar → Link-Speicher)
  - Links bleiben über Browser-Neustarts erhalten (localStorage)
  - Automatische FIFO-Rotation (First-In-First-Out) bei Erreichen des 100-Links-Limits
- **Sidebar-Benutzeroberfläche**: Reaktionsfähige, kartenbasierte Oberfläche zum Anzeigen gespeicherter Links
  - Jede Karte zeigt Titel, URL und Erstellungszeitstempel
  - Zeigt die ursprüngliche URL an, wenn der Link bereinigt wurde
  - Unterstützung für Dark/Light Mode
- **Schnellaktionen auf Link-Karten**
  - "Link erneut kopieren"-Button zum erneuten Kopieren eines gespeicherten Links
  - "Als Lesezeichen speichern"-Button zum dauerhaften Speichern in "Weitere Lesezeichen"
  - "Link löschen"-Button zum Entfernen einzelner Links
  - "Alle Löschen"-Button mit Bestätigungsdialog zum Leeren des gesamten Speichers
- **Symbol-Schaltflächen**: Text-Schaltflächen durch SVG-Symbole ersetzt
  - Kopieren: copy-16.svg
  - Lesezeichen: bookmark-16.svg
  - Löschen: delete-16.svg
  - Einstellungen: Zahnrad-Symbol
- **Visuelles Feedback**: Grünes Häkchen-Symbol auf der Toolbar/Adressleisten-Schaltfläche nach erfolgreichem Kopieren
  - Nur die geklickte Schaltfläche zeigt Feedback
  - Automatische Rücksetzung nach 1,5 Sekunden
- **Private-Fenster-Unterstützung**: Link-Speicher ist in privaten Fenstern automatisch deaktiviert
- **Modifier-Tasten-Unterstützung für Kopier-Schaltfläche**: Berücksichtigt clickplain/clickshift/clickctrl-Einstellungen
- **Aktualisierte Tooltips**: Dynamische Tooltips zeigen das tatsächlich kopierte Format an
- **Aktualisierte Feedback-Nachrichten**: Saubere Meldungen ("Link kopiert", "Markdown kopiert", "HTML kopiert")

### Geändert

- Alle i18n-Nachrichten für neue Funktionen aktualisiert (de/en)
- Options-Seite mit neuer Link-Speicher-Einstellung verbessert
- background.js mit Link-Speicher-Logik erweitert
- Projektstruktur mit neuen Dateien aktualisiert

### Behoben

- Alle unsicheren `innerHTML`-Zuweisungen durch sichere DOM-Manipulationsmethoden ersetzt
  - AMO-Validierungswarnungen für sidebar.js Zeilen 256, 274, 282 und 82 behoben
  - Verwende `document.createElement()` und `appendChild()` anstelle von innerHTML

### Technische Details

- Verwendet `browser.storage.local` für dauerhafte Link-Speicherung
- Implementiert FIFO-Warteschlange für 100-Links-Limit
- Beibehaltung der Manifest V3-Kompatibilität
- Volle i18n-Unterstützung für alle neuen Funktionen

---

## [1.7.0] - 02.09.2025

### Hinzugefügt

- Tab-Kontextmenü-Unterstützung
- Adressleisten-Schaltfläche (Page Action) Option
- Dynamische Menübeschriftungen

### Geändert

- Aktualisierung auf Manifest V3
- Symbole mit FirefoxUX Acorn-Icons aktualisiert
- Dark Mode-Stil hinzugefügt
- Internationalisierungsunterstützung verbessert

---

## [1.6.0] - 01.09.2025

### Hinzugefügt

- Link-Bereinigungsunterstützung mit link-cleaner-js
- Option zum Entfernen von Tracking-Parametern (UTM, fbclid, etc.)

---

## [1.5.0] - 30.08.2025

### Hinzugefügt

- i18n-Unterstützung (Deutsch und Englisch)
- Benutzerdefiniertes Kontextmenü für decodierte URLs

---

[2.0.0]: https://github.com/wnpl/copy-frame-or-page-url/compare/v1.7.0...v2.0.0
[1.7.0]: https://github.com/wnpl/copy-frame-or-page-url/compare/v1.6.0...v1.7.0
[1.6.0]: https://github.com/wnpl/copy-frame-or-page-url/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/wnpl/copy-frame-or-page-url/releases/tag/v1.5.0
