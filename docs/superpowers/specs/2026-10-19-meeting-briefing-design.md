# Meeting-Briefing und Personen-Zusammenfassung

Datum: 2026-10-19
Status: Design freigegeben, Spec im Review

## Ziel

Ein Assistent, der zu einem Meeting ein Briefing schreibt: Er leitet aus den
ausgewählten Personen und Projekten sowie deren offenen nächsten Schritten ab,
warum das Meeting wahrscheinlich stattfindet, und formuliert ein Briefing. Das
Briefing entsteht automatisch, sobald Personen/Projekte manuell hinzugefügt
werden, und wird bei späteren Ergänzungen um Nachträge erweitert.

Voraussetzung dafür ist eine Zusammenfassung pro Person, die es heute noch
nicht gibt (nur `Projects.projectSummary` existiert).

## Lieferung

Zwei getrennte PRs, in dieser Reihenfolge:

1. **Personen-Zusammenfassung** inkl. Backfill und Anzeige in der Personenansicht.
2. **Meeting-Briefing** (nutzt die Personen-Zusammenfassungen aus PR 1).

PR 1 ist in Prod und befüllt, bevor PR 2 darauf zugreift.

## Nicht im Umfang

- Live-Reaktion auf das Transkript (Hinweise während des Gesprächs). Eigenes
  späteres Teilprojekt.
- Entfernen von Personen/Projekten aktualisiert das Briefing nicht.
- Änderungen am Meeting-Topic lösen nichts aus.
- Sonic-Vorschläge (`meeting.sonicDetections`) lösen nichts aus.
- Das Briefing wird nicht in die Notizen übernommen.

---

## Teil 1: Personen-Zusammenfassung

### Inhalt und Format

Feld `Person.personSummary` (string) plus `personSummaryUpdatedAt` (datetime).
Fünf feste Absätze mit fettem Anfang, nur Fließtext (keine Listen, keine
Überschriften), maximal ca. 250 Wörter, neuere Informationen stärker gewichtet,
`N/A` für leere Abschnitte. Der Prompt verbietet Formatbrüche auch bei leerer
oder Platzhalter-Eingabe.

1. **Who:** Rolle, Firma (inkl. früherer Stationen), Beziehungen zu anderen
   Personen.
2. **Relationship with me:** Seit wann und wie oft wir uns sehen, in welchen
   Projekten und Kontexten.
3. **Recent topics:** Worum es in den letzten Meetings und Erwähnungen ging.
4. **Open items:** Offene Todos oder Zusagen, an denen die Person beteiligt ist
   (in beide Richtungen).
5. **Personal notes:** Learnings wie Vorlieben, Familie, Hobbys, alles, was im
   Gespräch hilft. Private Learnings (inkl. `prayer`) fließen mit ein.

### Eingaben

- `PersonAccount` (Firma, Position, Start/Ende, inkl. Historie) mit Account-Name
- `PersonRelationship` (beide Richtungen) mit Namen der verbundenen Personen
- `PersonLearning` (alle mit Status `new`, neueste zuerst)
- Notizen mit @-Erwähnung über `NoteBlockPerson`: letzte 12 Monate, max. 30
- Meetings über `MeetingParticipant`: letzte 12 Monate, max. 15, jeweils mit
  Topic, Datum und den Activity-Notizen
- Offene Todos aus den obigen Notizen

Rendering zu Markdown über die bestehenden, seiteneffektfreien
`process-export-tasks/helpers`. Fehlt eine Quelle (z. B. verwaister
`noteBlockId`), wird sie übersprungen, die Summary bricht nicht ab.

### Trigger

Eingehängt in den bestehenden Debounce-Scheduler
(`amplify/functions/project-summary/schedule-handler.ts`, Schedule-Gruppe und
Scheduler-Rolle aus `amplify/custom/backend/project-summary.ts`), über den heute
schon das Person-Embedding läuft. Keine zweite Pipeline.

- Stream-Ereignisse auf `PersonLearning`, `PersonAccount`,
  `PersonRelationship`, `NoteBlockPerson`, `MeetingParticipant` setzen pro
  betroffener Person den One-Time-Schedule `person-summary-<personId>` auf
  „jetzt + 10 Minuten" (überschreiben bei jeder Änderung = Trailing Debounce).
- Eine Änderung an einem `NoteBlock` setzt den Schedule für alle in diesem
  Block erwähnten Personen.
- Fehlende Streams auf diesen Tabellen werden ergänzt.

