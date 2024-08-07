# Fehlerbehebungen (Version :VERSION)

- Es gab CRM Projekte, bei denen das Abschlussdatum weit in der Zukunft lag und das CRM Projekt bereits geschlossen ist (verloren oder gewonnen). In diesem Fall wäre das Projekt noch sehr lange und immer wieder in der Liste aufgetaucht, obwohl nichts mehr dafür getan werden konnte. Das ist nun behoben. Es wird immer das kleinere Datum für den Import herangezogen, entweder das Abschlussdatum oder das System-Abschlussdatum, das anzeigt, wann das Projekt geschlossen wurde.
- Das Hauptmenü führte häufig zu Abstürzen, wenn der Suchbegriff einmal mehr als 3 Zeichen hatte und dann wieder weniger. Der Grund dafür war, dass die Gruppen als Komponenten immer erst dann erschienen, wenn die Suche mehr als 3 Zeichen hatte. CmdK kann nicht gut damit umgehen, wenn die React Komponente plötzlich wieder ganz verschwindet. Wir verstecken sie nun mit einer CSS Klasse, entfernen sie aber nicht komplett vom DOM.

## In Arbeit

- Blöcke als einzelne Records in der Datenbank speichern.
