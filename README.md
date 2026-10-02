# Wie Neu Autoaufbereitung

Responsive statische Website für Wie Neu Autoaufbereitung in Elbe-Parey OT Güsen. Es gibt keinen Build-Schritt.

## Projektstruktur

- `index.html` enthält die Startseite, Leistungen, Pakete, Buchungsdialog und Kontaktinformationen.
- `css/styles.css` enthält Layout, Gestaltung und Responsive-Regeln.
- `js/main.js` steuert Navigation, Buchungsablauf, zentrale Paket- und Zusatzleistungspreise sowie die Kontaktübergabe an WhatsApp.
- `data/reviews.json` enthält öffentliche Bewertungsdaten ohne Kontaktdaten.
- `agb.html`, `datenschutz.html` und `impressum.html` sind die rechtlichen Seiten.
- `assets/` enthält Marken-, Fahrzeug- und Hintergrundbilder.

## Vorschau und Veröffentlichung

Die Seite kann direkt über `index.html` oder über einen beliebigen statischen HTTP-Server geöffnet werden. Für die Veröffentlichung ist GitHub Pages eingerichtet.

Paketpreise, Zusatzleistungspreise und Rabattberechnung werden zentral in `js/main.js` gepflegt. Kontakt- und Buchungsanfragen werden per WhatsApp übermittelt.

