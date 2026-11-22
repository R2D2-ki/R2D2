# Hablemos – Spanisch sprechen (Web-App fürs iPhone)

Gespräch üben, Aussprache wortweise auswerten, Fehler markieren, Aufnahme und Vorbild abwechselnd anhören.
Läuft ohne Konto und ohne Cloud: Spracherkennung (Whisper) läuft im Browser auf dem Gerät.

## Dateien
| Datei | Aufgabe |
|---|---|
| `core/compare.js` | Kern: Soll-Satz gegen erkannten Text, Wort für Wort (ohne Oberfläche, mit Tests) |
| `core/scenes.js` | Gesprächsszenen als reine Daten, leicht erweiterbar |
| `store.js` | Speicher auf dem Gerät (Einstellungen, schwierige Wörter, Bestwerte) |
| `audio.js` | Aufnahme (rohes PCM), Wiedergabe, Spanisch vorlesen |
| `worker.js`, `asr.js` | Whisper im Hintergrund-Thread |
| `app.js`, `index.html`, `style.css` | Oberfläche |
| `sw.js`, `manifest.webmanifest` | Offline-Fähigkeit, Startbildschirm-Symbol |

## Testen
```bash
node tests/compare.test.mjs              # Vergleichskern
python3 -m http.server 8765              # App lokal: http://localhost:8765
```
`tests/audio/` enthält zwei mit der Mac-Stimme erzeugte Sprachproben (richtig / ein Wort ersetzt).

## Aufs iPhone
Mikrofon funktioniert im Browser nur über **HTTPS** (oder localhost). Die Dateien müssen also
auf einen HTTPS-Webspace. Danach in Safari öffnen › Teilen › „Zum Home-Bildschirm“.
Erster Start: Modell einmalig laden (WLAN), danach läuft es auch offline.

## Grenzen
- Whisper „hilft“ beim Erkennen und ist deshalb nachsichtiger als eine echte Lautbewertung.
  Es markiert Wörter, die klar falsch oder unverständlich waren, keine feinen Lautfehler.
- Gesprächspartner sind feste Szenen mit Antwortvarianten, keine freie KI.
