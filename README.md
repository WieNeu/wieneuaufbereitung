Wie Neu Autoaufbereitung — Website

Diese kleine Website enthält eine moderne, responsive One-Page-Vorlage für "Wie Neu Autoaufbereitung".

Dateien im Repo:
- index.html
- css/styles.css
- js/main.js
- assets/ (hier dein Logo ablegen)

Was du noch tun musst:
1. Lege dein Logo im Repository unter assets/logo.png ab. Die Datei sollte quadratisch sein (z. B. 512x512) oder du passt die CSS-Klasse `.logo` an.
2. Öffne die index.html lokal in einem Browser zum Testen oder aktiviere GitHub Pages über die Repository-Settings.
3. Wenn du eine funktionierende Kontaktverarbeitung willst, musst du ein Backend oder einen Service (z.B. Formspree, Netlify Forms) anbinden.

Anpassungen:
- Farben in css/styles.css unter :root ändern.
- Telefonnummer, E-Mail und Adresse in index.html anpassen.

Viel Erfolg — sag Bescheid, wenn ich das Logo direkt ins Repo hochladen oder weitere Seiten/Unterseiten hinzufügen soll.

## Instagram Reels

Der Bereich auf der Startseite wird automatisch aus dem Instagram-Konto `autoaufbereitung_wie_neu` aktualisiert. GitHub Actions ruft alle sechs Stunden die offizielle Meta Graph API v25.0 ab, wählt die neuesten neun Medien mit `media_product_type=REELS`, entfernt doppelte Media-IDs und veröffentlicht einen neuen Snapshot in `data/instagram-reels.json`. Die Website lädt nur diesen öffentlichen Snapshot; ein Meta-Token gelangt nie in den Browser. Reels öffnen beim Anklicken Instagram. Vorschaubilder werden lazy geladen.

### Voraussetzungen

- Ein Instagram Business- oder Creator-Konto, das mit einer Facebook-Seite verbunden ist.
- Eine Meta-App vom Typ Business mit Instagram API mit Facebook Login und Facebook Login for Business.
- Für den eigenen Account genügen in der Regel Standard Access und die Berechtigungen `instagram_basic` sowie `pages_show_list`. Der Facebook-Benutzer muss Zugriff auf die verbundene Seite haben. Zugriff auf fremde Konten erfordert Advanced Access und gegebenenfalls App Review.
- GitHub Pages muss unter **Settings → Pages → Build and deployment → Source** auf **GitHub Actions** gestellt sein. Die bestehende Custom-Domain muss in den Pages-Einstellungen erhalten bleiben.

Meta dokumentiert `media_product_type` für diesen Medienabruf nur bei der Facebook-Login-Variante. Deshalb wird sie verwendet, statt Videos anhand eines nicht stabil zugesicherten URL-Musters als Reels zu erraten. Die offiziellen Anleitungen sind [Instagram API with Facebook Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/get-started/) und [IG User Media](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media).

### Einmalige Einrichtung

1. Verbinde in Instagram das Professional-Konto mit der dazugehörigen Facebook-Seite. Erstelle unter [Meta for Developers](https://developers.facebook.com/apps/) eine Business-App, füge Instagram API with Facebook Login hinzu und richte Facebook Login for Business ein.
2. Erzeuge im Graph API Explorer einen Facebook User Access Token mit `instagram_basic` und `pages_show_list`. Der anmeldende Benutzer benötigt Zugriff auf die verbundene Facebook-Seite.
3. Ermittle die Instagram User ID: Rufe mit dem Token `GET /me/accounts` ab, nimm die ID der verbundenen Seite und frage `GET /{PAGE_ID}?fields=instagram_business_account` ab. Kopiere die `instagram_business_account.id`.
4. Verwende für den automatischen Abruf einen Long-Lived User Access Token. Meta-Tokens laufen üblicherweise nach etwa 60 Tagen ab. Einen kurzlebigen Token kannst du serverseitig über `GET https://graph.facebook.com/v25.0/oauth/access_token?grant_type=fb_exchange_token&client_id=APP_ID&client_secret=APP_SECRET&fb_exchange_token=SHORT_LIVED_TOKEN` verlängern. Führe diesen Aufruf nur auf einem vertrauenswürdigen Rechner aus; niemals App Secret oder Token in Website-Dateien, Commits oder Support-Chats eintragen.
5. Öffne im GitHub-Repository **Settings → Secrets and variables → Actions** und lege an:
	- Repository secret `META_USER_ACCESS_TOKEN`: den Long-Lived User Access Token.
	- Repository variable `INSTAGRAM_USER_ID`: die Instagram User ID aus Schritt 3.
6. Unter **Actions** den Workflow **Refresh Instagram Reels and deploy site** einmal über **Run workflow** starten. Bei Erfolg wird die Website über GitHub Pages veröffentlicht; danach läuft der Abruf automatisch alle sechs Stunden.

### Betrieb und Fehlerfälle

Die Synchronisierung fragt die neueste Medien-Pagination ab, bis neun eindeutige Reels gefunden wurden. Jeder Lauf ersetzt den Snapshot statt Einträge anzuhängen, dadurch entstehen keine Duplikate. Bei API-, Token- oder Netzwerkfehlern bleibt der letzte erfolgreiche Snapshot erhalten; beim ersten Fehler ohne Snapshot bleibt der Instagram-Profil-Link als Fallback sichtbar.

Wenn ein Token abläuft oder widerrufen wird, erzeuge einen neuen Long-Lived Token und ersetze das Repository Secret `META_USER_ACCESS_TOKEN` unter **Settings → Secrets and variables → Actions**. Danach den Workflow manuell starten. `INSTAGRAM_USER_ID` muss nur geändert werden, wenn ein anderes Instagram-Konto angebunden wird. Die API-Version steht im Workflow als `META_GRAPH_API_VERSION`; vor einer Meta-Versionablösung dort die aktuelle Version und die unterstützten Medienfelder prüfen.
