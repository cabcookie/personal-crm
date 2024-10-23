# Fehlerbehebungen an der UI (Version :VERSION)

## Tagesplanung

- Bei der Tagesplanung sind die Projekttitel nun am Kopf der Seite angeheftet.

## Inbox

- Die Einträge in der Inbox zeigen nun auch Metainformationen (wann erstellt und wann bearbeitet).
- Einträge in der Inbox sind nun durch eine Linie voneinander getrennt, um die einzelnen Einträge besser voneinander abgrenzen zu können.

## In Arbeit

- Die Schnelleingabe für die Inbox hat nun einen Scrollbereich, damit auch längere Einträge verarbeitet werden können.

## Geplant

- Der Cost Explorer Link ist fehlerhaft.

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
