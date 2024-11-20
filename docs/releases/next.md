# Sortierung der Kunden in Wochenplanung korrigieren (Version :VERSION)

- In der Wochenplanung wird nun immer die gesamte Pipeline der Kunden für die Sortierung herangezogen und nicht nur die Pipeline für der Projekte, die gerade nicht auf On Hold gesetzt wurden.
- Projekte, die keinem Kunden zugeordnet sind, werden nun auch in der Planung angezeigt.

## In Arbeit

## Geplant

### Account Details

- Bei Accounts sollten auch Projekte auftauchen, bei denen der Account als Partner engagiert ist; das gleiche gilt auch für die Notizen.
- Ich möchte eine Möglichkeit haben, um zu dokumentieren, was ein Kunde mit einem Partner macht und mir dazu auch schnell eine Übersicht/Matrix erstellen können.
- Chart auch auf der Account-Detailseite anzeigen. Dort dann nach Payer Accounts aufgeteilt

### Kontaktdetails

- Geschenkideen dokumentieren
- Ich möchte Kontaktdetails in die Zwischenablage kopieren können.
- Ich möchte einfach nur ein Kontaktdetail in das Formular kopieren und das Formular entscheidet automatisch anhand des Inhalts und anhand des Kontexts, um welche Information es sich wahrscheinlich handelt. Wenn die Information eindeutig ist, wird der Inhalt direkt gespeichert und das Formular direkt geschlossen.
- Weitere persönliche Jahrestage abbilden (Tauftag, Taufentscheidung etc.).
- Bei Personen sollen unter Notizen nicht nur die Meetings auftauchen, an denen sie partizipiert haben, sondern auch wenn sie erwähnt wurden.
- Kontaktdetails als Adressbuch ins iPhone einbinden.

### Lektüre

- Ich möchte Notizen zu Lektüre (Bücher/Artikel/Vorträge) sammeln können und vermerken, zu welchen Projekten sie einen Beitrag leisten.

### Wochen-/Tagesplanung

- In Wochenplanung persönliche Termine mit berücksichtigen (Geburtstage, Jahrestage).
- Ich möchte einfache Todos haben, die keinem Projekt zugeordnet sind.
- Eine Checkliste einführen für das wöchentliche oder tägliche Planen.

### Inbox

- Die Verarbeitung in der Inbox soll auch ermöglichen Gelerntes zu Personen abzulegen.
- Wenn die Internetverbindung gerade nicht so stabil ist und ein neues Inbox Item erstellt wird, kann es eine Weile dauern und in der Zeit ist für den Anwender nicht sichtbar, dass der Eintrag gerade gespeichert wird.
- Die Inobx ist nicht wirklich toll und schnell. Das muss vom Ablauf her besser werden.

### Projekte

- Bei in Notizen erwähnten Personen direkt das Schreiben einer Email oder das Anrufen (auf dem Smartphone) anbieten.
- Das Datum des letzten Uploads von CRM Daten anzeigen.
- Die Uploads für CRM Projekte sollen ähnlich wie bei den Finanzdaten eine Historie ermöglichen.
- Eine "Lean-Ansicht" wäre toll, zum Beispiel, wenn ich Notizen zu einem Projekt sehen möchte, dann scrolle ich einfach durch die Notizen ohne erst Akkordions aufklappen zu müssen.
- Wenn ich eine Aufgabe abgeschlossen haben, möchte ich sehr häufig eine Notiz erfassen und eine Folgeaufgabe. Das ist im Moment recht kompliziert, weil ich erst ins Projekt, dann dort die Notizen aufklappen, eine neue Aktivität erzeugen und schließlich dort wieder die Notizen aufklappen, bevor ich etwas notieren kann. Besser wäre ein Button: "Done and take note" oder so.

### Finanzdaten

- Das Datum des letzten Uploads anzeigen.
- Darstellen, was sich seit dem letzten Upload geändert hat.
- Auch Finanzdaten darstellen ohne Payer Account ID, um eine längere Historie zu ermöglichen (z.B. mit einem Payer Account `000000000000`).
- TTM anzeigen.
- Mit LLM oder einfach auf Formular-Basis erstellte Revenue Statements zur Verfügung stellen.
- Umsätze der Unternehmen anzeigen (Jahresumsatz etc.).

### Künstliche Intelligenz

- Die Notizen und Todos mithilfe von Bedrock durchsuchbar machen ([Artikel 1](https://aws.amazon.com/de/blogs/machine-learning/build-generative-ai-agents-with-amazon-bedrock-amazon-dynamodb-amazon-kendra-amazon-lex-and-langchain/) und [Artikel 2](https://medium.com/@dminhk/adding-amazon-dynamodb-memory-to-amazon-bedrock-using-langchain-expression-language-lcel-%EF%B8%8F-1ca55407ecdb))

### Suche

- Ich möchte über alle Objekte in der App suchen können: Meetings, Projekte, Personen, Kunden, Notizen. Ich möchte, dass die Suchergebnisse relevant sind.

## Fehler

### Navigation

- Die Navigation wird langsam zu lang. Da muss ich mir was überlegen. Bei recht kurzen Suchbegriffen (z.B. ECR Tag) wird die Auswahl zu wenig eingeschränkt.
