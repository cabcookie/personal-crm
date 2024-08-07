# Fehlerbehebungen (Version :VERSION)

- Es gab CRM Projekte, bei denen das Abschlussdatum weit in der Zukunft lag und das CRM Projekt bereits geschlossen ist (verloren oder gewonnen). In diesem Fall wäre das Projekt noch sehr lange und immer wieder in der Liste aufgetaucht, obwohl nichts mehr dafür getan werden konnte. Das ist nun behoben. Es wird immer das kleinere Datum für den Import herangezogen, entweder das Abschlussdatum oder das System-Abschlussdatum, das anzeigt, wann das Projekt geschlossen wurde.

## In Arbeit

- Den Crash im Hauptmenü fixen
- Blöcke als einzelne Records in der Datenbank speichern.