### Lambda `person-summary`

- Wird vom Schedule mit `personId` aufgerufen.
- Lädt die Eingaben, rendert Markdown, berechnet einen Hash
  (`personSummarySource`). Ist der Hash unverändert, endet es ohne Bedrock-Call.
- Ruft Sonnet über Bedrock Converse auf (Modell aus `amplify/data/models.ts`,
  ohne `temperature`).
- Schreibt `personSummary`, `personSummaryUpdatedAt`, `personSummarySource`
  per Raw-DynamoDB-`UpdateItem` (nicht über AppSync, damit `owner` erhalten
  bleibt).

### Backfill

Bewährtes Muster (sparse GSI, Enqueue-Lambda, SQS, gedrosselter Worker):

- Feld `Person.personSummaryPending` (string) mit sparse GSI.
- Ein Skript markiert nur Personen mit mindestens einem Learning, einer
  Erwähnung oder einem Meeting. Personen ohne Aktivität bekommen keine Summary.
- Enqueue-Lambda paginiert über den GSI und legt Nachrichten in SQS.
- Worker mit begrenzter Concurrency ruft die gleiche Summary-Logik auf und
  entfernt die Markierung.
- Erst an ca. 20 Personen testen, dann vollständig.

### Anzeige

Karte „Summary" in der Personen-Detailansicht, analog zur Projektansicht.

---

## Teil 2: Meeting-Briefing

### Inhalt und Format

Fließtext mit fettem Anfang je Abschnitt, maximal ca. 300 Wörter:

1. **Likely purpose:** Warum das Meeting wahrscheinlich stattfindet, abgeleitet
   aus Topic, Teilnehmern und offenen Next Steps. Bei Unsicherheit zwei
   Hypothesen.
2. **Where things stand:** Aktueller Stand der betroffenen Projekte, nur das für
   dieses Meeting Relevante.
3. **Who's in the room:** Je Person ein bis zwei Sätze, was für dieses Meeting
   wichtig ist.
4. **Open items to raise:** Offene Todos und Zusagen zwischen mir und den
   Teilnehmern, die sich in diesem Meeting ansprechen lassen.
5. **Suggested goals:** Zwei bis drei konkrete Ziele oder Fragen.

