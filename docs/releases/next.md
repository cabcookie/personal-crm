# Monatliche Umsätze der Kunden abbilden (Version :VERSION)

- Datenbankschema ist erweitert, um das Hochladen von Kundenumsätzen zu unterstützen.
- Tableau Daten können nun importiert werden. Dazu werden die Kunden mit ihren Payer Accounts gezeigt und den jeweiligen Umsätzen pro Monat. Es wird auf Probleme hingewiesen, wenn die Payer Accounts nicht zugeordnet werden konnten. Meist liegt das daran, dass der Kundenname nicht übereinstimmt oder dass der Payer Account dem Kunden noch zugeordnet werden muss.

## Packages aktualisiert

Von "Current" auf "Latest" aktualisiert:

| Package                          | Current | Wanted  | Latest  |
| -------------------------------- | ------- | ------- | ------- |
| @commitlint/config-conventional  | 18.6.3  | 18.6.3  | 19.5.0  |
| @typescript-eslint/eslint-plugin | 7.18.0  | 7.18.0  | 8.11.0  |
| @typescript-eslint/parser        | 7.18.0  | 7.18.0  | 8.11.0  |
| commitlint                       | 18.6.1  | 18.6.1  | 19.5.0  |
| eslint-plugin-prettier           | 4.2.1   | 4.2.1   | 5.2.1   |
| lucide-react                     | 0.379.0 | 0.379.0 | 0.453.0 |
| prettier                         | 2.8.8   | 2.8.8   | 3.3.3   |

## In Arbeit

- Monatliche Umsätze der Kunden abbilden

## Geplant

### Account Details

- Bei Accounts sollten auch Projekte auftauchen, bei denen der Account als Partner engagiert ist; das gleiche gilt auch für die Notizen.
- Ich möchte eine Möglichkeit haben, um zu dokumentieren, was ein Kunde mit einem Partner macht und mir dazu auch schnell eine Übersicht/Matrix erstellen können.

### Kontaktdetails

- Ich möchte Kontaktdetails in die Zwischenablage kopieren können.
- Ich möchte einfach nur ein Kontaktdetail in das Formular kopieren und das Formular entscheidet automatisch anhand des Inhalts und anhand des Kontexts, um welche Information es sich wahrscheinlich handelt. Wenn die Information eindeutig ist, wird der Inhalt direkt gespeichert und das Formular direkt geschlossen.
- Weitere persönliche Jahrestage abbilden (Tauftag, Taufentscheidung etc.).
- Bei Personen sollen unter Notizen nicht nur die Meetings auftauchen, an denen sie partizipiert haben, sondern auch wenn sie erwähnt wurden.
- Geschenkideen dokumentieren

### Lektüre

- Ich möchte Notizen zu Lektüre (Bücher/Artikel/Vorträge) sammeln können und vermerken, zu welchen Projekten sie einen Beitrag leisten.

### Wochen-/Tagesplanung

- Ich möchte Todos auch nachträglich der Tagesliste hinzufügen können.
- In Wochenplanung persönliche Termine mit berücksichtigen (Geburtstage, Jahrestage).
- Ich möchte einfache Todos haben, die keinem Projekt zugeordnet sind.
- Eine Checkliste einführen für das wöchentliche oder tägliche Planen.

### Inbox

- Die Verarbeitung in der Inbox soll auch ermöglichen Gelerntes zu Personen abzulegen.
- Wenn die Internetverbindung gerade nicht so stabil ist und ein neues Inbox Item erstellt wird, kann es eine Weile dauern und in der Zeit ist für den Anwender nicht sichtbar, dass der Eintrag gerade gespeichert wird.

### Besprechungen

- Teilnehmer und Notizen in Zwischenablage kopieren, um schneller ins Quip oder Slack zu kopieren oder eine Email zu verfassen.
- Es wäre klasse, kommende Meetings in dem CRM zu vermerken.

### Projekte

- Eine "Lean-Ansicht" wäre toll, zum Beispiel, wenn ich Notizen zu einem Projekt sehen möchte, dann scrolle ich einfach durch die Notizen ohne erst Akkordions aufklappen zu müssen.
- Wenn ich eine Aufgabe abgeschlossen haben, möchte ich sehr häufig eine Notiz erfassen und eine Folgeaufgabe. Das ist im Moment recht kompliziert, weil ich erst ins Projekt, dann dort die Notizen aufklappen, eine neue Aktivität erzeugen und schließlich dort wieder die Notizen aufklappen, bevor ich etwas notieren kann. Besser wäre ein Button: "Done and take note" oder so.

### Künstliche Intelligenz

- Die Notizen und Todos mithilfe von Bedrock durchsuchbar machen ([Artikel 1](https://aws.amazon.com/de/blogs/machine-learning/build-generative-ai-agents-with-amazon-bedrock-amazon-dynamodb-amazon-kendra-amazon-lex-and-langchain/) und [Artikel 2](https://medium.com/@dminhk/adding-amazon-dynamodb-memory-to-amazon-bedrock-using-langchain-expression-language-lcel-%EF%B8%8F-1ca55407ecdb))

## Fehler

### Notizen

- Mir scheint, dass Links in Notizen nicht sauber gespeichert werden.
- Notizen zeigen hier und da immer noch den Status, dass sie nicht im Einklang mit der Datenbank sind.

### Navigation

- Die Navigation wird langsam zu lang. Da muss ich mir was überlegen. Bei recht kurzen Suchbegriffen (z.B. ECR Tag) wird die Auswahl zu wenig eingeschränkt.