**Nachtrag:** eigener Block mit Uhrzeit und Angabe, was hinzugekommen ist
(„Added: Mark Hübner, Project X"). Beschreibt nur, was sich dadurch relevant
ändert, ohne das Briefing zu wiederholen. Mehrere Nachträge stapeln sich
chronologisch.

### Eingaben

- Meeting: Topic, Datum, Kontext
- User-Prompt (`User.promptGeneral` + kontextbezogene Felder)
- Teilnehmer: `Person.personSummary`. Fehlt sie, nur Name, Firma, Position.
  Es wird nicht auf eine Summary gewartet.
- Verknüpfte Projekte (Activity -> `ProjectActivity`): `projectSummary`, offene
  Todos, `myNextActionsJson`, `othersNextActionsJson`
- Für Nachträge zusätzlich: bestehendes Briefing, bisherige Nachträge, die neu
  hinzugekommenen Personen/Projekte

### Datenmodell (am `Meeting`)

| Feld | Typ | Bedeutung |
|---|---|---|
| `briefing` | string | Das volle Briefing |
| `briefingStatus` | enum `MeetingBriefingStatus` | `WAITING`, `REQUESTED`, `GENERATING`, `DONE`, `ERROR` |
| `briefingAddenda` | json | Liste `{ createdAt, text, addedPersonIds, addedProjectIds }` |
| `briefingAddendumStatus` | enum (gleich) | Status des gerade laufenden Nachtrags |
| `briefingCoveredIds` | json | `{ personIds: string[], projectIds: string[] }`, was bereits abgedeckt ist |
| `briefingUpdatedAt` | datetime | Letzte Änderung |

Alle Felder schreibt ausschließlich der Server per Raw-DDB, mit einer
Ausnahme: der Client setzt `briefingStatus` bzw. `briefingAddendumStatus` auf
`REQUESTED` (für „Generate now" / „Try again").

### Ablauf

**Trigger (serverseitig):**

- Neue Streams auf `MeetingParticipant` (INSERT) und `ProjectActivity`
  (INSERT, aufgelöst über Activity -> Meeting). Ein Trigger-Lambda:
  - setzt am Meeting `briefingStatus = WAITING` (wenn noch kein Briefing `DONE`)
    bzw. `briefingAddendumStatus = WAITING` (wenn Briefing `DONE`),
  - legt den One-Time-Schedule `meeting-briefing-<meetingId>` auf
    „jetzt + 20 Sekunden" an bzw. überschreibt ihn.
- REMOVE-Ereignisse werden ignoriert. Ein neues Meeting ohne Personen/Projekte
  löst nichts aus.
- „Generate now" / „Try again": Client setzt den jeweiligen Status auf
  `REQUESTED`. Der bestehende Meeting-Stream erkennt den Übergang und ruft das
  Briefing-Lambda direkt auf. Der Schedule bleibt bestehen und wird beim
  Feuern zum No-op.

**Briefing-Lambda `meeting-briefing` (Entscheidungslogik):**

1. Aktuelle Teilnehmer- und Projekt-IDs laden.
2. Ist noch kein Briefing `DONE`: volles Briefing schreiben (Status
   `GENERATING`, danach `DONE`), `briefingCoveredIds` = aktuelle IDs.
   Kommt während `GENERATING` etwas hinzu, setzt der Trigger erneut `WAITING`
   und einen neuen Schedule. Das laufende Lambda setzt `DONE` deshalb nur mit
   einer Condition (`briefingStatus = GENERATING`); schlägt sie fehl, speichert
   es den Text, lässt den Status auf `WAITING`, und der nächste Lauf schreibt
   das Briefing komplett neu (kein Nachtrag).
3. Ist das Briefing `DONE` und gibt es IDs, die nicht in `briefingCoveredIds`
   stehen: Nachtrag schreiben, an `briefingAddenda` anhängen,
   `briefingCoveredIds` erweitern.
4. Ist das Briefing `DONE` und es gibt keine neuen IDs: nichts tun (Status
   zurück auf `DONE` falls `WAITING`).

Die Entscheidung (voll / Nachtrag / No-op) ist eine reine Funktion über
Status, abgedeckte IDs und aktuelle IDs und wird separat getestet.

### UI

Einklappbare Karte „Briefing" oben in der Meeting-Ansicht, über den Notizen.
Aktualisierung über die bestehende `Meeting.onUpdate`-Subscription in
`api/useMeeting.ts`. Texte (Englisch, ohne Gedankenstriche):

| Zustand | Anzeige |
|---|---|
| Keine Personen/Projekte, kein Briefing | Karte ausgeblendet |
| `WAITING` | „Briefing coming up in a moment" + Button „Generate now" |
| `REQUESTED` / `GENERATING` | „Writing briefing…" |
| `DONE` | Briefing-Text, darunter Nachträge |
| Nachtrag `WAITING` | unter dem Briefing: „Waiting for more changes…" |
| Nachtrag `REQUESTED` / `GENERATING` | unter dem Briefing: „Adding to briefing…" |
| `ERROR` | „Couldn't create the briefing" + Button „Try again" |
| Nachtrag `ERROR` | Briefing bleibt, Hinweis + Button „Try again" |

Nachträge sind optisch klar vom Briefing abgesetzt (eigene Überschriftzeile mit
Uhrzeit und „Added: …"). Keine statischen Akzent-Rahmen; Hervorhebung nur bei
Hover.

### Fehlerbehandlung

- Lambda-Fehler: Status `ERROR`, bestehende Inhalte bleiben unverändert.
- Fehlende Personen-Summary: Fallback auf Name/Firma/Position.
- Fehlende/verwaiste Projekt- oder Notizdaten: Quelle überspringen.

---

## Tests und Verifikation

- Unit-Tests: Entscheidungslogik voll / Nachtrag / No-op, Eingabe-Hash der
  Personen-Summary, Prompt-Rendering (beide Prompts).
- Sandbox mit echten Daten (Prod -> Sandbox Seeding):
  - Personen-Summary für einige Personen erzeugen, Inhalt prüfen,
    Debounce-Verhalten bei Änderungen prüfen.
  - Backfill an ca. 20 Personen.
  - Meeting anlegen (nichts passiert), Personen/Projekte hinzufügen,
    20-Sekunden-Debounce und „Generate now" prüfen, Neu-Schreiben vor `DONE`
    prüfen, nach `DONE` eine Person hinzufügen und Nachtrag prüfen, Entfernen
    ohne Wirkung prüfen.
- PR-CI (Lockfile, Build, tsc, Lint) muss grün sein.
